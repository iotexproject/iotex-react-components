import log from "fancy-log";
import {
  existsSync,
  mkdirSync,
  readdir,
  readFile,
  writeFile,
  writeFileSync
} from "fs";
import { resolve } from "path";

export interface GitDiff {
  status: "modified" | "untracked" | "deleted";
  path: string;
  sha1: string;
  sha: string;
  size: number;
  oldSize: number;
  hunks: string[];
}

export interface Timestamp {
  time: string;
  stamp: number;
}

export interface Archive {
  timestamp: Timestamp;
  content: string;
}

export type LineType = "comment" | "normal";

export type Language = "en" | "zh-CN" | "de" | "es" | "ru" | "vi";

export interface Config {
  monitorLanguages: Language[];
  output: string; // output dir for monitoring files;
  source: string; // source dir to be monitored;
}

export interface WatchedFile {
  path: string;
  output: string;
  language: Language;
  name: string;
}

export type ResultStatus = "success" | "fail" | "clean";

export interface UpdateResult {
  status: ResultStatus;
  file: WatchedFile;
  error?: NodeJS.ErrnoException;
}

const git = require("nodegit-kit");
const ENCODE_TYPE = "utf-8";

class Base {
  protected updateArchive = (data: Archive[]): Archive[] => {
    const old = data.slice(0, -1);
    const updated = data[data.length - 1];
    const {
      timestamp: { time }
    } = updated;
    const index = old.findIndex(item => item.timestamp.time === time);
    let result: Archive[];

    if (index === -1) {
      result = [...old, updated];
    } else {
      result = [...old];
      result[index] = updated;
    }

    return result.filter(
      item =>
        !this.isEmpty(item.content) && !this.onlyDeletedContent(item.content)
    );
  };

  /**
   * @description sort content by asc
   */
  protected sortArchives = (archives: Archive[]): Archive[] => {
    return archives.sort((o, n) => {
      const oStamp = o.timestamp.stamp;
      const nStamp = n.timestamp.stamp;
      if (oStamp > nStamp) {
        return -1;
      } else if (oStamp === nStamp) {
        return 0;
      } else {
        return 1;
      }
    });
  };

  /**
   * @description Transform string to Archive;
   */
  protected toArchive(target: string): Archive[] {
    if (/^\s*$/.test(target)) {
      return [];
    }

    const reg = /(#<{2})(.[\n\r]{0,2})+>{2}/g;
    const dateReg = /\d{4}(-\d{1,2}){2}/;
    const stampReg = /(?<=-+)\d+(?=-+>{2})/;
    const result = target.match(reg);

    return !!result
      ? result.map(item => {
          const stamp = +item.match(stampReg)![0];
          const time = item.match(dateReg)![0];

          return { timestamp: { time, stamp }, content: item };
        })
      : [];
  }

  private isEmpty(archive: string): boolean {
    const ary = this.getArchiveItem(archive)
      .map(item => item.trim())
      .filter(item => !!item);

    return !ary.length;
  }

  /**
   * @description Only includes deleted content or not;
   */
  private onlyDeletedContent(archive: string): boolean {
    return this.getArchiveItem(archive).every(item => item.startsWith("#"));
  }

  /**
   * @description archive content;
   */
  protected addArchiveFlag(
    content: string,
    { time, stamp }: Timestamp,
    isMerged = false
  ): string {
    const start = `#<<----Updated Start---${time}-------\n\n`;
    const end = !isMerged
      ? `\n\n#------Updated End-----${stamp}----->>`
      : `\n\n#------Updated End--(merged)---${stamp}----->>`;

    return start + content + end;
  }

  protected getArchiveItem(archive: string): string[] {
    return archive
      .split(/\n|\r/)
      .slice(1, -1)
      .filter(item => !!item);
  }

  private getArchiveWrapper(archive: string): { start: string; end: string } {
    const ary = archive.split(/\n|\r/);

    return {
      start: ary[0] + "\n",
      end: "\n" + ary[ary.length - 1]
    };
  }

  /**
   * @description Get key from string;
   */
  protected getKey(target: string): string {
    const str = target.startsWith("#") ? target.substr(1) : target;
    const reg = /^[a-zA-Z][\w\-_.\\/]+(?=:)/;

    if (reg.test(str)) {
      return str.match(reg)![0];
    }
    return str;
  }

  protected removeDeleted = (archives: Archive[]): Archive[] => {
    return archives.map(({ timestamp, content }) => ({
      timestamp,
      content: this.removeDeletedItem(content)
    }));
  };

  /**
   * @description Remove deleted content;
   */
  private removeDeletedItem(archive: string): string {
    const data = this.getArchiveItem(archive);
    const obj: { [key: string]: { index: number; type: LineType }[] } = {};

    data.forEach((item, index) => {
      const key = this.getKey(item);
      const type = item.startsWith("#") ? "comment" : "normal";

      if (!obj[key]) {
        obj[key] = [{ index, type }];
      } else {
        obj[key].push({ index, type });
      }
    });

    const needToRemove = Object.values(obj)
      .filter(ary => ary.length === 1 && ary[0].type === "comment")
      .map(item => item[0].index);
    const result = data.filter((_, index) => !needToRemove.includes(index));
    const { start, end } = this.getArchiveWrapper(archive);

    return [start, ...result, end].join("\n");
  }

  /**
   * @description Generate timestamp;
   */
  protected getTimestamp(): Timestamp {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return { time: `${year}-${month}-${day}`, stamp: date.getTime() };
  }

  /**
   * @description Replace flag created by git.
   */
  protected replaceHunkFlag(str: string): string {
    if (str.startsWith("-")) {
      return "#" + str.substr(1);
    } else if (str.startsWith("+")) {
      return str.substr(1);
    } else {
      return str;
    }
  }

  protected combine<T>(...fns: ((arg: T) => T)[]) {
    return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
  }
}

class Watcher extends Base {
  private file: WatchedFile;

  constructor(file: WatchedFile) {
    super();
    this.file = file;
    this.checkDir(file);
  }

  async start(): Promise<UpdateResult> {
    const oldContent = await this.getOldContent(this.file);
    const diff = await this.getDiff(this.file);
    const updatedContent = await this.getUpdatedContent(diff);

    return this.updateContent(
      oldContent,
      updatedContent,
      diff ? "success" : "clean"
    );
  }

  /**
   * @description If output folder does not exist, create it.
   * If the source folder does not exist, interrupt execution.
   */
  private checkDir({ output, path }: WatchedFile): void {
    const idx = output.lastIndexOf("/");
    const outputDir = output.slice(0, idx);

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir);
    }

    if (!existsSync(path)) {
      throw new Error("The folder of i18n yaml is not exists!");
    }
  }

  /**
   * @description Get file content before update, if the target file is not exist, create it here.
   */
  private async getOldContent({ output }: WatchedFile): Promise<string> {
    return new Promise(resolve => {
      const isExists = existsSync(output);

      if (isExists) {
        readFile(
          output,
          ENCODE_TYPE,
          (error: NodeJS.ErrnoException | null, data: string) => {
            if (error) {
              throw error;
            }
            resolve(data);
          }
        );
      } else {
        const content = "";

        writeFileSync(output, "");
        resolve(content);
      }
    });
  }

  private async getDiff(file: WatchedFile): Promise<GitDiff | undefined> {
    const repo = await git.open(`${process.cwd()}/.git`);
    const diffs: GitDiff[] = await git.diff(repo);
    return diffs.find(item => {
      const status = item.status;
      const statusValid = status === "modified" || status === "untracked";

      return statusValid && item.path.includes(file.name);
    });
  }

  /**
   * @description Get content which need to update;
   */
  private async getUpdatedContent(
    yamlDiff: GitDiff | undefined
  ): Promise<string> {
    if (!yamlDiff) {
      return this.addArchiveFlag(" ", this.getTimestamp());
    }

    const reg = /(?<=[\r\n])[+-]{1}.+(?=[\r\n])/g;
    const result = yamlDiff.hunks
      .reduce(
        (acc: string[], cur: string) => [...acc, ...(cur.match(reg) || [])],
        []
      )
      .map(hunk => this.replaceHunkFlag(hunk));

    return this.addArchiveFlag(result.join("\n"), this.getTimestamp());
  }

  /**
   * @description Update content
   */
  private updateContent(
    old: string,
    target: string,
    status: ResultStatus
  ): Promise<UpdateResult> {
    const oldArchive = this.toArchive(old);
    const newArchive = this.toArchive(target);
    const handle = this.combine<Archive[]>(
      this.updateArchive,
      this.removeDeleted,
      this.sortArchives
    );
    const content = handle([...oldArchive, newArchive[0]])
      .map(({ content }) => content)
      .join("\n\n\n");
    const output = this.file.output;

    return new Promise(resolve => {
      writeFile(
        output,
        content,
        ENCODE_TYPE,
        (error: NodeJS.ErrnoException | null) => {
          if (error) {
            log.error(`Update ${output} failed!`);
            resolve({ status: "fail", file: this.file, error });
          }
          resolve({ status, file: this.file });
        }
      );
    });
  }
}

function check({
  source,
  output,
  monitorLanguages
}: Config): Promise<WatchedFile[]> {
  const sourcePath = resolve(source);
  const outputPath = resolve(output);

  return new Promise(resolve => {
    readdir(
      sourcePath,
      { withFileTypes: true },
      (error: NodeJS.ErrnoException | null, data) => {
        if (error) {
          throw error;
        }
        const files = data
          .filter(item => item.isFile() && item.name.endsWith("yaml"))
          .map(file => file.name);
        const targetFiles: { name: string; lan: Language }[] = monitorLanguages
          .map(lan => {
            const name = files.find(item => item.startsWith(lan)) || "";

            return { name, lan };
          })
          .filter(item => !!item.name);

        if (targetFiles.length < monitorLanguages.length) {
          log.warn("Some source files can not be found");
        }

        const result = targetFiles.map(({ name, lan }) => ({
          path: `${sourcePath}/${name}`,
          output: `${outputPath}/${lan}.modified.yaml`,
          language: lan,
          name
        }));

        resolve(result);
      }
    );
  });
}

export function i18nMonitor(config: Config): () => void {
  const source = check(config);

  return () => {
    source.then(files => {
      files.forEach(file => {
        const target = new Watcher(file);

        target.start().then(({ file, status, error }) => {
          if (status === "clean") {
            log.info(`${file.name} is clean`);
          } else if (status === "fail") {
            log.warn(`${file.name} failed: \n ${error!.toString()}`);
          } else {
            log.info(`${file.name} update success`);
          }
        });
      });
    });
  };
}

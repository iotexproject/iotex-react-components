// tslint:disable:no-unnecessary-class

export class Languages {
  static get EN(): string {
    return "en";
  }

  static get ZH_CN(): string {
    return "zh-CN";
  }

  static get ZH_TW(): string {
    return "zh-TW";
  }

  static get KO(): string {
    return "ko";
  }

  static get RU(): string {
    return "ru";
  }

  static get JA(): string {
    return "ja";
  }

  static get ID(): string {
    return "id";
  }

  static get IT(): string {
    return "it";
  }

  static get ES(): string {
    return "es";
  }
}

export const SUPPORTED_LANGUAGES = [
  Languages.EN,
  Languages.ZH_CN,
  Languages.KO,
  Languages.RU,
  Languages.IT
];

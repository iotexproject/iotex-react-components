export type Language =
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ko"
  | "ru"
  | "ja"
  | "id"
  | "it"
  | "es";

export const Languages: { [key: string]: Language } = {
  EN: "en",
  ZH_CN: "zh-CN",
  ZH_TW: "zh-TW",
  KO: "ko",
  RU: "ru",
  JA: "ja",
  ID: "id",
  IT: "it",
  ES: "es"
};

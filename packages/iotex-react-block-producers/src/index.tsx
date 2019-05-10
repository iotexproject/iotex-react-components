// tslint:disable:no-var-requires
// @ts-ignore
import isBrowser from "is-browser";
import { createWebBpApolloClient } from "./apollo-client";
const JsonGlobal = require("safe-json-globals/get");
// @ts-ignore
import { initClientI18n } from "onefx/lib/iso-i18n";
const state = (isBrowser && JsonGlobal("state")) || {};
const base = (state && state.base) || {};
const { translations } = base;
if (translations) {
  initClientI18n(translations);
}
import { BlockProducers } from "./block-producers";
import { RenderDelegateComponent } from "./block-producers-list";

export default BlockProducers;
export { createWebBpApolloClient };
export { RenderDelegateComponent };

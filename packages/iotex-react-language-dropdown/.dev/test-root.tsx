import React from "react";
// @ts-ignore
import { RootServer } from "onefx/lib/iso-react-render/root/root-server";
// @ts-ignore
import { Client as StyletronClient } from "styletron-engine-atomic";
// @ts-ignore
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
import { STYLETRON_GLOBAL } from "../src/__test__/index.test";

export function TestRoot({ children }: { children: JSX.Element }) {
  const store = configureStore({}, (state: object) => state);
  const stylesheets = document.getElementsByClassName(STYLETRON_GLOBAL);
  const styletron = new StyletronClient({ hydrate: stylesheets, prefix: "_" });

  return (
    <RootServer store={store} styletron={styletron}>
      {children}
    </RootServer>
  );
}

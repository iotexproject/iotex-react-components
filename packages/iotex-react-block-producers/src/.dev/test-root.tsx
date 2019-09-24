// @ts-ignore
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
// @ts-ignore
import { RootServer } from "onefx/lib/iso-react-render/root/root-server";
import React from "react";
// @ts-ignore
import { Client as StyletronClient } from "styletron-engine-atomic";

const STYLETRON_GLOBAL = "styletron-global";

export function TestRoot({ children }: { children: JSX.Element }): JSX.Element {
  const store = configureStore({ base: {} }, (state: object) => state);
  const stylesheets = document.getElementsByClassName(STYLETRON_GLOBAL);
  const styletron = new StyletronClient({ hydrate: stylesheets, prefix: "_" });

  return (
    <RootServer store={store} styletron={styletron} context={{}} location="">
      {children}
    </RootServer>
  );
}

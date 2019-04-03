import test from "ava";
import render from "react-test-renderer";
import React from "react";
// @ts-ignore
import browserEnv from "browser-env";
import Component from "..";
import { TestRoot } from "../../.dev/test-root";
browserEnv();

export const STYLETRON_GLOBAL = "styletron-global";

test("Component snapshot", async t => {
  const tree = render
    .create(
      <TestRoot>
        <Component />
      </TestRoot>
    )
    .toJSON();
  t.snapshot(tree);
});

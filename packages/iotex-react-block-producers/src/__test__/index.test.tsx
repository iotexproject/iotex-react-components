import test from "ava";
// @ts-ignore
import browserEnv from "browser-env";
import React from "react";
import render from "react-test-renderer";
import Component from "..";
import { TestRoot } from "../.dev/test-root";
browserEnv();

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

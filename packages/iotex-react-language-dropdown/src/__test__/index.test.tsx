import test from "ava";
// @ts-ignore
import browserEnv from "browser-env";
import React from "react";
import render from "react-test-renderer";
import Component from "..";
import { TestRoot } from "../.dev/test-root";
import { LanguageSwitcher } from "../language-switcher";
import { Languages } from "../supported-languages";

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

test("LanguageSwitcher snapshot", async t => {
  const tree = render
    .create(
      <TestRoot>
        <LanguageSwitcher supportedLanguages={[Languages.KO]} />
      </TestRoot>
    )
    .toJSON();
  t.snapshot(tree);
});

import test from "ava";
// @ts-ignore
import browserEnv from "browser-env";
import React from "react";
import render from "react-test-renderer";
import Component, { createWebBpApolloClient } from "..";
import { TestRoot } from "../.dev/test-root";
browserEnv();

test("Component snapshot", async t => {
  const tree = render
    .create(
      <TestRoot>
        <Component
          apolloClient={createWebBpApolloClient(
            "https://member.iotex.io/api-gateway/",
            "web-bp"
          )}
          badgeImg={
            "https://user-images.githubusercontent.com/38968374/61657311-7e350380-ac77-11e9-86ea-0e87869e7962.png"
          }
        />
      </TestRoot>
    )
    .toJSON();
  t.snapshot(tree);
});

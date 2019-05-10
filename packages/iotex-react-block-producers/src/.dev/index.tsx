import React from "react";
// @ts-ignore
import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
import Component, { createWebBpApolloClient } from "..";

clientReactRender({
  VDom: (
    <Component
      apolloClient={createWebBpApolloClient(
        "https://member.iotex.io/api-gateway/"
      )}
    />
  ),
  clientScript: "/main.js"
});

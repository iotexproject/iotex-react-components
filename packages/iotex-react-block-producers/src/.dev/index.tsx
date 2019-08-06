import React from "react";
// @ts-ignore
import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
import Component, { createWebBpApolloClient } from "..";

const trophy =
  "https://imgc.iotex.io/dd47adfyb/image/upload/v1565045403/61657311-7e350380-ac77-11e9-86ea-0e87869e7962.png";

clientReactRender({
  VDom: (
    <Component
      apolloClient={createWebBpApolloClient(
        "https://member.iotex.io/api-gateway/"
      )}
      badgeImg={trophy}
    />
  ),
  clientScript: "/main.js"
});

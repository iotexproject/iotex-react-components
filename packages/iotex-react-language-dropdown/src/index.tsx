import React from "react";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";

const StyledDiv = styled("div", {
  color: "red"
});

export default function HelloWorld() {
  return <StyledDiv>hello world!</StyledDiv>;
}

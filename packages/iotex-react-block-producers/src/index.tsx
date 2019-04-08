// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";

const StyledDiv = styled("div", {
  color: "red"
});

export default function HelloWorld(): JSX.Element {
  return <StyledDiv>hello world!</StyledDiv>;
}

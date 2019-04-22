import React from "react";
import { shade } from "./shade";
import { colors } from "./style-color";

export const colorHover = (color: string) => {
  return {
    color,
    ":hover": {
      color: shade(color)
    }
  };
};

// @ts-ignore
export const Fa = ({ style, children, ...others }) => {
  return (
    <i
      {...others}
      style={{
        fontSize: "24px!important",
        ...colorHover(colors.brand01),
        ...style
      }}
    >
      {children}
    </i>
  );
};

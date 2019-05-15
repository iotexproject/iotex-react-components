import React from "react";
import { colors } from "./style-color";

type Props = {
  size?: number;
  color?: string;
};

export function Circle({ size = 8, color = colors.black }: Props): JSX.Element {
  return (
    <div
      style={{
        borderRadius: "50%",
        width: `${size}pt`,
        height: `${size}pt`,
        backgroundColor: color
      }}
    />
  );
}

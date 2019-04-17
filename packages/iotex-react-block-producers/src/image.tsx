// tslint:disable:no-any
// tslint:disable:no-http-string
import React from "react";

const LEN = "100%";
class CloudinaryImage {
  public url: string;

  constructor(url: string) {
    this.url = url || "";
  }

  public changeWidth(w: number): CloudinaryImage {
    return new CloudinaryImage(this.url.replace("upload", `upload/w_${w}`));
  }

  public cdnUrl(): string {
    return this.url.replace("res.cloudinary.com", "imgc.iotex.io");
  }
}

export function cloudinaryImage(url: string): CloudinaryImage {
  return new CloudinaryImage(url);
}
type PropTypes = {
  src: string;
  width?: string;
  height?: string;
  resizeWidth?: number;
  style?: any;
  children?: any;
};
export function Image({
  width = LEN,
  height = LEN,
  src,
  resizeWidth,
  children,
  style
}: PropTypes): JSX.Element {
  let url = src;
  if (url && (url.indexOf("https://") === 0 || url.indexOf("http://") === 0)) {
    if (url.indexOf("http:") === 0) {
      url = url.slice(5);
    }
    if (url.indexOf("https:") === 0) {
      url = url.slice(6);
    }

    let cImage = cloudinaryImage(url);
    if (resizeWidth) {
      cImage = cImage.changeWidth(resizeWidth);
    }
    url = cImage.cdnUrl();
  }
  if (children) {
    const StyledDiv = {
      backgroundImage: `url("${url}")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
      boxSizing: "border-box",
      width,
      height,
      ...style
    };
    return <div style={StyledDiv}>{children}</div>;
  }
  return (
    <img alt="image" width={width} height={height} src={url} style={style}>
      {children}
    </img>
  );
}

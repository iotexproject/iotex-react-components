// tslint:disable:no-var-requires
const shader = require("shader");

export function shade(color: string, num: number = -0.09): string {
  return shader(color, num);
}

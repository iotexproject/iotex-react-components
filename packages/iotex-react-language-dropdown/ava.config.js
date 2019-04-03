export default {
  require: ["ts-node/register"],
  files: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  compileEnhancements: false,
  extensions: ["ts", "tsx"]
};

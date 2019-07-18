const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const OUTPUT_DIR = "dist/";

module.exports = {
  mode: "production",
  entry: [path.resolve(__dirname, "src/index.ts")],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, OUTPUT_DIR)
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "awesome-typescript-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: ["node_modules", path.resolve(__dirname, "src")],
    // directories where to look for modules
    extensions: [".js", ".ts"]
  },
  plugins: [
    new UglifyJSPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: true,
        ecma: 6,
        mangle: true,
        comments: false
      },
      extractComments: true
    })
  ],
  node: {
    fs: "empty"
  },
  externals: [nodeExternals()]
};

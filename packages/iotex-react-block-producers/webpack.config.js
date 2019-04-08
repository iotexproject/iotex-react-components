const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpackConfig = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const process = require("global/process");

const ANALYZE = false;
const PROD = process.env.NODE_ENV === "production";
const OUTPUT_DIR = "dist/";

module.exports = {
  mode: PROD ? "production" : "development",
  entry: [path.resolve(__dirname, ".dev/index.tsx")],
  output: {
    filename: PROD ? "[name]-[chunkhash].js" : "[name].js",
    path: path.resolve(__dirname, OUTPUT_DIR)
  },
  ...(PROD ? {} : { devtool: "source-map" }),
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: require("./babel.config")
        }
      }
    ]
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: [
      "node_modules",
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, ".dev")
    ],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
    // extensions that are used
    alias: {}
    /* Alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, ".dev/index.ejs"),
      minify: { collapseWhitespace: true }
    }),
    ...(ANALYZE ? [new BundleAnalyzerPlugin()] : []),
    ...(PROD
      ? [
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
          }),
          new webpackConfig.DefinePlugin({
            "process.env": {
              NODE_ENV: JSON.stringify("production")
            }
          })
        ]
      : [])
  ],
  context: path.resolve(__dirname),
  devServer: {
    contentBase: path.join(__dirname, "lib"),
    compress: false,
    port: 9000
  }
};

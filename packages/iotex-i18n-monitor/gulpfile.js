const gulp = require("gulp");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const { i18nMonitor } = require("./lib");

const watchTypescript = done => {
  gulp.watch("./src/**/*", done => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        throw new Error("webpack plugin error");
      } else {
        console.info("[webpack]", stats.toString());
      }
      done();
    });
  });
  done();
};

const watchI18n = done => {
  const monitor = i18nMonitor({
    source: "./translations/",
    monitorLanguages: ["en", "zh-CN"],
    output: "./translations/update/"
  });
  const yaml = gulp.watch("translations/*.yaml");

  yaml.on("change", event => {
    monitor();
    done();
  });
  done();
};

const watch = gulp.parallel(watchTypescript, watchI18n);

exports.default = watch;

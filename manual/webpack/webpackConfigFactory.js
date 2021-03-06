/* eslint-disable import/no-unresolved */

const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const WriteFilePlugin = require("write-file-webpack-plugin");
const common = require("./webpack.common");
const paths = require("./paths");
const URLImportPlugin = require("../../webpack");

const envs = {
  development: "dev",
  production: "prod",
  test: "dev"
};
/* eslint-disable global-require,import/no-dynamic-require */
const env = envs[process.env.NODE_ENV || "development"];
const envConfig = require(`./webpack.${env}.js`);
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

module.exports = (siteId, options) => {
  const commonPaths = paths(siteId);
  const manifestName = `website-${siteId}`;
  const templatePath = path.resolve(
    __dirname,
    `../website${siteId}/template.html`
  );

  return webpackMerge(
    common(commonPaths),
    envConfig(commonPaths),
    {
      plugins: [
        new WriteFilePlugin(),
        new URLImportPlugin({
          manifestName,
          fileName: "importManifest.js",
          basePath: ``,
          publicPath: `//localhost:300${siteId}/`,
          writeToFileEmit: false,
          filter: null,
          debug: true,
        }),
        new HtmlWebpackPlugin({
          template: templatePath,
          inject: true
        })
      ]
    },
    options
  );
};

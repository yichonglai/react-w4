const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'production',
  performance: {
    hints: 'error', // 防止把体积巨大的 bundle 部署到生产环境，从而影响网页的性能。
    maxEntrypointSize: 4000000,
    maxAssetSize: 4000000,
  },
  // devtool: 'source-map',
  optimization: {
    // 告知 webpack 使用 TerserPlugin 压缩 bundle。
    // production 模式下(mode)，这里默认是 true。
    minimize: true,
    minimizer: [ // 覆盖默认压缩工具
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({}) // css压缩
    ]
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[hash:base64]',
                context: path.resolve(__dirname, '../src'),
                getLocalIdent: (context, localIdentName, localName) => {
                  // 全局样式定义
                  if (context.resourcePath.indexOf('assets/styles') !== -1) {
                    return localName;
                  }
                },
              },
              importLoaders: 2,
            }
          },
          "postcss-loader",
          "less-loader",
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:5].css",
      chunkFilename: "css/[name].[contenthash:5].css"
    }),
    new CleanWebpackPlugin(),
  ],
})
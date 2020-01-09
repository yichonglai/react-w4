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
    hints: 'error',
    maxEntrypointSize: 4000000,
    maxAssetSize: 4000000,
  },
  // devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:5].css",
      chunkFilename: "css/[name].[contenthash:5].css"
    }),
    new CleanWebpackPlugin(),
  ],
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
  }
})
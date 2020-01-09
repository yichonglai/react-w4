const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  performance: {
    hints: false,
    // maxEntrypointSize: 4000000,
    // maxAssetSize: 1000000,
  },
  devServer: {
    port: 8083,
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    hot: true,
    historyApiFallback: true,
    // open: true,
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[path][name]-[local]-[hash:base64:5]',
                context: path.resolve(__dirname, '../src'),
                getLocalIdent: (context, localIdentName, localName) => {
                  // 全局样式定义
                  if (context.resourcePath.indexOf('assets/styles') !== -1) {
                    return localName;
                  }
                },
              },
              importLoaders: 2,
              sourceMap: true,
            }
          },
          "postcss-loader",
          'less-loader'
        ],
        include: path.resolve(__dirname, '../src')
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
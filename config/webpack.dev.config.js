const merge = require('webpack-merge');
const common = require('./webpack.config');
const webpack = require('webpack');
const { ENV_CONFIG } = require('./base.config');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // 性能 配置webpack如何展示性能提示
  performance: {
    hints: "warning", // 提示类型
    // maxEntrypointSize: 4000000, // 入口
    // maxAssetSize: 1000000, // 任何资源
  },
  devServer: {
    port: ENV_CONFIG.port,
    contentBase: ENV_CONFIG.outputPath,
    compress: true,
    hot: true,
    historyApiFallback: true,
    publicPath: ENV_CONFIG.publicPath,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        // △
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[path][name]-[local]-[hash:base64:5]',
                // context: ENV_CONFIG.sourcePath,
                getLocalIdent: (context, localIdentName, localName) => {
                  // 全局样式定义
                  if (ENV_CONFIG.cssModulesExclude.some(path => context.resourcePath.indexOf(path) !== -1)) {
                    return localName;
                  }
                },
              },
              importLoaders: 2,
              sourceMap: true,
            }
          },
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
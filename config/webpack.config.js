const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  /**入口配置，默认名称main */
  entry: [
    path.resolve(__dirname, '../src/index.tsx')
  ],
  /**输出配置 */
  output: {
    path: path.resolve(__dirname, '../dist'), // 目标输出目录 path 的绝对路径。
    filename: 'js/[name].[hash:5].bundle.js', // 输出文件文件名
    chunkFilename: 'js/[name].[chunkhash:5].bundle.js', // 非入口(non-entry) chunk 文件的名称，「按需加载 chunk」的输出文件， chunkhash：基于每个 chunk 内容的 hash
    publicPath: '' // 运行时基准 如：当将资源托管到 CDN 时
  },
  /**优化 */
  optimization: {
    // 代码分离，提取公共代码, 对于动态导入模块，默认使用 webpack v4+ 提供的全新的通用分块策略
    // 替代CommonsChunkPlugin 默认配置为最佳实践 可自定义
    // 可不要
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all' // 将选择哪些块进行优化。
        },
        utils: { // 抽离自定义公共代码 包括入口点之间共享的所有代码。
          test: /\.(js|tsx?)$/,
          chunks: 'initial',
          name: 'utils',
          minSize: 0// 只要超出0字节就生成一个新包
        },
      },
    }
  },
  module: {
    /**加载器配置 ⬆️ */
    rules: [
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name() {
                if (process.env.NODE_ENV === 'development') {
                  return '[path][name].[ext]';
                }
                return 'images/[name].[contenthash].[ext]';
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.jsx?$/,
        // enforce: "pre", // 调整rules调用顺序 1、pre 优先处理 2、normal 正常处理（默认）3、inline 其次处理 post 最后处理
        use: [
          {
            loader: 'babel-loader', // 转es5 + polyfill
            options: {
              cacheDirectory: true,
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              cache: true,
              fix: true,
              emitWarning: true,
              quiet: true,
            }
          }
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader', // 转es5 + polyfill
            options: {
              cacheDirectory: true, // 缓存 loader 的执行结果，之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程
              // cacheCompression: true, // 默认值为 true。项目文件多的时候可以置false
            }
          },
          'ts-loader' // 转es6
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../index.html'),
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new ManifestPlugin(),
    new StylelintPlugin({
      emitWarning: true,
      context: path.resolve(__dirname, '../src'),
      files: '**/*.l?(e|c)ss',
      failOnError: false,
      quiet: true,
      fix: true
    })
  ],
  stats: {
    assets: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@assets': path.resolve(__dirname, '../src/assets/'),
      '@components': path.resolve(__dirname, '../src/components/'),
      '@page': path.resolve(__dirname, '../src/page/'),
      '@router': path.resolve(__dirname, '../src/router/'),
    }
  }
};
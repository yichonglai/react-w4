const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ENV_CONFIG } = require('./base.config');

module.exports = {
  /**入口配置，默认名称main */
  entry: [
    path.resolve(ENV_CONFIG.sourcePath, './index.tsx')
  ],
  /**输出配置 */
  output: {
    path: ENV_CONFIG.outputPath, // 目标输出目录 path 的绝对路径。
    filename: 'js/[name].[hash:5].bundle.js', // 输出文件文件名
    chunkFilename: 'js/[name].[chunkhash:5].bundle.js', // 非入口(non-entry) chunk 文件的名称，「按需加载 chunk」的输出文件， chunkhash：基于每个 chunk 内容的 hash
    publicPath: ENV_CONFIG.publicPath // 运行时基准, 影响资源生成路径 如：当将资源托管到 CDN 时
  },
  /**优化 */
  optimization: {
    // 代码分离，提取公共代码, 对于动态导入模块，默认使用 webpack v4+ 提供的全新的通用分块策略
    // 替代CommonsChunkPlugin 默认配置为最佳实践 可自定义
    // 可不要
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'vendors',
          chunks: 'all', // 将选择哪些块进行优化。
          // reuseExistingChunk: true, // reuse common chunk
          // enforce: true, // always create chunks for this cache group.
        },
        // utils: { // 抽离自定义公共代码 包括入口点之间共享的所有代码。
        //   test: /\.(jsx?|tsx?)$/,
        //   chunks: 'initial',
        //   name: 'utils',
        //   minSize: 0// 只要超出0字节就生成一个新包
        // },
      },
    }
  },
  module: {
    /**加载器配置 ⬆️ */
    rules: [
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        include: ENV_CONFIG.sourcePath,
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
        include: ENV_CONFIG.sourcePath,
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
        include: ENV_CONFIG.sourcePath,
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
    }),
    // Copies individual files or entire directories, which already exist, to the build directory.
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*'],
        cache: true,
      }
    ]),
    // Webpack plugin for generating an asset manifest (manifest.json) What does it do?.
    new ManifestPlugin(),
    ...ENV_CONFIG.stylelint_enable ? [new StylelintPlugin({
      emitWarning: true,
      context: ENV_CONFIG.sourcePath,
      configFile: path.resolve(__dirname, '../.stylelintrc.js'),
      files: '**/*.l?(e|c)ss', // Specify the glob pattern for finding files. Must be relative to options.context.
      failOnError: false,
      quiet: true,
      fix: true,
      // "scss"| "less" | "sugarss" 用来指定语法规则，不指定的情况下通过文件后缀自动识别：.less，.scss，.sss。
      // syntax: 'less'
    })] : [],

  ],
  // 控制台统计/构建信息
  stats: {
    assets: false,
    children: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@assets': path.resolve(ENV_CONFIG.sourcePath, './assets/'),
      '@components': path.resolve(ENV_CONFIG.sourcePath, './components/'),
      '@page': path.resolve(ENV_CONFIG.sourcePath, './page/'),
      '@router': path.resolve(ENV_CONFIG.sourcePath, './router/'),
    }
  }
};
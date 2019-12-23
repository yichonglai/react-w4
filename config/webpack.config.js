const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  /**输入配置 */
  entry: [
    path.resolve(__dirname, '../src/index.tsx')
  ],
  /**输出配置 */
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:5].bundle.js',
    chunkFilename: 'js/[name].[chunkhash:5].bundle.js',
    publicPath: '/'
  },
  /**提取公共代码 */
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        utils: { // 抽离自定义公共代码
          test: /\.(js|tsx?)$/,
          chunks: 'initial',
          name: 'utils',
          minSize: 0// 只要超出0字节就生成一个新包
        }
      },
    }
  },
  module: {
    /**加载器配置 */
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
        test: /\.(js|jsx)$/,
        enforce: "pre",
        use: [
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
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }
        ],
        include: path.resolve(__dirname, '../src')
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
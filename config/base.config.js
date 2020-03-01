const path = require('path');
const ENV_CONFIG = {
  /**是否启用stylelint */
  stylelint_enable: true,
  publicPath: '',
  outputPath: path.resolve(__dirname, '../dist'),
  sourcePath: path.resolve(__dirname, '../src'),
  // 开发端口
  port: 8083
};

module.exports = {
  ENV_CONFIG,
}
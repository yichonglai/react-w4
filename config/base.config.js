const path = require('path');
const ENV_CONFIG = {
  /**Enable/disable stylelint */
  stylelint_enable: true,
  publicPath: '',
  outputPath: path.resolve(__dirname, '../dist'),
  sourcePath: path.resolve(__dirname, '../src'),
  /**cssModule ignore path */
  cssModulesExclude: ['assets/styles', 'node_modules'],
  /**development port */
  port: 8083
};

module.exports = {
  ENV_CONFIG,
}
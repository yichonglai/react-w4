module.exports = (ctx) => {
  return {
    parser: false,
    map: ctx.env === 'development' ? 'inline' : false,
    plugins: [require('autoprefixer')]
  }
}
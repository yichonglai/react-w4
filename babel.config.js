const presets = [
  [
    "@babel/preset-env",
    {
      // targets: {
      //   edge: "17",
      //   firefox: "60",
      //   chrome: "67",
      //   safari: "11.1",
      // },
      useBuiltIns: "usage", // This option configures how @babel/preset-env handles polyfills. 将会按需引入babel/polyfill (corejs)。
      corejs: 3
    },
  ],
  "@babel/preset-react" // https://www.babeljs.cn/docs/babel-preset-react
];
const plugins = [
  // 'transform-runtime' 插件告诉 Babel要引用 runtime 来代替注入(辅助代码)。
  // Babel 对一些公共方法使用了非常小的辅助代码，比如 _extend。默认情况下会被添加到每一个需要它的文件中
  "@babel/plugin-transform-runtime",
  // 按需加载
  ["import", {
    "libraryName": "antd",
    "libraryDirectory": "es",
    "style": "css" // `style: true` 会加载 less 文件
  }]
];

module.exports = { presets, plugins };
const path = require('path');

module.exports = {
  // 入口文件名称
  entry: './index.js',
  // 输出文件名称
  output: {
      // 文件目录
      path: path.resolve(__dirname, 'dep'),
      // 文件名字
      filename: 'bundle.js'
  },
  // 开启热更新
  devServer: {
    // 设置端口的根目录
    contentBase: path.join(__dirname, "dep"),
    // 是否开启压缩代码
    compress: true,
    // 监听的端口
    port: 4000
  }
}
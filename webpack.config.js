var webpack = require('webpack')
var path = require('path')


module.exports = {
  entry: {
    //mmRouter: './src/mmRouter',
    main: './dev/index',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  }, //页面引用的文件
  module: {
    loaders: [
      //http://react-china.org/t/webpack-extracttextplugin-autoprefixer/1922/4
      // https://github.com/b82/webpack-basic-starter/blob/master/webpack.config.js
      {test: /\.html$/, loader: 'raw!html-minify'},
      {test: /\.js|jsx$/, //是一个正则，代表js或者jsx后缀的文件要使用下面的loader
        loader: "babel",
        query: {presets: ['es2015']}
      }
    ]
  },
  resolve: {
    extensions: ['.js', '']
  }
}


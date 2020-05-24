//路径相关处理方法
var path = require('path')
//引入配置
var config = require('../config')
//js分离css插件
var ExtractTextPlugin = require('extract-text-webpack-plugin')
//通过require.方法应用
exports.assetsPath = function (_path) {
  //目前两个值一样,static
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory
  //path.posix:在posix上的path,将assetsSubDirectory和_path连接
  return path.posix.join(assetsSubDirectory, _path)
}


exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    //map作用相当于循环处理loaders中的元素，并将处理结果返回成一个新数组。类似于lamba表达式
    //loaders举例子，可以为['css', 'stylus']
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      //loader存在？ 。sass?indentedSyntax
      if (/\?/.test(loader)) {
        //loader = sass-loader?indextedSyntax
        loader = loader.replace(/\?/, '-loader?')
        //return loader <=> return 'sass-loader?indextedSyntax&sourceMap';
        extraParamChar = '&'

      } else {
        //loader = css-loader
        loader = loader + '-loader'
        //return loader <=> return 'css-loader?sourceMap'
        extraParamChar = '?'
      }

      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
      //sourceLoader = css-loader?sourceMap!sass-loader?indextedSyntax&sourceMap
    }).join('!')

    // Extract CSS when that option is specified(指定)
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

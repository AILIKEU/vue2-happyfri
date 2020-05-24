//引入路径方法
var path = require('path')
//引入配置
var config = require('../config')
//引入工具方法
var utils = require('./utils')
//引入webpack
var webpack = require('webpack')
//将webpack配置文件合并
var merge = require('webpack-merge')
//引入base配置
var baseWebpackConfig = require('./webpack.base.conf')
//从js中分离css
var ExtractTextPlugin = require('extract-text-webpack-plugin')
//生成html文件
var HtmlWebpackPlugin = require('html-webpack-plugin')
//读取env变量
var env = config.build.env
//合并一个配置
/**
 * merge最基本的用户：
 * merge(object1, object2, object3, ...)
 */
var webpackConfig = merge(baseWebpackConfig, {
  /**
   * module是一个字典
   *
   */
  module: {
    loaders: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  //devtool: config.build.productionSourceMap ? '#source-map' : false,
  /**
   * output是一个字典
   */
  output: {
    //path.resolve(__dirname, '../happyfri'),打包后文件目录
    path: config.build.assetsRoot,
    //对应entry中的js文件，存放目录为${path}/js
    filename: utils.assetsPath('js/[name].js'),
    //分块文件名
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].min.js')
  },
  /**
   * vue是一个字典
   */
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  /**
   * plugins是一个数组！！！
   */
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    /**
     * filename：生成文件的文件名，可以包含 [name], [id], [contenthash]
     * allChunks：当为false的时候，只会提取初始化的时候引入的css,当allChunks属性为true时，会把异步引入的css也提取出来。
     */
    new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      // minify: {
      //     removeComments: true,
      //     collapseWhitespace: true,
      //     removeAttributeQuotes: true
      //         // more options:
      //         // https://github.com/kangax/html-minifier#options-quick-reference
      // },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})
//如果开启Gzip压缩
if (config.build.productionGzip) {
  //引入压缩插件
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
  //在config配置的插件里加入一个元素
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

//将配置对外映射，外部通过require获取
module.exports = webpackConfig

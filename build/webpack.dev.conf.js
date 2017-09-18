var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var glob = require('glob');
var fs = require('fs')

var defaultOpt = {  
  template: './src/templates/index.html'
}

function getEntry(globPath) {

    var entryMap = {}
    var htmlArray = []

    glob.sync(globPath).forEach(function (entry) {

        var [rootPath, distPath] = entry.replace(/.js$/, '').split('/entries/')
        var srcHtmlPath = `${rootPath}/templates/${distPath}.html`

        if(!fs.existsSync(srcHtmlPath)){  
          var foldName = distPath.split('/')[0]
          if(foldName !== distPath){
            srcHtmlPath = `${rootPath}/templates/${foldName}.html`
          }
          if(!fs.existsSync(srcHtmlPath)){  
            srcHtmlPath = defaultOpt.template
          }
        }

        var htmlPlugin = new HtmlWebpackPlugin({
            filename: distPath + '.html',
            template: srcHtmlPath,
            inject: true,
            chunks: [distPath] 
        })

        entryMap[distPath] = entry
        htmlArray.push(htmlPlugin)

    });

    return {
        js: entryMap,
        mutiHtmlPlugin: htmlArray
    };
}

var entris = getEntry('./src/entries/**/*.js')
baseWebpackConfig.entry = entris.js

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    new FriendlyErrorsPlugin()
  ].concat(entris.mutiHtmlPlugin)
})

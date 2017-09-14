const glob = require('glob');
const fs = require('fs')
const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')

const publicPath = ''
const defaultOpt = {  
    template: './src/templates/index.html'
}

function getEntry(globPath) {

    const entryMap = {}
    const htmlArray = []

    glob.sync(globPath).forEach(function (entry) {

        let [rootPath, distPath] = entry.replace(/.js$/, '').split('/entries/')
        let srcHtmlPath = `${rootPath}/templates/${distPath}.html`

        if(!fs.existsSync(srcHtmlPath)){  
          let foldName = distPath.split('/')[0]
          if(foldName !== distPath){
            srcHtmlPath = `${rootPath}/templates/${foldName}.html`
            if(!fs.existsSync(srcHtmlPath)){  
              srcHtmlPath = defaultOpt.template
            }
          }
        }

        const htmlPlugin = new HtmlWebpackPlugin({
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


const entris = getEntry('./src/entries/**/*.js')

module.exports = (options = {}) => ({
  entry: entris.js,
  output: {
    path: __dirname + '/dist',
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.tpl$/,
        use: ['html-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/static/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map',
  plugins: [
  ].concat(entris.mutiHtmlPlugin)
})
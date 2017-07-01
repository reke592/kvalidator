const webpack = require('webpack')
const path = require('path')

const BUILD_PATH = path.resolve(__dirname, 'dist')

var config = {
  entry: './index.js',
  output: {
    path: BUILD_PATH,
    filename: '/kvalidator.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}

module.exports = config
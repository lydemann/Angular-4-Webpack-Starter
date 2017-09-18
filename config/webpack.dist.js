var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    output: {
        path: helpers.root('dist', 'no'),
        publicPath: '/dsp/os/dist/no/',
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: '[id].[chunkhash:8].chunk.js'
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
          mangle: {
              keep_fnames: true
          }
      }),
      new ExtractTextPlugin('css/[name].[contenthash:8].css'),
      new webpack.DefinePlugin({
          'process.env': {
              'ENV': JSON.stringify(ENV),
              'NODE_ENV': JSON.stringify(ENV)
          }
      }),
      new webpack.optimize.AggressiveMergingPlugin()//Merge chunks
    ]
});

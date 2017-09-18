var helpers = require('./helpers');

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
      extensions: ['*', '.js', '.ts']
  },

  module: {
    loaders: [
        { test: /\.ts$/, loader: 'ts-loader?silent=true' },
        { test: /\.html$/, loader: 'raw-loader' },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null-loader'
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      }
    ]
  }
}

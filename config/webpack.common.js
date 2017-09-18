var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var webpackMerge = require('webpack-merge');
const { AotPlugin } = require('@ngtools/webpack');
const autoprefixer = require('autoprefixer');

const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');

var isProd = process.env.NODE_ENV === 'production';

const postcssPlugins = function () {
    // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
    const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
    const minimizeOptions = {
        autoprefixer: false,
        safe: true,
        mergeLonghand: false,
        discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
    };
    return [
        postcssUrl({
            url: (URL) => {
                // Only convert root relative URLs, which CSS-Loader won't process into require().
                if (!URL.startsWith('/') || URL.startsWith('//')) {
                    return URL;
                }
                if (deployUrl.match(/:\/\//)) {
                    // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                    return `${deployUrl.replace(/\/$/, '')}${URL}`;
                }
                else if (baseHref.match(/:\/\//)) {
                    // If baseHref contains a scheme, include it as is.
                    return baseHref.replace(/\/$/, '') +
                        `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                }
                else {
                    // Join together base-href, deploy-url and the original URL.
                    // Also dedupe multiple slashes into single ones.
                    return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                }
            }
        }),
        autoprefixer(),
    ].concat(isProd ? [cssnano(minimizeOptions)] : []);
};

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        vendor: [
            'bootstrap/dist/css/bootstrap.css',
            'es6-shim',
            'jquery',
            'bootstrap',
            'ngx-localforage',
            '@angular/common',
            '@angular/compiler',
            '@angular/core',
            '@angular/http',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/router'
        ],
        'app': './src/main.ts'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        loaders: [
            {
                "test": /\.ts$/,
                "loader": "@ngtools/webpack"
            },
            { test: /\.html$/, loader: 'raw-loader' },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({ 
                    filename: 'css/[name].css',
                    use: [
                    { loader: 'css-loader', options: { minimize: isProd }},
                    {
                        "loader": "postcss-loader",
                        "options": {
                          "ident": "postcss",
                          "plugins": postcssPlugins
                        }
                      }
                ] })
            },
            {
              test: /\.css$/,
              include: helpers.root('src', 'app'),
              use: [
                'to-string-loader',
                { loader: 'css-loader', options: { minimize: isProd }},
                {
                    "loader": "postcss-loader",
                    "options": {
                      "ident": "postcss",
                      "plugins": postcssPlugins
                    }
                  }
                ]
            },
            {
                "test": /\.(eot|svg|cur)$/,
                "loader": "file-loader?name=assets/[name].[hash:8].[ext]"
              },
              {
                "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                "loader": "url-loader?name=assets/[name].[hash:8].[ext]&limit=10000"
              },
        ]
    },

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
          name: ['app', 'vendor', 'polyfills']
      }),
      new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
      new HtmlWebpackPlugin({
          template: 'src/index.html'
      }),
      new AotPlugin({
        "mainPath": "main.ts",
        "hostReplacementPaths": {
          "environments\\environment.ts": !isProd ? "environments\\environment.ts" : "environments\\environment.prod.ts"
        },
        "exclude": [],
        "tsConfigPath": "src\\tsconfig.app.json",
        "skipCodeGeneration": !isProd
      })
    ]
};
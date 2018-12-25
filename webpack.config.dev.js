const path = require('path')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const PreloadPlugin = require('@vue/preload-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  stats: false,
  entry: {
    app: [ './src/main.js' ],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
      vue$: 'vue/dist/vue.runtime.esm.js', // runtime only, doesn't support string template, must use render function
    },
    extensions: [ '.js', '.jsx', '.vue', '.json' ],
    modules: [
      'node_modules',
      path.resolve('node_modules'),
    ],
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [ {
      test: /\.vue$/,
      use: [ {
        loader: 'cache-loader',
        options: {
          cacheDirectory: path.resolve('node_modules/.cache/vue-loader'),
          cacheIdentifier: 'vue-loader',
        },
      }, {
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false,
          },
          cacheDirectory: path.resolve('node_modules/.cache/vue-loader'),
          cacheIdentifier: 'vue-loader',
        },
      } ],
    }, {
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      use: [ {
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]',
            },
          },
        },
      } ],
    }, {
      test: /\.(svg)(\?.*)?$/,
      use: [ {
        loader: 'file-loader',
        options: {
          name: 'img/[name].[hash:8].[ext]',
        },
      } ],
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      use: [ {
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]',
            },
          },
        },
      } ],
    }, {
      test: /\.pug$/,
      use: [ {
        loader: 'pug-plain-loader',
      } ],
    }, {
      test: /\.(p(ost)?)?css$/,
      oneOf: [ {
        resourceQuery: '/module/',
        use: [ {
          loader: 'vue-style-loader',
          options: {
            sourceMap: false,
            shadowMode: false,
          },
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: false,
            importLoaders: 2,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: false,
          },
        } ],
      }, {
        'resourceQuery': /\?vue/,
        'use': [ {
          'loader': 'vue-style-loader',
          'options': {
            'sourceMap': false,
            'shadowMode': false,
          },
        }, {
          'loader': 'css-loader',
          'options': {
            'sourceMap': false,
            'importLoaders': 2,
          },
        }, {
          'loader': 'postcss-loader',
          'options': {
            'sourceMap': false,
          },
        } ],
      }, {
        use: [ {
          loader: 'vue-style-loader',
          options: {
            sourceMap: false,
            shadowMode: false,
          },
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: false,
            importLoaders: 2,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: false,
          },
        } ],
      } ],
    }, {
      test: /\.jsx?$/,
      exclude: [ /node_modules/ ],
      use: [ {
        loader: 'cache-loader',
        options: {
          cacheDirectory: path.resolve('node_modules/.cache/babel-loader'),
          cacheIdentifier: 'babel-loader',
        },
      }, {
        loader: 'babel-loader',
      } ],
    }, {
      enforce: 'pre',
      test: /\.(vue|(j|t)sx?)$/,
      exclude: [ '/node_modules/' ],
      use: [ {
        loader: 'eslint-loader',
        options: {
          extensions: [ '.js', '.jsx', '.vue' ],
          cache: true,
          emitWarning: true,
          emitError: false,
          // eslintPath: '/Users/deleav/job/project-D/vue-dashboard-boilerplate/node_modules/eslint/lib/api.js',
        },
      } ],
    } ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' },
      BASE_URL: '"/"',
    }),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve('public/index.html'),
      filename: 'index.html',
      chunks: 'all',
    }),
    new PreloadPlugin([ {
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [ /\.map$/, /hot-update\.js$/ ],
    } ]),
    new PreloadPlugin([ {
      rel: 'prefetch',
      include: 'asyncChunks',
    } ]),
  ],
}

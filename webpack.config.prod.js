const path = require('path')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const PreloadPlugin = require('@vue/preload-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')

const nameResolver = chunk => {
  if (chunk.name) {
    return chunk.name
  }

  const hash = require('hash-sum')
  const joinedHash = hash(
    Array.from(chunk.modulesIterable, m => m.id).join('_')
  )
  return 'chunk-' + joinedHash
}

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  stats: 'none',
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
          loader: MiniCssExtractPlugin.loader,
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
          'loader': MiniCssExtractPlugin.loader,
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
          loader: MiniCssExtractPlugin.loader,
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
      'process.env': { NODE_ENV: '"production"' },
      BASE_URL: '"/"',
    }),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
    new OptimizeCssnanoPlugin({
      sourceMap: false,
      cssnanoOptions: {
        preset: [ 'default', {
          mergeLonghand: false,
          cssDeclarationSorter: false,
          discardComments: {
            removeAll: true,
          },
        } ],
      },
    }),
    new webpack.HashedModuleIdsPlugin({ hashDigest: 'hex' }),
    new webpack.NamedChunksPlugin(nameResolver),
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

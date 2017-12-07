let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let PurifyCSSPlugin = require('purifycss-webpack');
let glob = require('glob');
let webpack = require('webpack');
let path = require('path');

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'build');
const HTML_TEMPLATE_PATH = path.resolve(SRC_PATH, 'index.html');
const CSS_PURIFY_PATH = path.resolve(SRC_PATH, '*.html');

module.exports = {
  entry: [
    'babel-polyfill',
    SRC_PATH,
  ],
  output: {
    publicPath: '/',
    path: BUILD_PATH,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
          publicPath: BUILD_PATH,
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=/images/[name].[ext]', 
          'image-webpack-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Token Statistics',
      inject: 'body',
      hash: true,
      template: HTML_TEMPLATE_PATH,
      minify: {
        collapseWhitespace: true,
      },
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true,
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(CSS_PURIFY_PATH),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
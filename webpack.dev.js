let HtmlWebpackPlugin = require('html-webpack-plugin');
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
    'react-hot-loader/patch',
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
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=/images/[name].[ext]', 
          'image-webpack-loader'
        ],
      },
    ],
  },
  devServer: {
    contentBase: BUILD_PATH,
    compress: true,
    port: 9000,
    stats: 'errors-only',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Token Statistics',
      inject: 'body',
      hash: true,
      template: HTML_TEMPLATE_PATH,
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(CSS_PURIFY_PATH),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'eval-source-map',
};
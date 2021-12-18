const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');

const SRC_PATH = path.resolve(__dirname, './src');
const PUBLIC_PATH = path.resolve(__dirname, '../public');
const UPLOAD_PATH = path.resolve(__dirname, '../upload');
const DIST_PATH = path.resolve(__dirname, '../dist');

/**
 * @type {"production" | "development"}
 */
const environment = process.env.NODE_ENV || 'development';

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
    static: [PUBLIC_PATH, UPLOAD_PATH],
  },
  devtool: environment === 'production' ? 'source-map' : 'inline-source-map',
  entry: {
    main: [
      'regenerator-runtime/runtime',
      path.resolve(SRC_PATH, './index.css'),
      path.resolve(SRC_PATH, './buildinfo.js'),
      path.resolve(SRC_PATH, './index.jsx'),
    ],
  },
  mode: environment,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  output: {
    filename: 'scripts/[name].js',
    path: DIST_PATH,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || '',
      NODE_ENV: environment,
    }),
    new MomentLocalesPlugin({ localesToKeep: ['ja'] }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_PATH, './index.html'),
      scriptLoading: 'defer',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
  },
};

module.exports = config;

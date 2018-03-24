const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const webpack = require('webpack');
const express = require('express')

const BACKEND_LOCATION = process.env.BACKEND_LOCATION || "";
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || "";
const MAPBOX_STYLE = process.env.MAPBOX_STYLE || "mapbox://styles/grounded042/cjehkrz116lxq2qqq1k1hlpre";

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.jsx'
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    setup (app) {
      app.use('/trips',
        express.static(path.join(__dirname, 'trips')));
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        exclude: /(node_modules\/)/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  plugins: [
    new DashboardPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/template.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      CONFIG_BACKEND_LOCATION: JSON.stringify(BACKEND_LOCATION),
      CONFIG_MAPBOX_TOKEN: JSON.stringify(MAPBOX_TOKEN),
      CONFIG_MAPBOX_STYLE: JSON.stringify(MAPBOX_STYLE)
    })
  ]
};

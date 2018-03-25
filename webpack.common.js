const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const BACKEND_LOCATION = process.env.BACKEND_LOCATION || "trips/";
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || "";
const MAPBOX_STYLE = process.env.MAPBOX_STYLE || "mapbox://styles/grounded042/cjehkrz116lxq2qqq1k1hlpre";

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        exclude: /(node_modules\/)/,
        loader: "babel-loader"
      },
      {
        test: /\.json$/,
        exclude: /(node_modules\/)/,
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
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/template.html'
    }),
    new webpack.DefinePlugin({
      CONFIG_BACKEND_LOCATION: JSON.stringify(BACKEND_LOCATION),
      CONFIG_MAPBOX_TOKEN: JSON.stringify(MAPBOX_TOKEN),
      CONFIG_MAPBOX_STYLE: JSON.stringify(MAPBOX_STYLE)
    })
  ]
};

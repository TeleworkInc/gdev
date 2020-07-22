/**
 * Have to use CommonJS for Webpack config.
 */

const { BannerPlugin } = require('webpack');
const path = require('path');

const bannerPlugin = new BannerPlugin({
  banner: '#!/usr/bin/env node',
  raw: true,
});

const cliConfig = {
  entry: {
    cli: './exports/cli.js',
  },
  target: 'async-node',
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    bannerPlugin,
  ],
};

const universalConfig = {
  entry: {
    universal: './exports/universal.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // bannerPlugin,

  ],
};

module.exports = [
  cliConfig,
  universalConfig,
];

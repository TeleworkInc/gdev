/**
 * Have to use CommonJS for Webpack config.
 */

const { BannerPlugin } = require('webpack');
const path = require('path');

const bannerPlugin = new BannerPlugin({
  banner: '#!/usr/bin/env node',
  raw: true,
});

const CONFIG_DEFAULTS = {
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
};

const cliConfig = {
  ...CONFIG_DEFAULTS,
  entry: {
    cli: './exports/cli.js',
  },
  target: 'async-node',
  plugins: [
    bannerPlugin,
  ],
};

const universalConfig = {
  ...CONFIG_DEFAULTS,
  entry: {
    universal: './exports/universal.js',
  },
  target: 'web',
};

const nodeConfig = {
  ...CONFIG_DEFAULTS,
  entry: {
    node: './exports/node.js',
  },
  target: 'node',
  /**
   * Following lines enable module.export.
   */
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
    library: '',
    libraryTarget: 'commonjs',
  },
};

module.exports = [
  cliConfig,
  universalConfig,
  nodeConfig,
];

const ClosurePlugin = require('closure-webpack-plugin');
const { BannerPlugin } = require('webpack');
const path = require('path');

const compilerPlugin = new ClosurePlugin({ mode: 'STANDARD' }, {
  // compiler flags here
  //
  // for debugging help, try these:
  //
  // formatting: 'PRETTY_PRINT'
  // debug: true,
  // renaming: false
});

const bannerPlugin = new BannerPlugin({
  banner: '#!/usr/bin/env node',
  raw: true,
});

const serverConfig = {
  entry: {
    cli: './exports/cli.js',
  },
  target: 'node',
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

module.exports = [
  serverConfig,
];

// export const clientConfig = {
//   target: 'web',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'lib.js',
//   },
// };

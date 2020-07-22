const ClosurePlugin = require('closure-webpack-plugin');
const { BannerPlugin } = require('webpack');
const path = require('path');

const closureCompilerSettings = {
  optimization: {
    minimizer: [
      new ClosurePlugin({ mode: 'STANDARD' }, {
        // compiler flags here
        //
        // for debugging help, try these:
        //
        // formatting: 'PRETTY_PRINT'
        // debug: true,
        // renaming: false
      }),
    ],
  },
};

const serverConfig = {
  entry: {
    es: './exports/cli.js',
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread'],
          },
        },
      },
    ],
  },
  plugins: [
    new BannerPlugin('#!/usr/bin/env node'),
  ],
  // ...closureCompilerSettings,
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

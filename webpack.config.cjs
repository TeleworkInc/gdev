/**
 * Use Webpack to build CJS modules from ES2015 modules.
 *
 * Have to use CJS for Webpack config.
 */

const path = require('path');

const CONFIG_DEFAULTS = {
  mode: 'production',
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
    cli: './dist/cli.mjs',
  },
  target: 'async-node',
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
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
  nodeConfig,
];

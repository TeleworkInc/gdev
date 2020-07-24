/**
 * @license MIT
 * @file
 * Use Webpack to build CJS modules from ES2015 modules in the dev/ directory.
 * CommonJS is mandatory for this config file.
 */

const path = require('path');

/**
 * Defaults to enable module.export on an uncompiled CJS bundle.
 */
const EXPORT_CONFIG = {
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].cjs',
    library: '',
    libraryTarget: 'commonjs',
  },
};

/**
 * Webpack defaults, to be overridden if needed.
 */
const CONFIG_DEFAULTS = {
  ...EXPORT_CONFIG,
  mode: 'production',
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\..?js$/,
        exclude: /node_modules/,
      },
    ],
  },
};

/**
 * Transpile the CLI module to CJS with async-node target.
 */
const cliConfig = {
  ...CONFIG_DEFAULTS,
  entry: {
    cli: './dev/cli.mjs',
  },
  target: 'async-node',
  module: {
    /**
     * Following lines enable module.export.
     */
    rules: [
      {
        type: 'javascript/auto',
        test: /\..?js$/,
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
  target: 'async-node',
};

const esmModulesConfig = {
  ...CONFIG_DEFAULTS,
  entry: {
    node: './exports/node.js',
  },
  target: 'async-node',
};

module.exports = [
  cliConfig,
  nodeConfig,
  esmModulesConfig,
];

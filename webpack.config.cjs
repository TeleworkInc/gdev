/**
 * @license MIT
 */
/**
 * @file
 * Use Webpack to build CJS modules from ES2015 modules in the dev/ directory.
 * CommonJS is mandatory for this config file.
 *
 * Files will be built from dev/* to dev/*.cjs.
 */
const glob = require('glob');
const path = require('path');
// const webpack = require('webpack');

/**
 * Default config for Webpack exports.
 */
const CONFIG_DEFAULTS = {
  mode: 'production',
  resolve: {
    extensions: ['.js', '.cjs', '.mjs'],
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

const CJS_DEFAULTS = {
  ...CONFIG_DEFAULTS,
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].cjs',
    library: '',
    libraryTarget: 'commonjs',
  },
};

const ESM_DEFAULTS = {
  ...CONFIG_DEFAULTS,
  module: {
    /**
     * Following lines enable module.export.
     */
    rules: [
      {
        type: 'javascript/auto',
        test: /\..?js$/,
        use: [
          {
            loader: 'shebang-loader',
          },
        ],
      },
    ],
  },
  /**
   * -> dev/[name].cjs
   */
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].cjs',
    library: '',
    libraryTarget: 'commonjs',
  },
};

/**
 * Transpile the CLI module to CJS with async-node target.
 * dev/cli.mjs -> dev/cli.cjs
 */
const cliConfig = {
  entry: {
    cli: './dev/cli.mjs',
  },
  target: 'async-node',
  ...ESM_DEFAULTS,
};

/**
 * Build a Node distribution.
 * dev/node.mjs -> dev/node.cjs
 */
const nodeConfig = {
  entry: {
    node: './dev/node.mjs',
  },
  target: 'async-node',
  ...ESM_DEFAULTS,
};

const exportCJS = (file) => {
  const name = path.parse(file).name;
  return {
    entry: {
      [name]: file,
    },
    target: 'async-node',
    ...ESM_DEFAULTS,
  };
};

/**
 * Build non-standard exports.
 * exports/* -> dev/*
 */
const buildEsModules = glob.sync('./dev/*.mjs', {
  ignore: ['./dev/universal.*'],
}).map(exportCJS);

module.exports = [
  ...buildEsModules,
  // ...remainingEsmModules,
];

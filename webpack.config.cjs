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
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].cjs',
    library: '',
    libraryTarget: 'commonjs',
  },
  // plugins: [
  //   new webpack.IgnorePlugin(/fsevents/),
  // ],
};

/**
 * Transpile the CLI module to CJS with async-node target.
 * Entry: dev/cli.mjs
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
        use: [
          {
            loader: 'shebang-loader',
          },
        ],
      },
    ],
  },
};

/**
 * Build a Node distribution.
 * Entry: dev/node.mjs
 */
const nodeConfig = {
  ...CONFIG_DEFAULTS,
  entry: {
    node: './exports/node.js',
  },
  target: 'async-node',
};

/**
 * Build an ESM module.
 */
const remainingEsmModules = glob.sync('./exports/*.js', {
  ignore: ['exports/node.js', 'exports/cli.js', 'exports/universal.js'],
}).map((file) => {
  return {
    ...CONFIG_DEFAULTS,
    entry: {
      [path.parse(file).name]: file,
    },
    target: 'async-node',
  };
});

module.exports = [
  cliConfig,
  nodeConfig,
  ...remainingEsmModules,
];

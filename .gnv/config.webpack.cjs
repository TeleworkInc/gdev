/**
 * @license MIT
 *
 * @fileoverview
 * Use Webpack to build CJS modules from ES2015 modules in the dev/ directory.
 * CommonJS is mandatory for this config file.
 *
 * Files will be built from dev/*.mjs to dev/*.cjs.
 */

const glob = require('glob');
const path = require('path');
const disablePackages = require('webpack-disable-packages');

/**
 * Default config for Webpack exports.
 */
const EXPORT_DEFAULTS = {
  context: path.resolve(__dirname, '..'),
  mode: 'production',
  resolve: {
    extensions: ['.js', '.cjs', '.mjs'],
  },
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\..?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'shebang-loader',
          },
        ],
      },
    ],
  },
};

const exportCJS = (file) => {
  const name = path.parse(file).name;
  return {
    entry: {
      [name]: file,
    },
    target: 'async-node',
    ...EXPORT_DEFAULTS,
    /**
     * -> dev/[name].cjs
     */
    output: {
      path: path.resolve(__dirname, '../dev'),
      filename: '[name].cjs',
      libraryTarget: 'commonjs',
    },
    plugins: [
      disablePackages('fsevents'),
    ],
  };
};

/**
 * Compile all ES modules in dev/ except the universal bundle, which was rolled
 * with Rollup due to lack of NodeJS dependencies.
 */
const buildDevCjsModules = glob.sync('./dev/*.mjs', {
  ignore: ['./dev/universal.*'],
}).map(exportCJS);

module.exports = [
  ...buildDevCjsModules,
];

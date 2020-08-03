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
const TerserPlugin = require('terser-webpack-plugin');

// const webpack = require('webpack');

const EXPERIMENTS = {
  experiments: {
    mjs: true,
    outputModule: true,
    syncWebAssembly: true,
    topLevelAwait: true,
    asset: true,
    asyncWebAssembly: true,
    importAsync: true,
    importAwait: true,
  },
};

/**
 * Default config for Webpack exports.
 */
const EXPORT_DEFAULTS = {
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
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin({
      terserOptions: {
        parse: {
          bare_returns: true,
        },
      },
    })],
  },
  ...EXPERIMENTS,
};

const EXPORT_CJS = {
  ...EXPORT_DEFAULTS,
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].cjs',
    libraryTarget: 'commonjs',
  },
};

const EXPORT_ESM = {
  ...EXPORT_DEFAULTS,
  output: {
    iife: false,
    module: true,
    scriptType: 'module',
    libraryTarget: 'module',
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].min.mjs',
  },
};

const exportCJS = (file) => {
  const name = path.parse(file).name;
  return {
    entry: {
      [name]: file,
    },
    target: 'async-node',
    ...EXPORT_CJS,
  };
};

const exportESM = (file) => {
  const name = path.parse(file).name;
  return {
    entry: {
      [name]: file,
    },
    target: 'async-node',
    ...EXPORT_ESM,
  };
};

/**
 * Compile all ES modules in dev/ except the universal bundle, which was rolled
 * with Rollup due to lack of NodeJS dependencies.
 */
const esmExports = glob.sync('./dev/*.mjs', {
  ignore: [
    './dev/*.min.mjs',
    // './dev/universal.*',
  ],
}).map(exportESM);

module.exports = [
  ...esmExports,
  // ...remainingEsmModules,
];

/**
 * @license MIT
 */
/**
 * @file
 * Specify the exports for this project's CLI.
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

import shell from 'await-shell';
import chalk from 'chalk';
import chokidar from 'chokidar';
import filetouch from 'filetouch';
import fs from 'fs';
import ora from 'ora';
import path from 'path';

// import loadConfigFile from 'rollup/dist/loadConfigFile';
// import rollup from 'rollup';

import * as templates from './templates.js';

/**
 * Log messages in blue.
 *
 * @param {...string} msgs
 * The messages to log
 *
 * @return {void}
 */
const blue = (...msgs) => chalk.blueBright(...msgs);

const success = (...msgs) => console.log(
    chalk.bgCyan(
        chalk.whiteBright(' SUCCESS '),
    ),
    ...msgs,
    '\n',
);

const error = (...msgs) => console.log(
    chalk.bgRed(' ERROR '),
    ...msgs,
    '\n',
);


/**
 * Call the compiler
 *
 * @param {string} mode
 * The mode to use for this build.
 *
 * @param {...string} customFlags
 * Additional flags to pass the compiler.
 *
 * @return {void}
 */
export const callCompiler = async (mode = 'dev', ...customFlags) => {
  const FLAGS = [
    ...customFlags,
    ...templates.DEFAULT_FLAGS,
    `--js_output_file="dist/${mode}.js"`,
  ];

  const commandArg = `google-closure-compiler ${FLAGS.join(' ')}`;
  const spinner = ora('Compiling...');
  console.log('\n' + chalk.grey(commandArg));

  /** Suppress await-shell stdout. */
  global.SPAWN_OPTIONS = { stdio: ['ignore', 'ignore', 'inherit'] };

  try {
    spinner.start();
    await shell(commandArg);
  } catch (e) {
    console.log(e);
    spinner.fail('Oops! Something went wrong.');
  }

  spinner.succeed('Compiled ' + blue(`${mode}.js`));
};


export const create = async (name) => {
  if (existsSync(name)) {
    error('File or directory already exists.');
  } else {
    await initialize(name);
    success(
        'Created project at:',
        blue(name),
    );
  }
};


/**
 * Build the dev bundle for a project.
 */
export const devCompile = async () => {
  // Rollup bundles only
  await shell('yarn run:rollup');
};


/**
 * Compile a gnv project.
 *
 * @param {boolean} devOnly
 * Set to `true` to only build the dev bundles.
 *
 * @return {void}
 */
export const compile = async (devOnly = false) => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }

  await shell(
      'yarn eslint {lib,exports}/**/*.js',
      'yarn compile',
  );

  console.log();
};


export const develop = async (program) => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }

  chokidar.watch(
      `{lib,exports}/**/*.js`,
      {
        ignoreInitial: true,
      },
  ).on('all',
      (event, path) => compile(program),
  );

  await compile();
  console.log('\nListening for file changes in', blue('lib/'));
};


export const displayProjectInfo = () => {
  if (checkInsideProject()) {
    console.log(
        chalk.bgBlue(chalk.whiteBright(' DEV  ')),
        resolve('dist', 'dev.js'),
    );

    console.log(
        chalk.bgCyan(chalk.whiteBright(' PROD ')),
        resolve('dist', 'release.js'),
    );

    console.log();
  }
};


export const initialize = async (dir = '.') => {
  const libDir = resolve(dir, 'lib');
  const compileDir = resolve(dir, 'dist');

  /**
   * Ensure all necessary dirs exist using `filetouch`.
   */
  filetouch.dir(dir);
  filetouch.dir(libDir);
  filetouch.dir(compileDir);

  /**
   * Add `lib/index.js` if it doesn't exist.
   */
  filetouch.file(
      resolve(libDir, 'index.js'),
      templates.INTRO_TEMPLATE,
  );

  /**
   * Add `node_modules` and `dist` to project `.gitignore`.
   */
  filetouch.file(
      resolve(dir, '.gitignore'),
      'node_modules\/\ndist\/',
      'utf-8',
  );

  filetouch.file(resolve(dir, '.gnv'));
  filetouch.file(resolve(dir, '.eslintrc.yaml'), templates.ESLINT_TEMPLATE);

  const cmds = [
    'yarn create esm -y',
    'mv main.js index.mjs',
    'mv index.js index.cjs',
    'yarn add -D eslint eslint-config-google eslint-plugin-jsdoc',
    'yarn add -D rollup rollup-plugin-executable',
  ];

  global.SPAWN_OPTIONS = { cwd: dir, stdio: 'inherit' };
  await shell(...cmds);
};


export const checkInsideProject = () => fs.existsSync(
    path.resolve(process.cwd(), '.gnv'),
);

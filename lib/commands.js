import { existsSync } from 'fs';
import { resolve } from 'path';

import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import callBash from 'call-bash';
import filetouch from 'filetouch';

import * as templates from './templates.js';

/**
 * Logging utils.
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
 * Public functions.
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

  try {
    spinner.start();
    await callBash.call(
        commandArg,
        { stdio: ['ignore', 'ignore', 'inherit'] },
    );
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


export const compile = async () => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gdev workspace.');
  }

  await callBash.call('yarn run eslint lib/**/*.js');

  await callCompiler(
      'dev',
      ...templates.DEV_FLAGS,
      ...templates.COMPILER_INCLUDES,
  );

  await callCompiler(
      'release',
      ...templates.RELEASE_FLAGS,
      ...templates.COMPILER_INCLUDES,
  );

  console.log();
};


export const watch = async (program) => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gdev workspace.');
  }

  chokidar.watch(
      `lib/**/*.js`,
      {
        ignoreInitial: true,
      },
  ).on('all',
      (event, path) => compile(program),
  );

  await compile();
  console.log('\nListening for file changes in', blue('lib/'));
};


export const displayBuildInfo = () => {
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

  filetouch.file(resolve(dir, '.gdev'));
  filetouch.file(resolve(dir, '.eslintrc.yaml'), templates.ESLINT_TEMPLATE);

  const cmds = [
    'yarn create esm -y',
    'mv main.js index.mjs',
    'mv index.js index.cjs',
    'yarn add -D eslint eslint-config-google eslint-plugin-jsdoc rollup',
  ];

  await callBash.sequential(cmds, { cwd: dir, stdio: 'inherit' });
};


export const checkInsideProject = () => fs.existsSync(
    path.resolve(process.cwd(), '.gdev'),
);

import chokidar from 'chokidar';
import { existsSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import callBash from 'call-bash';
import filetouch from 'filetouch';

const CWD = cwd();
const __dirname = path.dirname(new URL(import.meta.url).pathname);


/**
 * Templates and constants.
 */

const INTRO_TEMPLATE = `
/**
 * The Production flag will be overwritten to \`true\` when the project is
 * compiled in release mode.
 *
 * @define {boolean}
 */
const PRODUCTION = goog.define('gdev.FLAGS.PRODUCTION', false);

console.log('Welcome to gdev!');
console.log('Production mode:', PRODUCTION);
`;

const ESLINT_TEMPLATE = fs.readFileSync(
    path.resolve(__dirname, '../.eslintrc.yaml'),
    'utf-8',
);

const DEFAULT_FLAGS = [
  '-W="VERBOSE"',
  '--process_common_js_modules',
  '--module_resolution="NODE"',
  '--language_in="ECMASCRIPT_NEXT"',
  '--jscomp_off="nonStandardJsDocs"',
  '--rewrite_polyfills',
  '--use_types_for_optimization',
];

const DEV_FLAGS = [
  '--define="gdev.FLAGS.PRODUCTION=false"',
  '-O="SIMPLE"',
];

const RELEASE_FLAGS = [
  '--define="gdev.FLAGS.PRODUCTION=true"',
  '-O="ADVANCED"',
  '--language_out="ECMASCRIPT5_STRICT"',
  '--isolation_mode="IIFE"',
  '--assume_function_wrapper',
];


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
  const FLAGS = [...customFlags, ...DEFAULT_FLAGS];
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
  if (!insideProject()) {
    return error('\nDirectory is not a gdev workspace.');
  }

  const COMPILER_INCLUDES = [
    // include defs
    `--js="defs/**.js"`,
    // include src files
    `--js="lib/**.js"`,
  ];

  await callBash.call('yarn run eslint lib/**/*.js');

  await callCompiler(
      'dev',
      ...DEV_FLAGS,
      // include defs and src
      ...COMPILER_INCLUDES,
      // output to dev.js
      `--js_output_file="dist/dev.js"`,
  );

  await callCompiler(
      'release',
      ...RELEASE_FLAGS,
      // include defs and src
      ...COMPILER_INCLUDES,
      // output to release.js
      `--js_output_file="dist/release.js"`,
  );

  console.log();
};


export const develop = async (program) => {
  if (!insideProject()) {
    return error('\nDirectory is not a gdev workspace.');
  }

  chokidar.watch(
      `${CWD}/lib/**/*.js`,
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
  if (insideProject()) {
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
      INTRO_TEMPLATE,
  );

  /**
   * Add `node_modules` and `dist` to project `.gitignore`.
   */
  filetouch.file(
      resolve(dir, '.gitignore'),
      'node_modules\/\ndist\/',
      'utf-8',
  );

  filetouch.file(resolve(dir, '.gproj'));
  filetouch.file(resolve(dir, '.eslintrc.yaml'), ESLINT_TEMPLATE);

  const cmds = [
    'yarn init esm -y',
    'yarn add -D eslint eslint-config-google',
    'yarn add -D eslint-plugin-jsdoc',
  ];

  await callBash.sequential(cmds, { cwd: dir, stdio: 'inherit' });
};


export const insideProject = () => fs.existsSync(
    path.resolve(process.cwd(), '.gproj'),
);

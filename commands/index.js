const chokidar = require('chokidar');
const fs = require('fs');
const process = require('process');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { callBash, callBashSequential } = require('call-bash');
const filetouch = require('filetouch');

const CWD = process.cwd();

const insideProject = () => fs.existsSync(
    path.resolve(process.cwd(), '.gproj'),
);

/**
 * Slightly stylized logging utils.
 */

const blue = (...msgs) => chalk.blueBright(...msgs);

const success = (...msgs) => console.log(
    chalk.bgCyan(chalk.whiteBright(' SUCCESS ')),
    ...msgs,
    '\n',
);

const error = (...msgs) => console.log(
    chalk.bgRed(' ERROR '),
    ...msgs,
    '\n',
);

/**
 *
 * Internal functions.
 */

const
  DEFAULT_FLAGS = [
    '-W="VERBOSE"',
    '--process_common_js_modules',
    '--module_resolution="NODE"',
    '--language_in="ECMASCRIPT_NEXT"',
    '--jscomp_off="nonStandardJsDocs"',
    '--rewrite_polyfills',
    '--use_types_for_optimization',
  ];

const DEV_FLAGS = [
  '-O="SIMPLE"',
];

const RELEASE_FLAGS = [
  '-O="ADVANCED"',
  '--language_out="ECMASCRIPT5_STRICT"',
  '--define="PRODUCTION=true"',
  '--isolation_mode="IIFE"',
  '--assume_function_wrapper',
];

const callCompiler = async (mode = 'dev', ...customFlags) => {
  const spinner = ora('Compiling...').start();
  const FLAGS = [...DEFAULT_FLAGS, ...customFlags];

  try {
    await callBash(
        `google-closure-compiler ${FLAGS.join(' ')}`,
        { stdio: ['ignore', 'ignore', 'inherit'] },
    );
  } catch (e) {
    spinner.fail('Oops! Something went wrong.');
  }

  spinner.succeed('Compiled ' + blue(`${mode}.js`));
};

const INTRO_TEMPLATE = `
/**
 * This variable is overridden by Closure Compiler during compilation.
 * @define {boolean}
 */
const PRODUCTION = false;

console.log('Welcome to GProject!');
console.log('Production mode:', PRODUCTION);
`;

const ESLINT_TEMPLATE = `
env:
  browser: true
  commonjs: true
  es2020: true
  node: true

extends:
  - google
  - plugin:jsdoc/recommended

parserOptions:
  ecmaVersion: 11

rules:
  require-jsdoc:
    - error
    - require:
        ClassDeclaration: true
        FunctionDeclaration: false
        MethodDefinition: false
        ArrowFunctionExpression: false
        FunctionExpression: false

  operator-linebreak:
    - error
    - before

  object-curly-spacing:
    - error
    - always

settings:
  jsdoc:
    mode: closure
`;

const createProject = async (name) => {
  await initialize(name);
  success(
      'Created project at:',
      blue(name),
  );
};


/**
 * Public functions.
 */

const create = (name) => {
  if (fs.existsSync(name)) {
    error('File or directory already exists.');
  } else createProject(name);
};


const compile = async () => {
  console.log();

  if (!insideProject()) {
    return error('\nDirectory is not a gproject workspace.');
  }

  await callBash('yarn run eslint lib/**/*.js');

  await callCompiler(
      'dev',
      ...DEV_FLAGS,
      `--js="${CWD}/lib/**.js"`,
      `--js_output_file="${CWD}/dist/dev.js"`,
  );

  await callCompiler(
      'release',
      ...RELEASE_FLAGS,
      `--js="${CWD}/lib/**.js"`,
      `--js_output_file="${CWD}/dist/release.js"`,
  );

  console.log();
};


const develop = async (program) => {
  if (!insideProject()) {
    return error('\nDirectory is not a gproject workspace.');
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

const initialize = async (dir = '.') => {
  const srcDir = path.resolve(dir, 'lib');
  const compileDir = path.resolve(dir, 'dist');

  filetouch.dir(dir);
  filetouch.dir(srcDir);
  filetouch.dir(compileDir);

  filetouch.file(
      path.resolve(srcDir, 'index.js'),
      INTRO_TEMPLATE,
  );

  filetouch.file(
      path.resolve(dir, '.gitignore'),
      'node_modules',
      'utf-8',
  );

  filetouch.file(path.resolve(dir, '.gproj'));
  filetouch.file(path.resolve(dir, '.eslintrc.yaml'), ESLINT_TEMPLATE);

  const cmds = [
    'yarn init -y',
    'yarn add -D eslint eslint-config-google',
    'yarn add -D eslint-plugin-jsdoc',
  ];

  await callBashSequential(cmds, { cwd: dir, stdio: 'inherit' });
};


const displayBuildInfo = () => {
  if (insideProject()) {
    console.log(
        chalk.bgBlue(chalk.whiteBright(' DEV  ')),
        path.resolve('dist', 'dev.js'),
    );

    console.log(
        chalk.bgCyan(chalk.whiteBright(' PROD ')),
        path.resolve('dist', 'release.js'),
    );

    console.log();
  }
};

module.exports = {
  insideProject,
  displayBuildInfo,
  create,
  compile,
  develop,
  initialize,
};

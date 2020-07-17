'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var program = _interopDefault(require('commander'));
var fs = require('fs');
var fs__default = _interopDefault(fs);
var path = require('path');
var path__default = _interopDefault(path);
var aft = _interopDefault(require('ascii-file-tree'));
var chalk = _interopDefault(require('chalk'));
var url = require('url');
var chokidar = _interopDefault(require('chokidar'));
var ora = _interopDefault(require('ora'));
var callBash = _interopDefault(require('call-bash'));
var filetouch = _interopDefault(require('filetouch'));

/**
 * Dirname of script.
 */
const __dirname$1 = path__default.dirname(new URL((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('bundle.cjs', document.baseURI).href))).pathname);


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
export const PRODUCTION = goog.define('gdev.FLAGS.PRODUCTION', false);

console.log('Welcome to gdev!');
console.log('Production mode:', PRODUCTION);
`;

const ESLINT_TEMPLATE = fs__default.readFileSync(
    path__default.resolve(__dirname$1, '../.eslintrc.yaml'),
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

const callCompiler = async (mode = 'dev', ...customFlags) => {
  const FLAGS = [
    ...customFlags,
    ...DEFAULT_FLAGS,
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


const create = async (name) => {
  if (fs.existsSync(name)) {
    error('File or directory already exists.');
  } else {
    await initialize(name);
    success(
        'Created project at:',
        blue(name),
    );
  }
};


const compile = async () => {
  if (!checkInsideProject()) {
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
      ...COMPILER_INCLUDES,
  );

  await callCompiler(
      'release',
      ...RELEASE_FLAGS,
      ...COMPILER_INCLUDES,
  );

  console.log();
};


const watch = async (program) => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gdev workspace.');
  }

  chokidar.watch(
      `lib/**/*.js`,
      {
        ignoreInitial: true,
      },
  ).on('all',
      (event, path) => compile(),
  );

  await compile();
  console.log('\nListening for file changes in', blue('lib/'));
};


const displayBuildInfo = () => {
  if (checkInsideProject()) {
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


const initialize = async (dir = '.') => {
  const libDir = path.resolve(dir, 'lib');
  const compileDir = path.resolve(dir, 'dist');

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
      path.resolve(libDir, 'index.js'),
      INTRO_TEMPLATE,
  );

  /**
   * Add `node_modules` and `dist` to project `.gitignore`.
   */
  filetouch.file(
      path.resolve(dir, '.gitignore'),
      'node_modules\/\ndist\/',
      'utf-8',
  );

  filetouch.file(path.resolve(dir, '.gdev'));
  filetouch.file(path.resolve(dir, '.eslintrc.yaml'), ESLINT_TEMPLATE);

  const cmds = [
    'yarn create esm -y',
    'mv main.js index.mjs',
    'mv index.js index.cjs',
    'yarn add -D eslint eslint-config-google eslint-plugin-jsdoc rollup',
  ];

  await callBash.sequential(cmds, { cwd: dir, stdio: 'inherit' });
};


const checkInsideProject = () => fs__default.existsSync(
    path__default.resolve(process.cwd(), '.gdev'),
);

const __dirname$2 = path.dirname(url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('bundle.cjs', document.baseURI).href))));


/**
 * Define commands and assign actions to them.
 */

program
    .command('create <project>')
    .description('Create a new gdev workspace.')
    .action(create);

program
    .command('watch')
    .description('Start developing and build when changes are made.')
    .action(watch);

program
    .command('compile')
    .description('Compile this workspace and output in [dist].')
    .action(compile);

program
    .command('init [directory]')
    .description('Initialize a workspace inside an existing directory.')
    .action(initialize);


/**
 * Get the version of this npm package.
 *
 * @return {string} versionString
 */
function getVersion() {
  return JSON.parse(
      fs__default.readFileSync(
          path.resolve(__dirname$2, '../package.json'),
          'utf-8',
      ),
  ).version;
}


const CWD = process.cwd();
const PROJECT_NAME = path.basename(CWD);
const VERSION_INFO = getVersion();


const TREE = (
  checkInsideProject()
  ? aft.generate({ globs: ['lib/**/*.js'] })
  : ''
);

const HEAD = (
  checkInsideProject()
  ? ` ${PROJECT_NAME} `
  : ''
);

if (VERSION_INFO) {
  console.log('\n', chalk.grey(`gdev v${VERSION_INFO}`), '\n');
}

if (HEAD) {
  console.log(chalk.bgBlue(chalk.whiteBright(HEAD)));
}

if (TREE) {
  console.log(chalk.blueBright(TREE), '\n');
}


/**
 * Display the location of the dev and production files.
 */
displayBuildInfo();


/**
 * Parse process arguments.
 */
program.parse(process.argv);

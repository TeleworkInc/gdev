const chokidar = require('chokidar');
const fs = require('fs');
const process = require('process');
const touch = require('touch');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { callBash, callBashSequential } = require('call-bash');

/**
 * Bail out if not inside a project directory.
 */
const insideProject = () => fs.existsSync(
    path.resolve(process.cwd(), '.gproj')
);

const CWD = process.cwd();

/**
 * Slightly stylized logging utils. 
 */

const blue = (...msgs) => chalk.blueBright(...msgs);

const log = (...msgs) => console.log(
    chalk.bgBlueBright(' MSG '),
    ...msgs,
    '\n',
);

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
        '--language_in="ECMASCRIPT_NEXT"',
        '--jscomp_off="nonStandardJsDocs"',
        '--rewrite_polyfills',
        '--use_types_for_optimization',
    ],

    DEV_FLAGS = [
        '-O="SIMPLE"'
    ],

    RELEASE_FLAGS = [
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
            { stdio: ['ignore', 'ignore', 'inherit'] }
        );
    } catch(e) {
        spinner.fail('Oops! Something went wrong.')
    }

    spinner.succeed('Compiled ' + blue(`${mode}.js`));
}

const INTRO_TEMPLATE = `
/**
 * @define {boolean}
 */
const PRODUCTION = false;

console.log('Welcome to GProject!');
`;

const ESLINT_TEMPLATE = `
env:
  browser: true
  commonjs: true
  es2020: true
  node: true
extends:
  - google
parserOptions:
  ecmaVersion: 11
rules: {}
`;

const initializeDirectory = async (name) => {

    const srcDir = path.resolve(name, 'lib');
    const compileDir = path.resolve(name, 'dist');

    fs.mkdirSync(name);
    fs.mkdirSync(srcDir);
    fs.mkdirSync(compileDir);

    fs.writeFileSync(
        path.resolve(srcDir, 'index.js'),
        INTRO_TEMPLATE
    );

    touch(path.resolve(name, '.gproj'));

    const cmds = [
        'npm init -y',
        'npm install --save-dev eslint eslint-config-google',
    ];

    fs.writeFileSync(path.resolve(name, '.eslintrc.yaml'), ESLINT_TEMPLATE, 'utf-8');
    await callBashSequential(cmds, { cwd: name, stdio: 'inherit' });

}

const createProject = async (name) => {

    await initializeDirectory(name);
    success(
        'Created project at:',
        blue(name),
    );
}


/**
 * Public functions.
 */

const create = (name) => {

    if (fs.existsSync(name))
        error('File or directory already exists.');

    else createProject(name);
}


const compile = async () => {

    console.log();

    if (!insideProject())
        return error('\nDirectory is not a gproject workspace.');

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
}

const develop = async (program) => {

    if (!insideProject())
        return error('\nDirectory is not a gproject workspace.');

    chokidar.watch(
        `${CWD}/lib/**/*.js`,
        {
            ignoreInitial: true,
            awaitWriteFinish: true
        }
    ).on('all',
        (event, path) => compile(program),
    );

    await compile();
    console.log('\nListening for file changes in', blue('lib/'));
}

const displayBuildInfo = () => {
    if (insideProject()) {
        console.log(
            chalk.bgBlue(chalk.whiteBright(' DEV  ')),
            path.resolve('dist', 'dev.js')
        );

        console.log(
            chalk.bgCyan(chalk.whiteBright(' PROD ')),
            path.resolve('dist', 'release.js')
        );

        console.log();
    }
}

module.exports = {
    insideProject,
    displayBuildInfo,
    create,
    compile,
    develop,
};
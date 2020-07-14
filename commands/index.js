const chokidar = require('chokidar');
const fs = require('fs');
const process = require('process');
const touch = require('touch');
const path = require('path');
const chalk = require('chalk');
const { promisfy } = require('util');
const { spawn, spawnSync } = require('child_process');
const ora = require('ora');

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
    chalk.bgGreenBright(' SUCCESS '),
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

let pendingLock = false;

const callCompiler = async (...customFlags) => {
    
    const spinner = ora('Compiling...').start();

    const FLAGS = [...DEFAULT_FLAGS, ...customFlags];
    const childPromise = new Promise((resolve, reject) => {
        spawnSync('google-closure-compiler', FLAGS);
        resolve();
    }, () => {
        spinner.fail('Something went wrong.')
    });

    spinner.succeed('Compiled!');
}

const INTRO_TEMPLATE = `
/**
 * @define {boolean}
 */
const PRODUCTION = false;

console.log('Welcome to GProject!');
`;

const createProject = (name) => {

    const srcDir = path.resolve(name, 'lib');
    const compileDir = path.resolve(name, 'dist');

    fs.mkdirSync(name);
    fs.mkdirSync(srcDir);
    fs.mkdirSync(compileDir);

    process.chdir(name);
    spawnSync('yarn', [
        'init -y',
    ]);
    process.chdir('..');

    fs.writeFileSync(
        path.resolve(srcDir, 'index.js'),
        INTRO_TEMPLATE
    );

    touch(path.resolve(name, '.gproj'));
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

    if (!insideProject())
        return error('\nDirectory is not a gproject workspace.');

    await callCompiler(
        ...DEV_FLAGS,
        `--js="${CWD}/src/**.js"`,
        `--js_output_file="${CWD}/dist/dev.js"`,
    );

    await callCompiler(
        ...RELEASE_FLAGS,
        `--js="${CWD}/src/**.js"`,
        `--js_output_file="${CWD}/dist/compiled.js"`,
    );
}

const develop = (program) => {

    if (!insideProject())
        return error('\nDirectory is not a gproject workspace.');

    chokidar.watch(
        `${CWD}/src/**/*.js`,
        {
            ignoreInitial: true,
            awaitWriteFinish: true
        }
    ).on('all',
        (event, path) => compile(program),
    );

    compile();
}

const displayBuildInfo = () => {
    if (insideProject()) {

        console.log(
            chalk.bgBlue(chalk.white(' DEV  ')),
            path.resolve('dist', 'dev.js')
        );

        console.log(
            chalk.bgGreen(chalk.white(' PROD ')),
            path.resolve('dist', 'compiled.js')
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
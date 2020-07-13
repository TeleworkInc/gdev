const chokidar = require('chokidar');
const fs = require('fs');
const process = require('process');
const touch = require('touch');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');
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
    chalk.bgGreen(' SUCCESS '),
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

const INTRO_TEMPLATE = `
/**
 * @define {boolean}
 */
const PRODUCTION = false;

console.log('Welcome to GProject!');
`;

const createProject = (rootDir) => {

    const srcDir = path.resolve(rootDir, 'src');
    const compileDir = path.resolve(rootDir, '.build');

    fs.mkdirSync(rootDir);
    fs.mkdirSync(srcDir);
    fs.mkdirSync(compileDir);

    fs.writeFileSync(
        path.resolve(srcDir, 'index.js'),
        INTRO_TEMPLATE
    );

    touch(path.resolve(rootDir, '.gproj'));
    success(
        'Created project at:',
        blue(rootDir),
    );
}

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

const callCompiler = (...customFlags) => {
    const child = spawn('google-closure-compiler', [
        ...DEFAULT_FLAGS,
        ...customFlags
    ]);

    if (!pendingLock) {

        const spinner = ora('Compiling...').start();
        pendingLock = true;

        child.on('exit', () => {
            spinner.stop();
            pendingLock = false;
        });
    }
}

/**
 * Public functions.
 */

const create = (name) => {
    const abs = path.resolve(name);

    if (!insideProject())
        return error('Directory is not a gproject workspace.');

    else if (fs.existsSync(abs))
        error('File or directory already exists.');

    else createProject(abs);
}


const compile = () => {

    if (!insideProject())
        return error('\nDirectory is not a gproject workspace.');

    callCompiler(
        ...DEV_FLAGS,
        `--js="${CWD}/src/**.js"`,
        `--js_output_file="${CWD}/.build/dev.js"`,
    );

    callCompiler(
        ...RELEASE_FLAGS,
        `--js="${CWD}/src/**.js"`,
        `--js_output_file="${CWD}/.build/compiled.js"`,
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
    if (insideProject())
        console.log(chalk.bgBlue(' DEV  '), path.resolve('.build', 'dev.js')),
        console.log(chalk.bgCyan(' PROD '), path.resolve('.build', 'compiled.js')),
        console.log();
}

module.exports = {
    insideProject,
    displayBuildInfo,
    create,
    compile,
    develop,
};
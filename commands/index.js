const chokidar = require('chokidar');
const fs = require('fs');
const sha256 = require('js-sha256');
const process = require('process');
const touch = require('touch');
const path = require('path');
const chalk = require('chalk');
const npm = require('npm');

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

const introTemplate = `
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
        introTemplate
    );

    touch(path.resolve(rootDir, '.gproj'));
    success(
        'Created project at:',
        blue(rootDir),
    );
}

const
    defaultFlags = [
        '-W="VERBOSE"',
        '--language_in="ECMASCRIPT_NEXT"',
        '--jscomp_off="nonStandardJsDocs"',
        '--rewrite_polyfills',
        '--use_types_for_optimization',
    ],

    devFlags = [
        '-O="SIMPLE"'
    ],

    debugFlags = [
        ...devFlags,
        '--debug'
    ],

    releaseFlags = [
        '-O="ADVANCED"',
        '--language_out="ECMASCRIPT5_STRICT"',
        '--define="PRODUCTION=true"',
        '--isolation_mode="IIFE"',
        '--assume_function_wrapper',
    ];

const callCompiler = (...customFlags) => npm.load(
    () => npm.run(
        'compiler',
        ...defaultFlags,
        ...customFlags
    )
);

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

const develop = (program) => {

    if (!insideProject())
        return error('Directory is not a gproject workspace.');

    chokidar.watch(
        `${CWD}/src/**/*.js`,
        {
            ignoreInitial: true
        }
    ).on('all',
        (event, path) => {
            console.log('Building dev bundle...');
            compile(program);
        }
    );
}

const compile = (program) => {

    if (!insideProject())
        return error('Directory is not a gproject workspace.');

    console.log('Building development freeze...');
    callCompiler(
        ...devFlags,
        `--js="${CWD}/src/**.js"`,
        `--js_output_file="${CWD}/.build/dev.js"`,
    );

    console.log('Building release freeze...');
    callCompiler(
        ...releaseFlags,
        `--js="${CWD}/src/**.js"`,
        `--js_output_file="${CWD}/.build/compiled.js"`,
    );
}

module.exports = {
    insideProject,
    create,
    compile,
    develop,
};
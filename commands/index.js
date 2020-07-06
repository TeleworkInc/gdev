const fs = require('fs');
const touch = require('touch');
const path = require('path');
const chalk = require('chalk');

/**
 * Slightly stylized logging utils. 
 */

const blue = (...msgs) => chalk.blueBright(...msgs);

const log = (...msgs) => console.log(
    chalk.bgBlueBright(' MSG '),
    ...msgs
);

const success = (...msgs) => console.log(
    chalk.bgGreen(' SUCCESS '),
    ...msgs
);

const error = (...msgs) => console.log(
    chalk.bgRed(' ERROR '),
    ...msgs
);

/**
 * 
 * Internal functions.
 */

const createProject = (rootDir) => {

    const srcDir = path.resolve(rootDir, 'src');
    const buildDir = path.resolve(rootDir, 'build');

    fs.mkdirSync(rootDir);
    fs.mkdirSync(srcDir);
    fs.mkdirSync(buildDir);

    fs.writeFileSync(
        path.resolve(srcDir, 'index.js'),
        'console.log("Hello world!");'
    );

    touch(path.resolve(rootDir, '.gproj'));
    success(
        'Created project at:',
        blue(rootDir),
    );
}

const
    defaultFlags = [
        '-W VERBOSE',
        '--language_in ECMASCRIPT_NEXT',
        '--jscomp_off nonStandardJsDocs',
        '--rewrite_polyfills --use_types_for_optimization',
    ],

    devFlags = [
        '-O SIMPLE'
    ],

    debugFlags = [
        ...devFlags,
        '--debug'
    ],

    releaseFlags = [
        '-O ADVANCED',
        '--language_out ECMASCRIPT5_STRICT',
        '--define PRODUCTION=true',
        '--isolation_mode IIFE',
        '--assume_function_wrapper',
    ];

/**
 * Public functions.
 */
const build = () => {
    console.log('Hello world!');
}

const create = (name) => {
    const abs = path.resolve(name);

    if (!fs.existsSync(abs))
        createProject(abs);

    else error('File or directory already exists.');

}

const debug = () => {
    console.log('Hello world!');
}

const dev = () => {
    console.log('Hello world!');
}

module.exports = {
    create,
    debug,
    dev,
    build
};
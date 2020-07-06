const chokidar = require('chokidar');
const fs = require('fs');
const touch = require('touch');
const path = require('path');
const chalk = require('chalk');
const npm = require('npm');

const checkProject = (dir) => fs.existsSync(path.resolve(dir, '.gproj'));

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

console.log('Hello world!');
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

    if (fs.existsSync(abs))
        error('File or directory already exists.');
        
    else createProject(abs); 
}

const develop = (dir = '.', program) => {
    dir = path.resolve(dir);

    if (!checkProject(dir))
        return error('Directory is not a gproject workspace.');
        
    chokidar.watch(
        `${dir}/src/**.js`).on('all', 
        (event, path) => {
            console.log('Building dev bundle...');
            compile(dir, { dev: true });
        }
    );
}

const compile = (dir = '.', program) => {
    dir = path.resolve(dir);

    if (!checkProject(dir))
        return error('Directory is not a gproject workspace.');

    else if (program.dev)
        callCompiler(
            ...devFlags,
            `--js="${dir}/src/**.js"`,
            `--js_output_file="${dir}/.build/dev.js"`,
        );

    else 
        callCompiler(
            ...releaseFlags,
            `--js="${dir}/src/**.js"`,
            `--js_output_file="${dir}/.build/compiled.js"`,
        );
}

module.exports = {
    create,
    compile,
    develop,
};
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

const createProject = (abs) => {

    const devDir = path.resolve(abs, 'dev');
    const distDir = path.resolve(abs, 'dist');

    fs.mkdirSync(abs);
    fs.mkdirSync(devDir);
    fs.mkdirSync(distDir);

    fs.writeFileSync();

    touch(path.resolve(abs, '.gproj'));
    success(
        'Created project at:',
        blue(abs),
    );
}

/**
 * Public functions.
 */

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

const dist = () => {
    console.log('Hello world!');
}

module.exports = {
    create,
    debug,
    dev,
    dist
};
const fs = require('fs');
const touch = require('touch');
const path = require('path');
const chalk = require('chalk');

/**
 * Define any core logic here.
 */

const create = (name) => {

    const abs = path.resolve(name);
    if (!fs.existsSync(abs))
        fs.mkdirSync(abs),
            touch(path.resolve(abs, '.gproj')),
            success(
                'Created project at:',
                blue(abs),
            );

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
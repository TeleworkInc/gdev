/**
 * Define any core logic here.
 */

const create = () => {
    console.log('Hello world!');
}

const dev = () => {
    console.log('Hello world!');
}

const dist = () => {
    console.log('Hello world!');
}

/**
 * Specify exports for use in bin file and when
 * this package is `require`d.
 */
module.exports = {
    create,
    dev,
    dist
};
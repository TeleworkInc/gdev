const testVar = require('./test/test');
/**
 * This variable is overridden by Closure Compiler during compilation.
 *
 * @define {boolean}
 */
const PRODUCTION = false;

console.log('Welcome to GProject!');
console.log('Production mode:', PRODUCTION);
console.log({ testVar });

import { testVar } from './test/test';

/**
 * The Production flag will be overwritten to `true` when the project is
 * compiled in release mode.
 *
 * @define {boolean}
 */
const PRODUCTION = goog.define('PRODUCTION', false);

console.log('Welcome to gdev!');
console.log('Production mode:', PRODUCTION);
console.log({ testVar });

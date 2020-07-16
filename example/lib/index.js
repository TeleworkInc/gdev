import { testVar } from './test/test';

/**
 * The Production flag will be overwritten to `true` when the project is
 * compiled in release mode.
 *
 * @define {boolean}
 */
const PRODUCTION = goog.define('gproject.FLAGS.PRODUCTION', false);

console.log('Welcome to GProject!');
console.log('Production mode:', PRODUCTION);
console.log({ testVar });

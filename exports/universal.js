/**
 * @license MIT
 *
 * @file
 * The universal exports for this project, completely non-dependent on NodeJS
 * libraries.
 */

export * from '../lib/TestAB.js';
export * from '../lib/TestC.js';
/**
 * Need to give an indirect `default` export a name if we want to safely
 * reference it later.
 * */
export { default as TestDefault } from '../lib/TestDefault.js';
export { TEST_STRING } from '../lib/templates.js';

console.log('Boom, a side effect!');

/**
 * @license MIT
 *
 * @fileoverview
 * Specify the exports for this project's CLI.
 */

/**
 * Expose data from `lib/`.
 */
export * from '../lib/TestAB.js';
export * from '../lib/TestC.js';

export { default as TestDefault } from '../lib/TestDefault.js';
export { TEST_STRING } from '../lib/templates.js';

/**
 * This is a side effect that won't get removed due to dead code elimination.
 */
const a = 10;
console.log(`a is ${a}`);

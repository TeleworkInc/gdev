/**
 * @license MIT
 *
 * @file
 * The universal exports for this project, completely non-dependent on NodeJS
 * libraries.
 */

import { INTRO_TEMPLATE } from '../lib/templates.js';
console.log(INTRO_TEMPLATE);

/**
 * A test class to export.
 *
 * @exportSymbol
 */
export class MyTestClass {
  /** Create a new TestClass. */
  constructor() {
    console.log('Hello world!');
  }
}

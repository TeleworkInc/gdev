/** @license MIT */
/**
 * @fileoverview
 * Globals to be overridden at compile-time.
 */

/**
 * This polyfill will allow us to mock `goog.define` (and override definitions
 * at compile-time) without actually loading the Closure Library.
 */
if (typeof goog === 'undefined')
  globalThis.goog = {
    define: (n, v) => v,
  };

/**
 * Whether or not this is compiled release output in the dist/ directory.
 *
 * @define {boolean!}
 */
export var RELEASE = goog.define('RELEASE', false);

/**
 * Whether or not to log debug messages. Compiler overrides to false.
 *
 * @define {boolean!}
 */
export var DEV = goog.define('DEV', true);

/**
 * @license MIT
 */
/**
 * @fileoverview
 * Get package.json object. This is depended on by `boot.js`, and cannot contain
 * any third-party modules.
 */

import fs from 'fs';
import path from 'path';

/**
 * Using `import.meta.url` to store an absolute reference to this directory.
 * rollup-plugin-import-meta-url will effectively hack around limitations by
 * encoding invalid relative URLs that would not be accepted by
 * `url.fileURLToPath`, such as `file://fileInThisDir.js`.
 */
export const PACKAGE_ROOT = path.dirname(import.meta.url.substr(7));

/**
 * Read the package.json object from the current directory.
 *
 * @param {boolean} fromRoot
 * Set to `true` to refer to gnv's package.json, not the package.json in the
 * current working directory as indicated by `process.cwd()`.
 *
 * @return {object} package
 * The package.json object.
 */
export const readPackageJson = (fromRoot = false) => JSON.parse(
    fs.readFileSync(
        path.resolve((
            fromRoot
                ? PACKAGE_ROOT
                : process.cwd()
        ),
        'package.json'),
    ),
);

/**
 * @param {object} obj
 * The new package.json object to serialize and write.
 *
 * @param {boolean} toRoot
 * Set to `true` to write to gnv's package.json, rather than the package.json in
 * the current working directory as indicated by `process.cwd()`.
 *
 * @param {number} spaces
 * The number of spaces to use for tabs in JSON.stringify. Defaults to 2.
 * @return {void}
 */
export const writePackageJson = (obj, toRoot = false, spaces = 2) => (
  fs.writeFileSync(
      path.resolve((
        toRoot
            ? PACKAGE_ROOT
            : process.cwd()
      ), 'package.json'),
      JSON.stringify(obj, null, 2),
  )
);

/**
 * Get the version of this package as defined in package.json.
 *
 * @return {string} version
 */
export const getVersion = () => readPackageJson(true).version;

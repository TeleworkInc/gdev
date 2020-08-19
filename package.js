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
import { fileURLToPath } from 'url';

/**
 * The absolute dirname of this package.
 */
export const PACKAGE_ROOT = path.dirname(fileURLToPath(import.meta.url));

/**
 * Read the package.json object from the current directory.
 *
 * @return {object} package
 * The package.json object.
 */
export const readPackageJson = () => JSON.parse(
    fs.readFileSync(
        path.resolve(process.cwd(), 'package.json'),
    ),
);

/**
 * @param {object} obj
 * The new package.json object to serialize and write.
 *
 * @param {number} spaces
 * The number of spaces to use for tabs in JSON.stringify. Defaults to 2.
 *
 * @return {void}
 */
export const writePackageJson = (obj, spaces = 2) => fs.writeFileSync(
    path.resolve(process.cwd(), 'package.json'),
    JSON.stringify(obj, null, 2),
);

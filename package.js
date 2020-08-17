/**
 * @license MIT
 */
/**
 * @fileoverview
 * Get package.json object.
 */

import fs from 'fs';
import path from 'path';

export const getPackageJson = () => JSON.parse(
    fs.readFileSync(
        path.resolve(process.cwd(), 'package.json'),
    ),
);

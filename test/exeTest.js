/**
 * @license MIT
 *
 * @fileoverview
 * Test the compiled executable for this project.
 */

import 'chai/register-expect.js';
import path from 'path';
import fs from 'fs';
import { runInThisContext } from 'vm';

/**
 * Will pass if no errors encountered with executable.
 */
describe('Compiled executable', () => {
  it('should not throw errors', () => {
    runInThisContext(fs.readFileSync(path.resolve('dist/exe.js')));
  });
});

/**
 * @license MIT
 *
 * @fileoverview
 * Test the file permissions of the exported CLI.
 */

import 'chai/register-expect.js';

import fs from 'fs';
import path from 'path';
import glob from 'glob';

describe('Generated CLI bundles', () => {
  const files = glob.sync('./{dev,dist}/cli.**');
  for (const file of files) {
    it(`should be executable (755) [${path.resolve(file)}]`, () => {
      expect(
          () => fs.accessSync(file, fs.constants.X_OK),
      ).to.not.throw();
    });
  }
});

/**
 * @license MIT
 *
 * @fileoverview
 * Test the compiled executable for this project.
 */

import 'chai/register-expect.js';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import shell from 'await-shell';
import { runInThisContext } from 'vm';

/**
 * Will pass if no errors encountered with executable.
 */
describe('Compiled executable', () => {
  it('should not throw errors', () => {
    runInThisContext(fs.readFileSync(path.resolve('dist/exe.js')));
  });
});

describe('CLIs in export/, dev/, and dist/', async () => {
  glob.sync('{dev,dist}/cli.*').map(
      (cli) => {
        it(`should execute without errors for ${cli}`, async () => {
          global.SHELL_OPTIONS = {
            stdio: 'ignore',
          };
          await shell(cli);
        });
      },
  );
});

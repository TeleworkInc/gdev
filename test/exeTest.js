/**
 * @license MIT
 *
 * @file
 * Test the compiled executable for this project.
 */

import 'chai/register-expect.js';

/**
 * Import (run) executable from dist/.
 */
import * as exe from '../dist/exe.js';

describe('Compiled executable', () => {
  it('should not throw errors', () => {
    expect(() => exe).not.to.throw();
  });
});

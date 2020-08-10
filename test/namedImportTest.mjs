/**
 * @license MIT
 */

/**
 * @fileoverview
 * Named import test for ES modules in dist/.
 */

import 'chai/register-expect.js';
import { TEST_STRING } from '../dist/universal.mjs';

describe('Named ESM import', () => {
  it('should import TEST_STRING from [dist/universal.mjs]', () => {
    expect(TEST_STRING).to.not.be.undefined;
  });
});

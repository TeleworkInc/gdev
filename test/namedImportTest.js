/**
 * @license MIT
 */

/**
 * @fileoverview
 * Named import test for ES modules in dist/.
 */

import 'chai/register-expect.js';
import { build } from '../dist/node.mjs';

describe('Named ESM import', () => {
  it('should import TEST_STRING from [dist/node.mjs]', () => {
    expect(build).to.not.be.undefined;
  });
});

/**
 * @license MIT
 *
 * @fileoverview
 * Check that the default export is an object containing the named exports
 * (ESM).
 */

import 'chai/register-expect.js';
import gnv from '../dev/node.mjs';
import { callCompiler } from '../dev/node.mjs';

describe('Default ESM import from [dev/node.mjs]', () => {
  it('should be non-null', () => {
    expect(gnv).to.not.be.undefined;
  });
});

describe('Named ESM import from [dev/node.mjs]', () => {
  it('should be non-null', () => {
    expect(callCompiler).to.not.be.undefined;
  });
});

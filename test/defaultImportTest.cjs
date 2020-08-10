/**
 * @license MIT
 *
 * @fileoverview
 * Check that the default export is an object containing the named exports
 * (CJS).
 */

require('chai/register-expect');

const { callCompiler } = require('../dev/node.cjs');
const devNode = require('../dev/node.cjs');

describe('Default CJS import from [dev/node.cjs]', () => {
  it('should be non-null', () => {
    expect(devNode).to.not.be.undefined;
  });
});

describe('Named CJS import from [dev/node.cjs]', () => {
  it('should be non-null', () => {
    expect(callCompiler).to.not.be.undefined;
  });
});

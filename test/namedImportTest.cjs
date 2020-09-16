/**
 * @license MIT
 *
 * @fileoverview
 * A named import test for CJS modules in dist/.
 */

require('chai/register-expect');

const { build } = require('../dist/node.cjs');
describe('Named CJS import', () => {
  it('should import TEST_STRING from [dist/node.cjs]', () => {
    expect(build).to.not.be.undefined;
  });
});

/**
 * @license MIT
 *
 * @fileoverview
 * A named import test for CJS modules in dist/.
 */

require('chai/register-expect');

const { TEST_STRING } = require('../dist/universal.cjs');
describe('Named CJS import', () => {
  it('should import TEST_STRING from [dist/universal.cjs]', () => {
    expect(TEST_STRING).to.not.be.undefined;
  });
});

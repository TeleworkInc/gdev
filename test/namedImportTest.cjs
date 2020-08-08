/**
 * @license MIT
 *
 * @fileoverview
 * A named import test for CJS modules in dist/.
 */

require('chai/register-expect');

const { TestA, TestB, TestC, TestDefault } = require('../dist/universal.cjs');
describe('Named CJS import', () => {
  it('should work for test class in [dist/universal.cjs]', () => {
    expect(TestA).to.not.be.undefined;
    expect(TestB).to.not.be.undefined;
    expect(TestC).to.not.be.undefined;
    expect(TestDefault).to.not.be.undefined;
  });
});

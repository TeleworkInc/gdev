/**
 * @license MIT
 * @fileoverview
 * Named import test for ES modules in dist/.
 */
import 'chai/register-expect.js';
import { TestA, TestB, TestC, TestDefault } from '../dist/universal.mjs';

describe('Named ESM import', () => {
  it('should work for test class in [dist/universal.mjs]', () => {
    expect(TestA).to.not.be.undefined;
    expect(TestB).to.not.be.undefined;
    expect(TestC).to.not.be.undefined;
    expect(TestDefault).to.not.be.undefined;
  });
});

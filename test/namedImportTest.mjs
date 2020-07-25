/* eslint-disable jsdoc/require-file-overview */
/* eslint-disable require-jsdoc */
import 'chai/register-expect.js';
import { TestA, TestB, TestC, TestDefault } from '../dist/universal.min.mjs';

describe('Named ESM import', () => {
  it('should work for test class in [dist/universal.min.js]', () => {
    expect(TestA).to.not.be.undefined;
    expect(TestB).to.not.be.undefined;
    expect(TestC).to.not.be.undefined;
    expect(TestDefault).to.not.be.undefined;
  });
});

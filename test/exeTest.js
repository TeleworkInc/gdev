import chai from 'chai';
const { expect } = chai;

/**
 * Import (run) executable from dist/.
 */
import * as exe from '../dist/exe.js';

describe('Compiled executable', () => {
  it('should not throw errors', () => {
    expect(() => exe).not.to.throw();
  });
});

import chai from 'chai';

import * as TestCJS from '../dist/node.cjs';
import * as TestESM from '../dist/node.mjs';
import * as TestGCC from '../dist/node.min.cjs';


describe('Module import/export', () => {
  it('should provide non-null import object', () => {
    chai.expect(TestCJS)
        .to.not.be('undeifned');
  });
});

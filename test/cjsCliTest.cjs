const { expect } = require('chai');

const cjsCli = require('../dist/cli.cjs');
const cjsCliMin = require('../dist/cli.min.cjs');

describe('importing CLI', function() {
  it('should not fail for uncompiled CJS [dist/cli.cjs]', function() {
    expect(() => cjsCli).to.not.throw();
  });
  it('should not fail for compiled CJS [dist/cli.min.cjs]', function() {
    expect(() => cjsCliMin).to.not.throw();
  });
});

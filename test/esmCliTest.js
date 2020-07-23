import chai from 'chai';
const { expect } = chai;

import * as esmCli from '../dist/cli.mjs';
import * as cjsCliMin from '../dist/cli.min.mjs';

describe('importing CLI', function() {
  it('should not fail for uncompiled ESM [dist/cli.mjs]', function() {
    expect(() => esmCli).to.not.throw();
  });
  it('should not fail for compiled ESM [dist/cli.min.mjs]', function() {
    expect(() => cjsCliMin).to.not.throw();
  });
});

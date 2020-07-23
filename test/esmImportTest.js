import * as thisPackage from 'gdev';
import chai from 'chai';

import * as esmCli from '../dev/cli.mjs';
import * as cjsCliMin from '../dist/cli.min.mjs';
import * as esmNode from '../dev/node.mjs';
import * as esmNodeMin from '../dist/node.min.mjs';

const { expect } = chai;

describe('ESM import', function() {
  it('should import this package', function() {
    expect(thisPackage.create).to.be.a('function');
  });

  it('should import the uncompiled module [dev/node.mjs]', function() {
    expect(esmNode.create).to.be.a('function');
  });

  it('should import the compiled module [dist/node.min.mjs]', function() {
    expect(esmNodeMin.create).to.be.a('function');
  });

  it('should not fail for uncompiled ESM [dev/cli.mjs]', function() {
    expect(() => esmCli).to.not.throw();
  });

  it('should not fail for compiled ESM [dist/cli.min.mjs]', function() {
    expect(() => cjsCliMin).to.not.throw();
  });
});

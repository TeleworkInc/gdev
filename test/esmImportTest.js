import 'chai/register-expect.js';

import * as thisPackage from 'gdev';
import * as esmCli from '../dev/cli.mjs';
import * as cjsCliMin from '../dist/cli.min.mjs';
import * as esmNode from '../dev/node.mjs';
import * as esmNodeMin from '../dist/node.min.mjs';

describe('ESM import', () => {
  it('should import this package', () => {
    expect(thisPackage.create).to.be.a('function');
  });

  it('should import the uncompiled module [dev/node.mjs]', () => {
    expect(esmNode.create).to.be.a('function');
  });

  it('should import the compiled module [dist/node.min.mjs]', () => {
    expect(esmNodeMin.create).to.be.a('function');
  });

  it('should not fail for uncompiled ESM [dev/cli.mjs]', () => {
    expect(() => esmCli).to.not.throw();
  });

  it('should not fail for compiled ESM [dist/cli.min.mjs]', () => {
    expect(() => cjsCliMin).to.not.throw();
  });
});

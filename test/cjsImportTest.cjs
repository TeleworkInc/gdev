/**
 * @license MIT
 *
 * @file
 * Test CJS imports for this project.
 */

require('chai/register-expect');

describe('CJS require()', () => {
  it('should import this npm package', () => {
    expect(require('..').callCompiler).to.be.a('function');
  });

  it('should import the uncompiled module [dev/node.cjs]', () => {
    expect(require('../dev/node.cjs').callCompiler).to.be.a('function');
  });

  it('should import the compiled module [dist/node.min.cjs]', () => {
    expect(require('../dist/node.min.cjs').callCompiler).to.be.a('function');
  });

  it('should not fail for uncompiled CLI bundle [dev/cli.cjs]', () => {
    expect(() => require('../dev/cli.cjs')).to.not.throw();
  });

  it('should not fail for compiled CLI bundle [dist/cli.min.cjs]', () => {
    expect(() => require('../dist/cli.min.cjs')).to.not.throw();
  });

  it('should import test classes from [dev/universal.cjs]', () => {
    const mod = require('../dev/universal.cjs');
    expect(mod.TestA).to.not.be.undefined;
    expect(mod.TestB).to.not.be.undefined;
    expect(mod.TestC).to.not.be.undefined;
    expect(mod.TEST_STRING).to.not.be.undefined;
  });

  it('should import test classes from [dist/universal.min.cjs]', () => {
    const mod = require('../dist/universal.min.cjs');
    expect(mod.TestA).to.not.be.undefined;
    expect(mod.TestB).to.not.be.undefined;
    expect(mod.TestC).to.not.be.undefined;
    expect(mod.TEST_STRING).to.not.be.undefined;
  });
});

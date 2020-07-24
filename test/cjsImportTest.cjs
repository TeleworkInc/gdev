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

  it('should import MyTestClass from [dev/universal.cjs]', () => {
    expect(require('../dev/universal.cjs').MyTestClass).to.not.be.undefined;
  });

  it('should import MyTestClass from [dist/universal.min.cjs]', () => {
    expect(
        require('../dist/universal.min.cjs').MyTestClass,
    ).to.not.be.undefined;
  });
});

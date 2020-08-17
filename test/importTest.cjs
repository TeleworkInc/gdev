/**
 * @license MIT
 *
 * @fileoverview
 * Test CJS imports for this project.
 */

const shell = require('await-shell');
require('chai/register-expect');

global.SHELL_OPTIONS = {
  stdio: 'ignore',
};

describe('CJS require()', () => {
  it('should import this npm package', () => {
    expect(require('..').create).to.be.a('function');
  });

  it('should import the uncompiled module [dev/node.cjs]', () => {
    expect(require('../dev/node.cjs').create).to.be.a('function');
  });

  it('should import the compiled module [dist/node.cjs]', () => {
    expect(require('../dist/node.cjs').create).to.be.a('function');
  });

  it('should not fail for compiled CLI bundle [dist/cli.cjs]', async () => {
    await shell('node dist/cli.cjs');
  });

  it('should import test classes from [dev/universal.cjs]', () => {
    const mod = require('../dev/universal.cjs');
    expect(mod.TEST_STRING).to.not.be.undefined;
  });

  it('should import test classes from [dist/universal.cjs]', () => {
    const mod = require('../dist/universal.cjs');
    expect(mod.TEST_STRING).to.not.be.undefined;
  });
});

const { expect } = require('chai');
const cjsNode = require('../dev/node.cjs');
const cjsNodeMin = require('../dist/node.min.cjs');

const cjsCli = require('../dev/cli.cjs');
const cjsCliMin = require('../dist/cli.min.cjs');

const thisPackage = require('..');

describe('CJS require()', function() {
  it('should import this npm package', () => {
    expect(thisPackage.callCompiler).to.be.a('function');
  });

  it('should import the uncompiled module [dev/node.cjs]',
      function() {
        expect(cjsNode.callCompiler).to.be.a('function');
      });

  it('should import the compiled module [dist/node.min.cjs]',
      function() {
        expect(cjsNodeMin.callCompiler).to.be.a('function');
      });

  it('should not fail for uncompiled CLI bundle [dev/cli.cjs]', function() {
    expect(() => cjsCli).to.not.throw();
  });

  it('should not fail for compiled CLI bundle [dist/cli.min.cjs]', function() {
    expect(() => cjsCliMin).to.not.throw();
  });
});

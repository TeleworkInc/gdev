const { expect } = require('chai');
const CJSImport = require('../dist/node.cjs');
const CJSMinImport = require('../dist/node.min.cjs');

describe('CJS require()', function() {
  it('should successfuly import the uncompiled module [dist/node.cjs]',
      function() {
        expect(CJSImport.callCompiler).to.be.a('function');
      });

  it('should successfuly import the compiled module [dist/node.min.cjs]',
      function() {
        expect(CJSMinImport.callCompiler).to.be.a('function');
      });
});

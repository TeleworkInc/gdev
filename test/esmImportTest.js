import chai from 'chai';
import * as NodeModule from '../dev/node.mjs';
import * as NodeMinModule from '../dist/node.min.mjs';

const { expect } = chai;

describe('ESM import', function() {
  it('should successfuly import the uncompiled module [dev/node.mjs]',
      function() {
        expect(NodeModule.create).to.be.a('function');
      });

  it('should successfuly import the compiled module [dist/node.min.mjs]',
      function() {
        expect(NodeMinModule.create).to.be.a('function');
      });
});

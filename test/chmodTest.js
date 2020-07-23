import fs from 'fs';
import glob from 'glob';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('Generated CLI bundles', () => {
  const files = glob.sync('./{dev,dist}/cli.**');
  for (const file of files) {
    it(`should be executable (755): ${file}`, () => {
      expect(() => fs.accessSync(file, fs.constants.X_OK)).to.not.throw();
    });
  }
});

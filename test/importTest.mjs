/**
 * @license MIT
 *
 * @file
 * Test ESM imports for this project.
 */

import 'chai/register-expect.js';
import * as thisPackage from 'gnv';

import * as cliDev from '../dev/cli.mjs';
import * as cliDist from '../dist/cli.min.mjs';

import * as nodeDev from '../dev/node.mjs';
import * as nodeDist from '../dist/node.min.mjs';

import * as universalDev from '../dev/universal.mjs';
import * as universalDist from '../dist/universal.min.mjs';

describe('ESM import', () => {
  it('should import this package', () => {
    expect(thisPackage.create).to.be.a('function');
  });

  it('should import the uncompiled module [dev/node.mjs]', () => {
    expect(nodeDev.create).to.be.a('function');
  });

  it('should import the compiled module [dist/node.min.mjs]', () => {
    expect(nodeDist.create).to.be.a('function');
  });

  it('should not fail for uncompiled ESM [dev/cli.mjs]', () => {
    expect(() => cliDev).to.not.throw();
  });

  it('should not fail for compiled ESM [dist/cli.min.mjs]', () => {
    expect(() => cliDist).to.not.throw();
  });

  it('should import test classes from [dev/universal.mjs]', () => {
    expect(universalDev.TestA).to.not.be.undefined;
    expect(universalDev.TestB).to.not.be.undefined;
    expect(universalDev.TestC).to.not.be.undefined;
    expect(universalDev.TEST_STRING).to.not.be.undefined;
  });

  it('should import test classes from [dist/universal.mjs]', () => {
    expect(universalDist.TestA).to.not.be.undefined;
    expect(universalDist.TestB).to.not.be.undefined;
    expect(universalDist.TestC).to.not.be.undefined;
    expect(universalDist.TEST_STRING).to.not.be.undefined;
  });
});

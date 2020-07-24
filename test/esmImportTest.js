/**
 * @license MIT
 *
 * @file
 * Test ESM imports for this project.
 */

import 'chai/register-expect.js';
import * as thisPackage from 'gdev';

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

  it('should import class MyTestClass from [dev/universal.mjs]', () => {
    expect(universalDev.MyTestClass).to.not.be.undefined;
  });

  it('should import class MyTestClass from [dist/universal.mjs]', () => {
    expect(universalDist.MyTestClass).to.not.be.undefined;
  });
});

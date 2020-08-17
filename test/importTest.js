/**
 * @license MIT
 *
 * @fileoverview
 * Test ESM imports for this project.
 */

import 'chai/register-expect.js';
import * as thisPackage from 'gnv';

import * as nodeDev from '../dev/node.mjs';
import * as nodeDist from '../dist/node.mjs';

import * as universalDev from '../dev/universal.mjs';
import * as universalDist from '../dist/universal.mjs';
import shell from 'await-shell';

global.SHELL_OPTIONS = {
  stdio: 'ignore',
};

describe('ESM import', () => {
  it('should import this npm package', () => {
    expect(thisPackage.create).to.be.a('function');
  });

  it('should import the uncompiled module [dev/node.mjs]', () => {
    expect(nodeDev.create).to.be.a('function');
  });

  it('should import the compiled module [dist/node.mjs]', () => {
    expect(nodeDist.create).to.be.a('function');
  });

  it('should exit 0 for uncompiled ESM [dev/cli.mjs]', async () => {
    await shell('node dev/cli.mjs');
  });

  it('should exit 0 for for compiled ESM [dist/cli.mjs]', async () => {
    await shell('node dist/cli.mjs');
  });

  it('should import test classes from [dev/universal.mjs]', () => {
    expect(universalDev.TEST_STRING).to.not.be.undefined;
  });

  it('should import test classes from [dist/universal.mjs]', () => {
    expect(universalDist.TEST_STRING).to.not.be.undefined;
  });
});

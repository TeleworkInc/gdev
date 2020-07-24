/**
 * @license MIT
 *
 * @file
 * Make sure the raw ESM source code for this project works as expected.
 */

import 'chai/register-expect.js';

import * as cli from '../exports/cli.js';
import * as node from '../exports/node.js';
import * as universal from '../exports/universal.js';

describe('Importing exports from source', () => {
  it('should not fail for [exports/cli.js]', () => {
    expect(cli).to.be.empty;
  });

  it('should not fail for [exports/node.js]', () => {
    expect(node.create).to.be.a('function');
  });

  it('should not fail for [exports/universal.js]', () => {
    expect(() => universal).to.not.throw();
  });
});

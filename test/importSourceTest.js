/**
 * @license MIT
 *
 * @fileoverview
 * Make sure the raw ESM source code for this project works as expected.
 */

import 'chai/register-expect.js';

import * as node from '../exports/node.js';

describe('Importing exports from source', () => {
  it('should not fail for [exports/node.js]', () => {
    expect(node.create).to.be.a('function');
  });
});

/**
 * @license MIT
 */
/**
 * @fileoverview
 * Install gnvDependencies and peerDependencies. This file cannot use third
 * party modules.
 */

import { getPackageJson } from './package.js';
import { spawnSync } from 'child_process';

const packageJson = getPackageJson();
const gnvDependencies = Object.keys(packageJson.gnvDependencies || {});
const peerDependencies = Object.keys(packageJson.peerDependencies || {});

const callNpm = (...args) => spawnSync(
    'npm',
    args,
    {
      stdio: 'inherit',
    },
);

/**
 * Install gnvDependencies in this folder without updating package.json.
 */
if (gnvDependencies.length) {
  console.log('Adding local gnv deps to node_modules/:', '\n');
  console.log(...gnvDependencies, '\n');

  callNpm('i', '--no-save', ...gnvDependencies);
}

/**
 * Globally install all peerDependencies without updating package.json, then
 * link all globally installed peerDeps to make them available in this package.
 */
if (peerDependencies.length) {
  console.log('Adding global peerDeps:', '\n');
  console.log(...peerDependencies, '\n');

  /**
   * Install peerDeps globally.
   */
  callNpm('i', '-g', '--no-save', ...peerDependencies);

  /**
   * Link peerDeps locally.
   */
  callNpm('link', ...peerDependencies);
}

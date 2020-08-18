/**
 * @license MIT
 */
/**
 * @fileoverview
 * Install gnvDependencies and peerDependencies. This file cannot use third
 * party modules.
 *
 * @author Christian Lewis <hello@trytelework.com>
 */

import { readPackageJson } from './package.js';
import { spawnSync } from 'child_process';

const packageJson = readPackageJson();

const versionString = (deps = {}) => (
  Object.entries(deps || {}).map(
      ([key, val]) => `${key}@${val}`,
  )
);

const gnvDependencies = versionString(packageJson.gnvDependencies);
const peerDependencies = versionString(packageJson.peerDependencies);

const callNpm = (...args) => spawnSync(
    'npm',
    args,
    {
      stdio: 'inherit',
    },
);


/**
 * Link this package. This has to be done before everything else due to the
 * weird behavior of npm, which will delete necessary dependencies if this is
 * run after installing peerDeps or gnvDeps.
 */
console.log('Linking this package to global bin...\n');
callNpm('link', '-f', '--no-save');


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
  /**
   * Make sure no previous versions of this package are linked in this
   * workspace.
   */
  const anyVersionPeerDeps = Object.keys(packageJson.peerDependencies);

  /**
   * Install peerDeps globally.
   */
  console.log('Adding global peerDeps:\n');
  console.log(...peerDependencies, '\n');
  callNpm('i', '-fg', '--no-save', ...peerDependencies);

  /**
   * Link peerDeps locally. Also links this package so that CLIs are available.
   */
  console.log('Linking peer dependencies locally...\n');
  callNpm('link', '-f', '--no-save', ...anyVersionPeerDeps);

  console.log(
      '\nDone! Your development CLI should be ready at `gnv-dev`.\n',
  );
}

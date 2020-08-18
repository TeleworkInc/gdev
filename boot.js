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

const spacer = (...strs) => console.log(
    ...strs.map((str) => `[𝓰𝓷𝓿]  ${str}\n`),
);

const gnvDependencies = versionString(packageJson.gnvDependencies);
const peerDependencies = versionString(packageJson.peerDependencies);

const NPM_FLAGS = ['--no-save', '--silent'];
const callNpm = (...args) => {
  console.log(`\n>  npm ${args.join(' ')}\n`);
  spawnSync(
      'npm',
      args,
      {
        stdio: 'inherit',
      },
  );
};


/**
 * Link this package. This has to be done before everything else due to the
 * weird behavior of npm, which will delete necessary dependencies if this is
 * run after installing peerDeps or gnvDeps.
 */
spacer('Linking this package to global bin...');
callNpm('link', '-f', ...NPM_FLAGS);


/**
 * Install gnvDependencies in this folder without updating package.json.
 */
if (gnvDependencies.length) {
  spacer('Adding local gnv deps to node_modules:');
  callNpm('i', ...NPM_FLAGS, ...gnvDependencies);
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
  spacer('Adding global peerDeps:');
  callNpm('i', '-f', '-g', ...NPM_FLAGS, ...peerDependencies);

  /**
   * Link peerDeps locally. Also links this package so that CLIs are available.
   */
  spacer('Linking peer dependencies locally...');
  callNpm('link', '-f', ...NPM_FLAGS, ...anyVersionPeerDeps);

  /**
   * Everything was successful!
   */
  spacer('Done! Your development CLI should be ready at `gnv-dev`.');
}

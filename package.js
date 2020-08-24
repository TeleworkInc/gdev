/**
 * @license MIT
 */
/**
 * @fileoverview
 * Get package.json object. This is depended on by `boot.js`, and cannot contain
 * any third-party modules.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

/**
 * A utility for dependency-less colored logging.
 *
 * @param {string} msg
 * @return {void}
 */
export const spacer = (msg) => console.log(
    '\x1b[96m%s\x1b[0m', `[𝓰𝓷𝓿]` + ` ${msg}`,
);

/**
 * Call the `npm` client.
 *
 * @param  {...string} args
 * The arguments to pass to npm.
 */
export const callNpm = (...args) => {
  console.log(`\n> npm ${args.join(' ')}\n`);
  spawnSync(
      'npm',
      args,
      {
        /**
         * Only inherit stderr.
         */
        stdio: ['ignore', 'ignore', 'inherit'],
      },
  );
};

/**
 * A package string of the form @org/packageName@ver
 *
 * @typedef {string} PackageString
 */
let PackageString;

/**
 * An object containing information about an NPM package.
 *
 * @typedef {{
 *  name: string,
 *  org: string,
 *  version: string,
 * }} PackageInfo
 */
let PackageInfo;

/**
 * Using `import.meta.url` to store an absolute reference to this directory.
 * rollup-plugin-import-meta-url will effectively hack around limitations by
 * encoding invalid relative URLs that would not be accepted by
 * `url.fileURLToPath`, such as `file://fileInThisDir.js`.
 */
export const PACKAGE_ROOT = path.dirname(import.meta.url.substr(7));

/**
 * Turn a package.json-like dependencies object into a list of `PackageString`s.
 *
 * @param {object} deps
 * An object, where keys are package names and values are version strings.
 *
 * @return {Array<PackageString>}
 */
export const getPackageStrings = (deps) => (
  Object.entries(deps).map(
      ([key, val]) => `${key}@${val}`,
  )
);

export const installGnvDependencies = () => {
  const packageJson = readPackageJson();
  const gnvDependencies = getPackageStrings(packageJson.gnvDependencies);

  if (gnvDependencies.length) {
    spacer('Adding local gnv deps to node_modules:');
    callNpm('i', '-f', '--no-save', '--silent', ...gnvDependencies);
  }
};

export const installPeerDependencies = () => {
  const packageJson = readPackageJson();
  const peerDependencies = getPackageStrings(packageJson.peerDependencies);

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
    callNpm('i', '-g', '--no-save', ...peerDependencies);

    /**
     * Link peerDeps locally. Also links this package so that CLIs are
     * available.
     */
    spacer('Linking peer dependencies locally...');
    callNpm('link', '-f', '--no-save', ...anyVersionPeerDeps);

    /**
     * Everything was successful!
     */
    spacer('Done! Your development CLI should be ready at `gnv-dev`.\n');
  }
};


/**
 * Read the package.json object from the current directory.
 *
 * @param {boolean} fromRoot
 * Set to `true` to refer to gnv's package.json, not the package.json in the
 * current working directory as indicated by `process.cwd()`.
 *
 * @return {object} package
 * The package.json object.
 */
export const readPackageJson = (fromRoot = false) => JSON.parse(
    fs.readFileSync(
        path.resolve((
            fromRoot
                ? PACKAGE_ROOT
                : process.cwd()
        ),
        'package.json'),
    ),
);

/**
 * @param {object} obj
 * The new package.json object to serialize and write.
 *
 * @param {boolean} toRoot
 * Set to `true` to write to gnv's package.json, rather than the package.json in
 * the current working directory as indicated by `process.cwd()`.
 *
 * @param {number} spaces
 * The number of spaces to use for tabs in JSON.stringify. Defaults to 2.
 * @return {void}
 */
export const writePackageJson = (obj, toRoot = false, spaces = 2) => (
  fs.writeFileSync(
      path.resolve((
        toRoot
            ? PACKAGE_ROOT
            : process.cwd()
      ), 'package.json'),
      JSON.stringify(obj, null, 2),
  )
);

/**
 * Get the version of this package as defined in package.json.
 *
 * @return {string} version
 */
export const getVersion = () => readPackageJson(true).version;

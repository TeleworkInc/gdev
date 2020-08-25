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
 * Call the `npm` client.
 *
 * @param  {...string} args
 * The arguments to pass to npm.
 */
export const callNpm = async (...args) => {
  console.log(`\n> npm ${args.join(' ')}\n`);
  await spawnSync(
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
 * `url.fileURLToPath`, such as `file://fileInThisDir` -> `./fileInThisDir`.
 */
export const PACKAGE_ROOT = path.dirname(
    import.meta.url.replace('file://', ''),
);

/**
 * Get the package info from a PackageString.
 *
 * @param {PackageString} packageString
 *
 * @return {PackageInfo}
 */
const getPackageInfo = (packageString) => {
  let orgString;
  let version;

  if (packageString[0] === '@') {
    [orgString, packageString] = packageString.split('/');
  }

  [packageString, version] = packageString.split('@');

  /**
   * Add @latest flag if no version present.
   */
  if (!version) version = 'latest';

  return {
    name: packageString,
    org: (orgString || '').substr(1),
    version,
  };
};

/**
 * Turn a package.json-like dependencies object into a list of `PackageString`s.
 *
 * @param {object} deps
 * An object, where keys are package names and values are version strings.
 *
 * @return {Array<PackageString>}
 */
export const getPackageStrings = (deps = {}) => (
  Object.entries(deps).map(
      ([key, val]) => `${key}@${val}`,
  )
);

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
 * Add the given packages to package.json's gnvDependencies field.
 *
 * @param {...PackageString} packageStrings
 * The packages to add.
 *
 * @param {*} command
 * Command metadata.
 */
export const add = async (packageStrings, command) => {
  const packageJson = readPackageJson();
  for (const packageString of packageStrings) {
    const {
      name,
      org,
      version,
    } = getPackageInfo(packageString);

    const pkgString = (
        org
          ? `@${org}/${name}`
          : name
    );

    /**
     * Add to peerDependencies if -P flag set, otherwise add to gnvDependencies.
     */
    (command.peer
          ? packageJson.peerDependencies
          : packageJson.gnvDependencies
    )[pkgString] = version;

    /**
     * Write to package.json/
     */
    writePackageJson(packageJson);
  }

  /**
   * Print success and start boot.
   */
  console.log('Added', ...packageStrings, 'to package.json.');
  await boot();
};

export const remove = async () => {};

export const install = async (command = {}) => {
  /**
   * Link this package. This has to be done before everything else due to the
   * weird behavior of npm, which will delete necessary dependencies if this is
   * run after installing peerDeps or gnvDeps.
   */
  spacer('Linking this package to global bin...');
  await callNpm('link', '-f', '--no-save', '--silent');

  /**
   * If not in dev mode, install just the peer deps.
   */
  if (!command.dev) {
    spacer('Release mode: Installing peer dependencies only.');
    await getGlobalDeps(command.self);
  }
  /**
   * Otherwise, install global and local dependencies for the package.json.
   */
  else {
    await getLocalDeps(command.self);
    await getGlobalDeps(command.self);
  };
};

/**
 * Get ALL dependencies for a package.
 */
export const getAllDeps = async () => {
  /**
   * Install gnvDependencies for the package.json in the parent folder.
   */
  await getLocalDeps(true);


  /**
   * Install peerDependencies for the package.json in the parent folder, and
   * link into local `node_modules`.
   */
  await getGlobalDeps(true);
};

/**
 * Install gnvDependencies for a package.json.
 *
 * @param {boolean} absolute
 * Set to `true` to to reference package.json in the parent directory with
 * respect to this file, rather than the package.json in the current working
 * directory as indicated by `process.cwd()`.
 *
 * @return {void}
 */
export const getLocalDeps = async (absolute = false) => {
  const packageJson = readPackageJson(absolute);
  const gnvDependencies = getPackageStrings(packageJson.gnvDependencies);

  if (!gnvDependencies.length) {
    return spacer('No gnvDependencies to install.');
  }

  spacer('Adding local gnv deps to node_modules:');
  await callNpm('i', '-f', '--no-save', '--silent', ...gnvDependencies);
  spacer(`Installed ${gnvDependencies.length} packages.`);
};

/**
 * Install peerDependencies for a package.json.
 *
 * @param {boolean} absolute
 * Set to `true` to to reference package.json in the parent directory with
 * respect to this file, rather than the package.json in the current working
 * directory as indicated by `process.cwd()`.
 *
 * @return {void}
 */
export const getGlobalDeps = async (absolute = false) => {
  const packageJson = readPackageJson(absolute);
  const peerDependencies = getPackageStrings(packageJson.peerDependencies);

  if (!peerDependencies.length) {
    return spacer('No peerDependencies to install.');
  }

  /**
   * Make sure no previous versions of this package are linked in this
   * workspace.
   */
  const anyVersionPeerDeps = Object.keys(packageJson.peerDependencies);

  /**
   * Install peerDeps globally.
   */
  spacer('Adding global peerDeps:');
  await callNpm('i', '-g', '--no-save', '--silent', ...peerDependencies);

  /**
   * Link peerDeps locally. Also links this package so that CLIs are
   * available.
   */
  spacer('Linking peer dependencies locally...');
  await callNpm('link', '-f', '--no-save', '--silent', ...anyVersionPeerDeps);

  /**
   * Everything was successful!
   */
  spacer(
      `Installed and linked ${peerDependencies.length} packages. `
    + `Your development CLI should be ready at \`gnv-dev\`.\n`,
  );
};


/**
 * Read the package.json object from the current directory.
 *
 * @param {boolean} absolute
 * Set to `true` to to reference package.json in the parent directory with
 * respect to this file, rather than the package.json in the current working
 * directory as indicated by `process.cwd()`.
 *
 * @return {object} package
 * The package.json object.
 */
export const readPackageJson = (absolute = false) => JSON.parse(
    fs.readFileSync(
        path.resolve((
            absolute
                ? PACKAGE_ROOT
                : process.cwd()
        ),
        'package.json'),
    ),
);

/**
 * @param {object} obj The new package.json object to serialize and write.
 *
 * @param {boolean} absolute
 * Set to `true` to to reference package.json in the parent directory with
 * respect to this file, rather than the package.json in the current working
 * directory as indicated by `process.cwd()`.
 *
 * @param {number} spaces The number of spaces to use for tabs in
 * JSON.stringify. Defaults to 2.
 *
 * @return {void}
 */
export const writePackageJson = (obj, absolute = false, spaces = 2) => (
  fs.writeFileSync(
      path.resolve((
        absolute
            ? PACKAGE_ROOT
            : process.cwd()
      ), 'package.json'),
      JSON.stringify(obj, null, spaces),
  )
);

/**
 * Get the version of this package as defined in package.json.
 *
 * @return {string} version
 */
export const getVersion = () => readPackageJson(true).version;

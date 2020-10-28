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
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs';

const spacer = (...msgs) => console.log(
    '\x1b[96m%s\x1b[0m', `[𝓰𝓷𝓿]` + ` ${msgs.join(' ')}`,
);

const getPackageStrings = (deps = {}) => (
  Object.entries(deps).map(
      ([ key, val ]) => `${key}@${val}`,
  )
);

const callNpm = async (...args) => {
  console.log(`\n> npm ${args.join(' ')}\n`);
  await spawnSync(
      'npm',
      args,
      {
        /**
         * Only inherit stderr.
         */
        stdio: [ 'ignore', 'ignore', 'inherit' ],
      },
  );
};

/**
 * Read the package.json object from the current directory.
 *
 * @param {string} directory
 * The directory to load the package.json from. Defaults to `process.cwd()`.
 *
 * @return {object} package
 * The package.json object.
 */
export const readPackageJson = (directory = '.') => {
  /**
   * Resolve from the CWD to the relative (or absolute) `directory`, then read
   * package.json.
   */
  const fileName = path.resolve(
      process.cwd(),
      directory,
      'package.json',
  );

  return existsSync(fileName)
      ? JSON.parse(readFileSync(fileName))
      : {};
};


/**
 * @param {object} obj The new package.json object to serialize and write.
 *
 * @param {{
 *  directory: string,
 *  spaces: number
 * }} options
 *
 * @return {void}
 */
export const writePackageJson = (obj, {
  directory = '.',
  spaces = 2,
} = {}) => {
  const fileName = path.resolve(
      process.cwd(),
      directory,
      'package.json',
  );

  if (existsSync(fileName))
    writeFileSync(
        fileName,
        JSON.stringify(obj, null, spaces),
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
 * Get the package info from a PackageString.
 *
 * @param {PackageString} packageString
 * The PackageString to transform.
 *
 * @return {PackageInfo}
 */
const getPackageInfo = (packageString) => {
  let orgString;
  let version;

  if (packageString[0] === '@')
    [ orgString, packageString ] = packageString.split('/');


  [ packageString, version ] = packageString.split('@');

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
 * Exits if not inside a project. Pass `silent = true` to return false instead.
 *
 * @param {boolean} silent
 * Set to `true` to return `false` instead of throwing an error.
 *
 * @return {boolean}
 * `true` if insideProject.
 */
export const checkInsideProject = (silent) => {
  const configExists = fs.existsSync(
      path.resolve(process.cwd(), '.gnv'),
  );
  if (!configExists)
    if (silent) return false;
    else {
      spacer('Oops! Not inside a gnv project.');
      process.exit(1);
    }

  return true;
};

/**
 * Using `import.meta.url` to store an absolute reference to this directory.
 * rollup-plugin-import-meta-url will effectively hack around limitations by
 * encoding invalid relative URLs that would not be accepted by
 * `url.fileURLToPath`, such as `file://fileInThisDir` -> `./fileInThisDir`.
 */
export const PACKAGE_ROOT = path.resolve(
    /** Resolve relative to `process.cwd()`. */
    process.cwd(),
    /** Dir containing package.js. */
    path.dirname(import.meta.url.substr(7)),
);

/**
 * Export the value of the absolute package.json for easy access.
 */
export const PACKAGE_JSON = readPackageJson(PACKAGE_ROOT);

/**
 * The name of this package.
 */
export const PACKAGE_NAME = PACKAGE_JSON.name || '';

/**
 * Add the given packages to package.json's gnvDependencies field.
 *
 * @param {...PackageString} packageStrings
 * The packages to add.
 *
 * @param {{
 *  peer: boolean,
 * }} options
 * Command metadata.
 */
export const add = async (packageStrings, {
  peer = false,
} = {}) => {
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
    (peer
          ? packageJson.peerDependencies
          : packageJson.gnvDependencies
    )[pkgString] = version;

    /**
     * Write to package.json.
     */
    writePackageJson(packageJson);
    spacer('Added', packageStrings.length, 'packages.');
  }
};

/**
 * Remove the given packages to package.json's gnvDependencies field.
 *
 * @param {...PackageString} packageStrings
 * The packages to remove.
 *
 * @param {{
 *  peer: boolean,
 * }} options
 * Command metadata.
 */
export const remove = async (packageStrings, {
  peer = false,
} = {}) => {
  const packageJson = readPackageJson();
  for (const packageString of packageStrings) {
    const {
      name,
      org,
    } = getPackageInfo(packageString);

    const pkgString = (
      org
        ? `@${org}/${name}`
        : name
    );

    delete (
      peer
        ? packageJson.peerDependencies
        : packageJson.gnvDependencies
    )[pkgString];
  }
};

/**
 * Install the dependencies for the package.json in `process.cwd()`. Use `dev`
 * flag to also install dev dependencies.
 *
 * @param {string} [directory]
 * The directory containing package.json.
 *
 * @param {{
 *  dev: boolean,
 * }} options
 * Command-line options.
 */
export const install = async (
    directory = '.',
    { dev = false } = {},
) => {
  /**
   * Cache original working directory, cd into install dir.
   */
  const originalCwd = process.cwd();
  process.chdir(path.resolve(originalCwd, directory));
  /**
   * Exit if not inside project.
   */
  checkInsideProject();
  /**
   * Make sure files exist.
   */
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  if (!fs.existsSync('dist/cli.cjs'))
    fs.closeSync(fs.openSync('dist/cli.cjs', 'a'));

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
  if (!dev) {
    spacer('Release mode: Installing peer dependencies only.');
    await installGlobalDeps();
  }
  /**
   * Otherwise, install global and local dependencies for the package.json.
   */
  else {
    spacer('Dev mode: Installing local & peer dependencies.');
    await installLocalDeps();
    await installGlobalDeps();
    spacer(
        `Done! Your development CLI should be ready at ` +
      `\`${path.basename(process.cwd())}-dev\`.`,
    );
  };
  /**
   * cd back into original directory.
   */
  process.chdir(originalCwd);
};

/**
 * Install gnvDependencies for a package.json.
 *
 * @param {string} [directory]
 * The directory to load the package.json from. Defaults to `process.cwd()`.
 *
 * @return {void}
 */
export const installLocalDeps = async (directory) => {
  const packageJson = readPackageJson(directory);
  const gnvDependencies = getPackageStrings(packageJson.gnvDependencies);

  if (!gnvDependencies.length)
    return spacer('No gnvDependencies to install.');


  spacer('Adding local gnv deps to node_modules:');
  await callNpm('i', '-f', '--no-save', '--silent', ...gnvDependencies);
  spacer(`Installed ${gnvDependencies.length} packages.`);
};


/**
 * Install peerDependencies for a package.json.
 *
 * @param {string} [directory]
 * The directory to load the package.json from. Defaults to `process.cwd()`.
 *
 * @return {void}
 */
export const installGlobalDeps = async (directory) => {
  const packageJson = readPackageJson(directory);
  const peerDependencies = getPackageStrings(packageJson.peerDependencies);

  if (!peerDependencies.length)
    return spacer('No peerDependencies to install.');


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
  spacer(`Installed and linked ${peerDependencies.length} packages.`);
};


/**
 * Get the version of this package as defined in package.json.
 *
 * @return {string} version
 */
export const PACKAGE_VERSION = readPackageJson(PACKAGE_ROOT).version || '';

/**
 * Install the global dependencies for this program. Same as
 * .gnv/npm/install.js.
 */
export const getPeerDeps = async () => {
  await installGlobalDeps(PACKAGE_ROOT);
};

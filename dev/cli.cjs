#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var commander = _interopDefault(require('commander'));
var treeNodeCli = _interopDefault(require('tree-node-cli'));
var chalk = _interopDefault(require('chalk'));
var fs = require('fs');
var fs__default = _interopDefault(fs);
var chokidar = _interopDefault(require('chokidar'));
var ora = _interopDefault(require('ora'));
var shell = _interopDefault(require('await-shell'));
var path = require('path');
var path__default = _interopDefault(path);
var child_process = require('child_process');

/**
 * @license MIT
 */

const spacer = (...msgs) => console.log(
    '\x1b[96m%s\x1b[0m', `[𝓰𝓷𝓿]` + ` ${msgs.join(' ')}`,
);

const getPackageStrings = (deps = {}) => (
  Object.entries(deps).map(
      ([key, val]) => `${key}@${val}`,
  )
);

const callNpm = async (...args) => {
  console.log(`\n> npm ${args.join(' ')}\n`);
  await child_process.spawnSync(
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
 * Read the package.json object from the current directory.
 *
 * @param {string} directory
 * The directory to load the package.json from. Defaults to `process.cwd()`.
 *
 * @return {object} package
 * The package.json object.
 */
const readPackageJson = (directory = '.') => {
  /**
   * Resolve from the CWD to the relative (or absolute) `directory`, then read
   * package.json.
   */
  const fileName = path__default.resolve(
      process.cwd(),
      directory,
      'package.json',
  );

  return fs.existsSync(fileName)
      ? JSON.parse(fs.readFileSync(fileName))
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
const writePackageJson = (obj, {
  directory = '.',
  spaces = 2,
} = {}) => {
  const fileName = path__default.resolve(
      process.cwd(),
      directory,
      'package.json',
  );

  if (fs.existsSync(fileName)) {
    fs.writeFileSync(
        fileName,
        JSON.stringify(obj, null, spaces),
    );
  }
};

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
 * Exits if not inside a project. Pass `silent = true` to return false instead.
 *
 * @param {boolean} silent
 * Set to `true` to return `false` instead of throwing an error.
 *
 * @return {boolean}
 * `true` if insideProject.
 */
const checkInsideProject = (silent) => {
  const configExists = fs__default.existsSync(
      path__default.resolve(process.cwd(), '.gnv'),
  );
  if (!configExists) {
    if (silent) return false;
    else {
      spacer('Oops! Not inside a gnv project.');
      process.exit(1);
    }
  }
  return true;
};

/**
 * Using `import.meta.url` to store an absolute reference to this directory.
 * rollup-plugin-import-meta-url will effectively hack around limitations by
 * encoding invalid relative URLs that would not be accepted by
 * `url.fileURLToPath`, such as `file://fileInThisDir` -> `./fileInThisDir`.
 */
const PACKAGE_ROOT = path__default.resolve(
    /** Resolve relative to `process.cwd()`. */
    process.cwd(),
    /** Dir containing package.js. */
    path__default.dirname('file://package.js'.substr(7)),
);

/**
 * Export the value of the absolute package.json for easy access.
 */
const PACKAGE_JSON = readPackageJson(PACKAGE_ROOT);

/**
 * The name of this package.
 */
const PACKAGE_NAME = PACKAGE_JSON.name || '';

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
const add = async (packageStrings, {
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
const remove = async (packageStrings, {
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
const install = async (
  directory = '.',
  { dev = false } = {},
) => {
  /**
   * Cache original working directory, cd into install dir.
   */
  const originalCwd = process.cwd();
  process.chdir(path__default.resolve(originalCwd, directory));
  /**
   * Exit if not inside project.
   */
  checkInsideProject();
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
        `Done! Your development CLI should be ready at `
      + `\`${path__default.basename(process.cwd())}-dev\`.`,
    );
  }  /**
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
const installLocalDeps = async (directory) => {
  const packageJson = readPackageJson(directory);
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
 * @param {string} [directory]
 * The directory to load the package.json from. Defaults to `process.cwd()`.
 *
 * @return {void}
 */
const installGlobalDeps = async (directory) => {
  const packageJson = readPackageJson(directory);
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
  spacer(`Installed and linked ${peerDependencies.length} packages.`);
};


/**
 * Get the version of this package as defined in package.json.
 *
 * @return {string} version
 */
const PACKAGE_VERSION = readPackageJson(PACKAGE_ROOT).version || '';

/**
 * Install the global dependencies for this program. Same as
 * .gnv/npm/install.js.
 */
const getPeerDeps = async () => {
  await installGlobalDeps(PACKAGE_ROOT);
};

/**
 * @license MIT
 */

/**
 * Log messages in blue.
 *
 * @param {...string} msgs
 * The messages to log
 *
 * @return {void}
 */
const blue = (...msgs) => chalk.blueBright(...msgs);

/**
 * Log a success message.
 *
 * @param  {...string} msgs
 * The messages to log.
 *
 * @return {void}
 */
const success = (...msgs) => console.log(
    chalk.bgCyan(
        chalk.whiteBright(' SUCCESS '),
    ),
    ...msgs,
    '\n',
);

/**
 * Log an error message.
 *
 * @param  {...string} msgs
 * The messages to log.
 *
 * @return {void}
 */
const error = (...msgs) => console.log(
    chalk.bgRed(chalk.whiteBright(' ERROR ')),
    ...msgs,
    '\n',
);

/**
 * @license MIT
 */

/**
 * Call process.exit(1) on failure.
 */
global.SHELL_STRICT = true;
/**
 * Log commands as they are fed to the shell.
 */
global.SHELL_LOG = true;

/**
 * Build out dev/.
 */
const buildDev = async () => {
  await shell(
      'echo "\\n------- Building dev/... -------"',
      'npm run build:dev',
  );
};

/**
 * Build out dist/.
 */
const buildDist = async () => {
  await shell(
      /**
       * Build out dist/.
       */
      'echo "\\n------- Building dist/... -------"',
      'npm run build:dist',
      /**
       * Minify dist/ for maximum compression.
       */
      'echo "\\n------- Minifying dist/... -------"',
      'npm run minify:dist',
      /**
       * Create dist/exe.js.
       */
      `npm run build:exe`,
      /**
       * Add shebangs and mark CLIs executable.
       */
      `npm run format-clis`,
  );
};

/**
 * Build a gnv project.
 *
 * @param {{
 *  dev: boolean,
 * }} options
 * Commander options.
 */
const build = async ({
  dev = false,
} = {}) => {
  /**
   * Clean before a build.
   */
  await clean();

  /**
   * Always run dev build if [build] command is called.
   */
  await buildDev();

  /**
   * If dev flag not set, build dist/ and run tests.
   */
  if (!dev) await buildDist();
};


/**
 * Clean the gnv directory.
 *
 * @return {void}
 */
const clean = async () => {
  console.log('Cleaning project...');
  await shell('rm -rf ./dev/* ./dist/*');
};


/**
 * Create a new gnv workspace.
 *
 * @param {string} name
 * The name of the project to create.
 *
 * @param {?} command
 * The commander command used to call `gnv create`.
 *
 * @return {void}
 */
const create = async (name, command) => {
  if (fs.existsSync(name)) {
    return error('File or directory already exists.');
  }

  global.SHELL_LOG = false;
  global.SHELL_OPTIONS = {
    shell: true,
    stdio: ['ignore', 'ignore', 'inherit'],
  };

  /**
   * Initialize data for use in this process.
   */
  const gitUrl = 'https://github.com/TeleworkInc/gnv-template.git';
  const repoName = name.split('/')[1] || name;

  /**
   * Start spinner and begin project creation.
   */
  const spinner = ora('Creating new project... ').start();

  try {
    /**
     * Clone repo and remove all git information, remove .gnv submodule, then
     * replace `gnv-template` with the repo name in README.md and package.json.
     */
    await shell(
        /**
         * Clone template recursively, and only grab top commit.
         */
        `git clone --quiet --recursive --depth=1 ${gitUrl} ${repoName}`,
        /**
         * Remove all git and gitmodules info from template.
         */
        `rm -rf ${repoName}/.git/* ${repoName}/.gitmodules`,
        /**
         * `sed` is faster than dealing with NodeJS APIs.
         */
        `sed -i s,gnv-template,${repoName},g `
      + `${repoName}/README.md ${repoName}/package.json`,
        /**
         * Remove all git and gitmodules info from default .gnv config.
         */
        `cd ${repoName} && rm -rf .gnv/.git/* .gnv/.gitmodules`,
    );

    /**
     * If using GitHub mode, create new repo, and init here.
     */
    if (command.github) {
      await shell(
          /**
           * Enter dir, initialize, create the GitHub repo, and set remote.
           */
          `cd ${repoName} && hub init -q && `
          /**
           * Create a new GitHub repo.
           */
        + `hub create -c ${name} && `
          /**
           * Add everything to tree.
           */
        + `git add -A --ignore-errors && `
          /**
           * Commit and push to GitHub.
           */
        + `git commit -qm 'New gnv project created' && `
        + `git push -qu origin master`,
      );

      success('GitHub repository link copied to clipboard!');
    }

    /**
     * If using submodule mode, wipe the freshly-pushed git repo and re-add it
     * as a submodule.
     */
    if (command.github && command.submodule && fs__default.existsSync('.git')) {
      await shell(
          /**
           * Store the new git remote.
           */
          `cd ${repoName} && GIT_REMOTE=$(git remote get-url origin) && `
          /**
           * Delete the repo.
           */
          + `cd .. && git rm -rf --ignore-unmatch ${repoName} && `
          /**
           * Re-add as submodule.
           */
        + `git submodule add --quiet $GIT_REMOTE`,
      );
    }

    /**
     * Project ready.
     */
    spinner.succeed('Created project at ' + blue(repoName) + '\n');
    console.log('Installing and linking...');

    /**
     * Run `nom install` and `npm link` to save the user a few steps.
     */
    await shell(
        `cd ${repoName} && npm i -f --silent && npm link -f --silent`,
    );
  }
  catch (e) {
    return spinner.fail('Something went wrong. :-(\n');
  }
};


/**
 * Build the dev bundles for a workspace.
 */
const develop = async () => {
  chokidar.watch(
      `{lib,exports}/**/*.js`,
      {
        ignoreInitial: true,
      },
  ).on('all',
      (event, path) => build(program),
  );

  await build();
  console.log('\nListening for file changes in', blue('lib/'));
};

/**
 * Publish this package to NPM with `npm publish`. Removes the dev CLI from
 * package.json > bin, as `npm i my-package` will try to `chmod +x` it on
 * install and the exports/ directory is not included in the NPM distribution.
 *
 * Publishing a raw gnv package to NPM will throw an error on install unless
 * this command is used (or the `{"my-package-dev": ...}` field is manually
 * removed from the package.json bin).
 *
 * @param {string} level
 * The level by which to bump the package version before publishing.
 */
const publish = async (level = 'patch') => {
  /**
   * Bump version, will automatically stage git commit.
   */
  await shell(`npm version ${level} -f --silent --no-save`);

  /**
   * Store the original value of package.json.
   */
  const originalJson = readPackageJson();
  const packageName = originalJson.name;

  /**
   * Delete the development CLI.
   */
  const modifiedJson = JSON.parse(JSON.stringify(originalJson));
  delete modifiedJson['bin'][`${packageName}-dev`];

  /**
   * Write back to package.json.
   */
  writePackageJson(modifiedJson);

  /**
   * Push to NPM.
   */
  await shell('npm publish');

  /**
   * Add the new version to the original JSON.
   */
  const version = readPackageJson().version;
  const updatedOriginal = {
    ...originalJson,
    version,
  };

  /**
   * Re-write old package.json back to normal, but with new version.
   */
  writePackageJson(updatedOriginal);
};


const test = async () => await shell('mocha');

// import { PACKAGE_ROOT, PACKAGE_VERSION } from '../package.js';

// console.log({ PACKAGE_ROOT });

const CWD = process.cwd();
const PROJECT_NAME = path.basename(CWD);

/**
 * Install the global release dependencies for this package.
 */
commander
    .command('get-peer-deps')
    .description(
        'Install the global peer dependencies for this program. You can also '
      + 'install the peerDependencies manually.',
    )
    .action(getPeerDeps);


commander
    .command('add <pkgs...>')
    .description('Add the given packages as gnv development dependencies.')
    .option('-P, --peer', 'Add as a peerDependency instead.', false)
    .action(add);


commander
    .command('remove <pkgs...>')
    .description('Remove the given packages from gnv development dependencies.')
    .option('-P, --peer', 'Remove from peerDependencies instead.', false)
    .action(remove);


commander
    .command('build')
    .description(
        'Build this workspace and run tests when finished. Final output will '
      + 'be in dist/.',
    )
    .option('-d, --dev', 'Build the dev bundle.')
    .option('-s, --skip-tests', 'Do not run tests after build is finished.')
    .action(build);


commander
    .command('clean')
    .description('Clean the gnv workspace.')
    .action(clean);


commander
    .command('create <name>')
    .description(
        'Create a new gnv workspace and push to GitHub. Use <organization/name>'
      + 'to create for an organization. Requires `hub` package or -ng flag.',
    )
    .option(
        '-ng, --no-github',
        'Do not use GitHub integration. Implies -ns flag.',
    )
    .option(
        '-ns, --no-submodule',
        'Do not create as a submodule, even if inside a git repository.',
    )
    .action(create);


commander
    .command('develop')
    .description(
        'Start developing, and rebuild dev bundles when changes are made to '
      + 'the workspace.',
    )
    .action(develop);


commander
    .command('install [directory]')
    .description(
        'Install all dependencies in [directory]/package.json. Defaults to '
      + 'working directory.',
    )
    .option('-d, --dev', 'Use dev mode.')
    .action(install);


commander
    .command('publish [level]')
    .description(
        'Publish this package to NPM using `npm publish`. Removes dev CLI '
      + 'from package.json to prevent installation issues and bumps the '
      + 'version by [level] (patch, minor, or major). Defaults to patch.',
    )
    .action(publish);


commander
    .command('test')
    .description('Run mocha tests.')
    .action(test);


/**
 * Log a `--- gnv ---` intro and some information about the project directory.
 */

const HEAD = (
  checkInsideProject(true)
  ? ` ${PROJECT_NAME} `
  : ''
);

const TREE = (
  checkInsideProject(true) &&
  fs.existsSync('./lib') &&
  fs.existsSync('./exports')
  ? (
      '\n'
      + treeNodeCli('./lib', {
        dirsFirst: true,
      })
      + '\n\n'
      + treeNodeCli('./exports', {
        dirsFirst: true,
      })
    )
  : ''
);

console.log('\n', chalk.grey(`--- 𝓰𝓷𝓿 ---`), '\n');
// console.log('\n', chalk.grey(`--- 𝓰𝓷𝓿 ${PACKAGE_VERSION} ---`), '\n');

if (HEAD) console.log(chalk.bgBlue(chalk.whiteBright(HEAD)));
if (TREE) console.log(chalk.blueBright(TREE), '\n');

/**
 * Parse command line arguments. Use try {...} catch {...} and
 * program.exitOverride() to prevent nonzero exit.
 */
try {
  commander.exitOverride();
  commander.parse(process.argv);
}
catch (e) {
  /**
   * If no args are provided, this block executes.
   */
  console.log('\n');
}

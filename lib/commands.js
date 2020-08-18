/**
 * @license MIT
 */
/**
 * @fileoverview
 * Specify the commands for this project's CLI.
 */

/**
 * Display shell text.
 */
// global.SHELL_LOG = true;

import { existsSync } from 'fs';

import shell from 'await-shell';
import chalk from 'chalk';
import chokidar from 'chokidar';
import fs from 'fs';
import ora from 'ora';
import path from 'path';

import * as templates from './templates.js';
import commander from 'commander';

import { readPackageJson, writePackageJson } from '../package.js';

/**
 * Log messages in blue.
 *
 * @param {...string} msgs
 * The messages to log
 *
 * @return {void}
 */
const blue = (...msgs) => chalk.blueBright(...msgs);

const success = (...msgs) => console.log(
    chalk.bgCyan(
        chalk.whiteBright(' SUCCESS '),
    ),
    ...msgs,
    '\n',
);

const error = (...msgs) => console.log(
    chalk.bgRed(' ERROR '),
    ...msgs,
    '\n',
);

// import rollupDevEs from '../.gnv/rollup.dev.es.js';
// import rollupDevCjs from '../.gnv/rollup.dev.cjs.js';

/**
 * Add the given packages to package.json's gnvDependencies field.
 *
 * @param {...string} pkgs
 * The packages to add.
 *
 * @param {commander.Command} command
 * Command metadata.
 */
export const add = async (pkgs, command) => {
  const packageJson = readPackageJson();
  for (let pkg of pkgs) {
    /**
     * Add @latest flag if no version present.
     */
    let org;
    let version;

    if (pkg[0] === '@') {
      [org, pkg] = pkg.split('/');
    }
    [pkg, version] = pkg.split('@');

    if (!version) version = 'latest';
    const pkgString = (
      org
        ? `${org}/${pkg}`
        : pkg
    );

    /**
     * Add to peerDependencies if -P flag set, otherwise add to gnvDependencies.
     */
    (command.peer
        ? packageJson.peerDependencies
        : packageJson.gnvDependencies
    )[pkgString] = version;

    writePackageJson(packageJson);
  }

  console.log('Added', ...pkgs, 'to package.json.');
};

export const boot = async () => {
  await shell('node ./boot.js');
};

/**
 * Build out dev/.
 *
 * @return {void}
 */
export const buildDev = async () => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }

  await shell(
      'echo "\\n------- Building dev/... -------"',
      'rollup -c .gnv/rollup.dev.es.js',
      'rollup -c .gnv/rollup.dev.cjs.js',
  );

  // await writeRollupBundles(rollupDevEs);
  // await writeRollupBundles(rollupDevCjs);
};

// import rollupDistEs from '../.gnv/rollup.dist.es.js';
// import rollupDistCjs from '../.gnv/rollup.dist.cjs.js';

/**
 * Build out dist/.
 *
 * @return {void}
 */
export const buildDist = async () => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }

  await shell(
      /**
       * Build out dist/.
       */
      'echo "\\n------- Building dist/... -------"',
      'rollup -c .gnv/rollup.dist.es.js',
      'rollup -c .gnv/rollup.dist.cjs.js',
      /**
       * Run Closure Compiler over everything in dist/ for maximum compression.
       */
      'echo "\\n------- Done. Minifying... -------"',
      'rollup -c .gnv/rollup.dist.minify.js',
      /**
       * Create dist/exe.js.
       *
       * Extracted from config.gulp.mjs > buildExecutableTarget:
       */
      `google-closure-compiler
        --entry_point dev/universal.mjs
        -O ADVANCED
        --process_common_js_modules
        --module_resolution NODE
        --dependency_mode PRUNE
        --js $(npm root -g)/google-closure-library/closure/goog/base.js
        --js dev/universal.mjs
        --js_output_file dist/exe.js`,
      /**
       * Add shebangs and mark CLIs executable.
       */
      `sed -i '1i #!/usr/bin/env node' dist/cli.*`,
      `chmod +x dev/cli.* dist/cli.*`,
  );

  // await writeRollupBundles(rollupDistEs);
  // await writeRollupBundles(rollupDistCjs);
};

/**
 * @external commander
 */

/**
 * Build a gnv project.
 *
 * @param {commander.Command} command
 * Commander options.
 *
 * @return {void}
 */
export const build = async (command) => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }

  await clean();
  await buildDev();

  /**
   * If dev flag not set, build dist/ and run tests.
   */
  if (!command.dev) {
    await buildDist();
    if (!command.skipTests) await test();
  }
};


/**
 * Call the compiler
 *
 * @param {string} mode
 * The mode to use for this build.
 *
 * @param {...string} customFlags
 * Additional flags to pass the compiler.
 *
 * @return {void}
 */
export const callCompiler = async (mode = 'dev', ...customFlags) => {
  const FLAGS = [
    ...customFlags,
    ...templates.DEFAULT_FLAGS,
    `--js_output_file="dist/${mode}.js"`,
  ];

  const commandArg = `google-closure-compiler ${FLAGS.join(' ')}`;
  const spinner = ora('Compiling...');
  console.log('\n' + chalk.grey(commandArg));

  /** Suppress await-shell stdout. */
  global.SPAWN_OPTIONS = { stdio: ['ignore', 'ignore', 'inherit'] };

  try {
    spinner.start();
    await shell('');
  }
  catch (e) {
    console.log(e);
    spinner.fail('Oops! Something went wrong.');
  }

  spinner.succeed('Compiled ' + blue(`${mode}.js`));
};


/**
 * Check if the working directory is a gnv project.
 *
 * @return {boolean}
 * `true` if inside a gnv project.
 */
export const checkInsideProject = () => fs.existsSync(
    path.resolve(process.cwd(), '.gnv'),
);


/**
 * Clean the gnv directory.
 *
 * @return {void}
 */
export const clean = async () => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }
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
export const create = async (name, command) => {
  if (existsSync(name)) {
    return error('File or directory already exists.');
  }

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
    if (command.github && command.submodule && fs.existsSync('.git')) {
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
     * Run `yarn install` and `yarn link` to save the user a few steps.
     */
    await shell(
        `cd ${repoName} && yarn install -s --no-progress && yarn link -s`,
    );
  }

  catch (e) {
    return spinner.fail('Something went wrong. :-(\n');
  }

  /**
   * All done!
   */
  spinner.succeed('Created project at ' + blue(repoName) + '\n');
};


/**
 * Build the dev bundles for a workspace.
 *
 * @return {void}
 */
export const develop = async () => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }

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
 * Display information about the current workspace.
 */
export const displayProjectInfo = () => {
  if (checkInsideProject()) {
    console.log(
        chalk.bgBlue(chalk.whiteBright(' DEV  ')),
        resolve('dist', 'dev.js'),
    );

    console.log(
        chalk.bgCyan(chalk.whiteBright(' PROD ')),
        resolve('dist', 'release.js'),
    );

    console.log();
  }
};


/**
 * Install the NPM packages in package.json's `gnvDependencies` field without
 * updating package.json.
 */
export const install = async () => {
  const gnvDependencies = readPackageJson().gnvDependencies || {};
  console.log(gnvDependencies);
};

/**
 * Publish this package to NPM with `yarn publish`. Removes the dev CLI from
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
export const publish = async (level = 'patch') => {
  /**
   * The original value of package.json.
   */
  const originalJson = readPackageJson();
  const packageName = originalJson.name;

  /**
   * Copy to new object and remove the dev CLI, i.e., for this package, delete
   * packageJson['bin']['gnv-dev'].
   */
  const modifiedJson = JSON.parse(JSON.stringify(originalJson));
  delete modifiedJson['bin'][`${packageName}-dev`];

  /**
   * Write back to package.json.
   */
  writePackageJson(modifiedJson);

  /**
   * Call `yarn publish` with argv.
   */
  await shell(`yarn publish --${level}`);

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


export const test = async () => await shell('mocha');

/**
 * Write Rollup bundles sequentially (to avoid memory issues).
 *
 * @param {...object} configs
 * The list of Rollup configs to process.
 */
// const writeRollupBundles = async (configs) => {
//   for (const config of configs) {
//     const bundle = await rollup(config);
//     await bundle.write(config.output);
//   }
// };

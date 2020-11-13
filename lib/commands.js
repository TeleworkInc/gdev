/**
 * @license MIT
 */
/**
 * @fileoverview
 * Specify the commands for this project's CLI.
 */

import { existsSync, truncateSync } from 'fs';

import chokidar from 'chokidar';
import fs from 'fs';
import ora from 'ora';
import shell from 'await-shell';

/**
 * Globals.
 */
import { DEV } from './globals.js';

/**
 * Import package.json read/write.
 */
import {
  readPackageJson,
  writePackageJson,
} from '../package.js';

/**
 * Logging utils.
 */
import {
  blue,
  error,
  success,
} from './utils.js';

/**
 * Interface from package.json.
 */
export {
  checkInsideProject,
  install,
  add,
  remove,
} from '../package.js';


const useQuietShell = () => {
  global.SHELL_LOG = false;
  global.SHELL_OPTIONS = {
    shell: true,
    /** Only display stderr. */
    stdio: [ 'ignore', 'ignore', 'inherit' ],
  };
};

const useVerboseShell = () => {
  global.SHELL_LOG = truncateSync;
  global.SHELL_OPTIONS = {
    shell: true,
    /** Inherit all stdio. */
    stdio: 'inherit',
  };
};

/**
 * Default log level.
 */
if (DEV) useVerboseShell();
else useQuietShell();

/**
 * Build out dev/.
 */
export const buildDev = async () => {
  await shell(
      'echo "\\n------- Building dev/... -------"',
      'npm run build:dev',
  );
};

/**
 * Build out dist/.
 */
export const buildDist = async () => {
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
      `npm run format:clis`,
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
export const build = async ({ dev = false } = {}) => {
  /** Display all errors. */
  useVerboseShell();

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
export const clean = async () => {
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
  if (existsSync(name))
    return error('File or directory already exists.');

  /** Only  */
  useQuietShell();

  /**
   * Initialize data for use in this process.
   */
  const templateUrl = 'https://github.com/TeleworkInc/gnv-template.git';
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
        /** Clone template recursively, and only grab top commit. */
        `git clone --recursive --quiet ${templateUrl} ${repoName}`,

        /** `sed` is faster than dealing with NodeJS APIs. */
        `sed -i s,gnv-template,${repoName},g ` +
        `${repoName}/README.md ${repoName}/package.json`,

        /** Enter the repo. */
        `cd ${repoName} && ` +

        /** Squash. */
        `git merge --squash && ` +

        /** Remove gnv-template.git origin */
        `git remote remove origin && ` +

        /** Return to working dir. */
        `cd ..`,
    );

    /**
     * If using GitHub mode, create new repo, and init here.
     */
    if (command.github) {
      await shell(
          /**
           * Enter dir, initialize, create the GitHub repo, and set remote.
           */
          `cd ${repoName} && hub init -q && ` +
          /**
           * Create a new GitHub repo.
           */
          `hub create -c ${name} && ` +
          /**
           * Add everything to tree.
           */
          `git add -A --ignore-errors && ` +
          /**
           * Commit and push to GitHub.
           */
          `git commit -qm 'New gnv project created' && ` +
          `git push -f -qu origin master`,
      );

      success('GitHub repository link copied to clipboard!');
    }

    /**
     * If using submodule mode, wipe the freshly-pushed git repo and re-add it
     * as a submodule.
     */
    if (command.github && command.submodule && fs.existsSync('.git'))
      await shell(
          /**
           * Store the new git remote.
           */
          `cd ${repoName} && GIT_REMOTE=$(git remote get-url origin) && ` +
          /**
           * Delete the repo.
           */
          `cd .. && git rm -rf --ignore-unmatch ${repoName} && ` +
          /**
           * Re-add as submodule.
           */
          `git submodule add --quiet $GIT_REMOTE`,
      );


    /**
     * Project ready.
     */
    spinner.succeed('Created project at ' + blue(repoName) + '\n');
    console.log('Installing and linking...');

    /**
     * Run `npm install` and `npm link` to save the user a few steps.
     */
    await shell(
        `cd ${repoName} && npm i -f --no-save --silent && ` +
        `npm link -f --no-save --silent`,
    );
  }
  catch (e) {
    return spinner.fail('Something went wrong. :-(\n');
  }
};


/**
 * Build the dev bundles for a workspace.
 */
export const develop = async () => {
  /** Display all errors. */
  useVerboseShell();

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
export const publish = async (level = 'patch') => {
  /** Display all errors. */
  useVerboseShell();

  /**
   * Store the original value of package.json.
   */
  const originalJson = readPackageJson();
  const packageName = originalJson.name;

  try {
    /**
     * Bump version, will automatically set up git commit.
     */
    await shell('git stage --all');
    await shell(`npm version ${level} -f`);

    /**
     * Delete the `bin/dev-${name}` exe.
     */
    const modifiedJson = JSON.parse(JSON.stringify(originalJson));
    delete modifiedJson['bin'][`${packageName}-dev`];

    /**
     * Write back to package.json.
     */
    writePackageJson(modifiedJson);

    console.log('Re-building project with `build` script prior to publish.');

    /**
     * Build the project.
     */
    await shell('npm run build');

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

    /** Write back with new version. */
    writePackageJson(updatedOriginal);
  }
  /** Something broke. */
  catch (e) {
    console.log('Something went wrong. Package not published.');

    /** Write package.json back to the original version. */
    writePackageJson(originalJson);
  }
};

export const getPeerDeps = async (pkg = 'gnv') => {
  useVerboseShell();
  await shell(
      `npx install-peerdeps ${pkg} -S -o -x web-widgets`,
  );
};

export const test = async () => await shell('mocha');

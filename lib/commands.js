/**
 * @license MIT
 */
/**
 * @fileoverview
 * Specify the commands for this project's CLI.
 */

import { existsSync } from 'fs';
// import { rollup } from 'rollup';

import shell from 'await-shell';
import chalk from 'chalk';
import chokidar from 'chokidar';
import fs from 'fs';
import ora from 'ora';
import path from 'path';

import * as templates from './templates.js';

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

// import rollupDevEs from '../.gnv/config.rollup.dev.es.mjs';
// import rollupDevCjs from '../.gnv/config.rollup.dev.cjs.mjs';

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
      'rollup -c .gnv/config.rollup.dev.es.mjs',
      'rollup -c .gnv/config.rollup.dev.cjs.mjs',
  );

  // await writeRollupBundles(rollupDevEs);
  // await writeRollupBundles(rollupDevCjs);
};

// import rollupDistEs from '../.gnv/config.rollup.dist.es.mjs';
// import rollupDistCjs from '../.gnv/config.rollup.dist.cjs.mjs';

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
      'rollup -c .gnv/config.rollup.dist.es.mjs',
      'rollup -c .gnv/config.rollup.dist.cjs.mjs',
      /**
       * Run Closure Compiler over everything in dist/ for maximum compression.
       */
      'echo "\\n------- Done. Minifying... -------"',
      'rollup -c .gnv/config.rollup.minify.mjs',
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
          --js $HOME/node_modules/google-closure-library/closure/goog/base.js
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
    if (command.submodule && fs.existsSync('.git')) {
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

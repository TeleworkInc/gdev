/**
 * @license MIT
 *
 * @fileoverview
 * Specify the commands for this project's CLI.
 */

import { existsSync } from 'fs';
// import { resolve, basename, extname } from 'path';

import shell from 'await-shell';
import chalk from 'chalk';
import chokidar from 'chokidar';
import filetouch from 'filetouch';
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
  const organizationMode = name.includes('/');
  const gitUrl = 'https://github.com/TeleworkInc/gnv-template.git';
  let repoName = name;
  let organizationName;

  if (organizationMode) {
    const splitSlash = name.split('/');
    [organizationName, repoName] = splitSlash;
  }

  /**
   * Start spinner and begin project creation.
   */
  const spinner = ora('Creating new project... ').start();

  try {
    /**
     * Clone repo and remove all git information, then replace `gnv-template`
     * with the repo name in README.md and package.json.
     */
    await shell(
        /** Clone recursively, and only grab top commit. */
        `git clone --quiet --recursive --depth=1 ${gitUrl} ${repoName}`,

        /** Remove everything in the .git/ directory. */
        `rm -rf ${repoName}/.git/*`,

        /** `sed` is faster than dealing with NodeJS APIs. */
        `sed -i s,gnv-template,${repoName},g `
      + `${repoName}/README.md ${repoName}/package.json`,
    );

    /**
     * If using GitHub mode, create new repo, and init here.
     */
    if (command.github) {
      await shell(
          /** Enter dir, initialize, create the GitHub repo, and set remote. */
          `cd ${repoName} && hub init -q && `

          /** Create a new GitHub repo. */
        + `hub create -c ${name} && `

          /** Add everything to tree. */
        + `git add -A --ignore-errors && `

          /** Commit and push to GitHub. */
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
          /** Store the new git remote. */
          `cd ${repoName} && GIT_REMOTE=$(git remote get-url origin) && `

        /** Delete the repo. */
        + `cd .. && git rm -rf --ignore-unmatch ${repoName} && `

          /** Re-add as submodule. */
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
  // success('Created project at', blue(repoName));
};


/**
 * Build the dev bundle for a project.
 *
 * @return {void}
 */
export const devCompile = async () => {
  if (existsSync(name)) {
    return error('File or directory already exists.');
  }

  await shell('yarn run:rollup');
};

/**
 * Build a gnv project.
 *
 * @param {boolean} devOnly
 * Set to `true` to only build the dev bundles.
 *
 * @return {void}
 */
export const build = async (devOnly = false) => {
  if (!checkInsideProject()) {
    return error('\nDirectory is not a gnv workspace.');
  }

  await shell('yarn build');

  /**
   * Uncomment once Node-ESM interop is resolved:
   * https://github.com/rollup/plugins/issues/539
   */

  // await Promise.all(rollupConfigs.map(
  //     async (config) => {
  //       const bundle = await rollup(config);
  //       await bundle.write(config.output);
  //     },
  // ));

  // await Promise.all(glob.sync('dev/*.mjs').map(
  //     async (file) => {
  //       const bundle = await rollup({
  //         input: file,
  //       });
  //       await bundle.write({
  //         file: file.replace('mjs', 'cjs'),
  //         format: 'cjs',
  //       });
  //     },
  // ));

  console.log();
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


export const initialize = async (dir = '.') => {
  const libDir = resolve(dir, 'lib');
  const compileDir = resolve(dir, 'dist');

  /**
   * Ensure all necessary dirs exist using `filetouch`.
   */
  filetouch.dir(dir);
  filetouch.dir(libDir);
  filetouch.dir(compileDir);

  /**
   * Add `lib/index.js` if it doesn't exist.
   */
  filetouch.file(
      resolve(libDir, 'index.js'),
      templates.INTRO_TEMPLATE,
  );

  /**
   * Add `node_modules` and `dist` to project `.gitignore`.
   */
  filetouch.file(
      resolve(dir, '.gitignore'),
      'node_modules\/\ndist\/',
      'utf-8',
  );

  filetouch.file(resolve(dir, '.gnv'));
  filetouch.file(resolve(dir, '.eslintrc.yaml'), templates.ESLINT_TEMPLATE);

  const cmds = [
    'yarn create esm -y',
    'mv main.js index.mjs',
    'mv index.js index.cjs',
    'yarn add -D eslint eslint-config-google eslint-plugin-jsdoc',
    'yarn add -D rollup rollup-plugin-executable',
  ];

  global.SPAWN_OPTIONS = { cwd: dir, stdio: 'inherit' };
  await shell(...cmds);
};


export const checkInsideProject = () => fs.existsSync(
    path.resolve(process.cwd(), '.gnv'),
);

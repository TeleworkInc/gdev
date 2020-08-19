#!/usr/bin/env node

/**
 * @license MIT
 */
/**
 * @fileoverview
 * Specify the exports for this project's CLI.
 */

import commander from 'commander';
import treeNodeCli from 'tree-node-cli';
import chalk from 'chalk';

import * as commands from '../lib/commands.js';
import { basename } from 'path';

const CWD = process.cwd();
const PROJECT_NAME = basename(CWD);

/**
 * Assign actions to CLI commands.
 */

commander
    .command('add <pkgs...>')
    .description('Add the given packages as gnv development dependencies.')
    .option('-P, --peer', 'Add as a peerDependency instead.', false)
    .action(commands.add);


commander
    .command('boot')
    .description(
        'Install the development dependencies for the current workspace',
    )
    .action(commands.boot);


commander
    .command('build')
    .description(
        'Build this workspace and run tests when finished. Final output will '
      + 'be in dist/.',
    )
    .option('-d, --dev', 'Build the dev bundle.')
    .option('-s, --skip-tests', 'Do not run tests after build is finished.')
    .action(commands.build);


commander
    .command('clean')
    .description('Clean the gnv workspace.')
    .action(commands.clean);


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
    .action(commands.create);


commander
    .command('develop')
    .description(
        'Start developing, and rebuild dev bundles when changes are made to '
      + 'the workspace.',
    )
    .action(commands.develop);


commander
    .command('install-peer-deps')
    .description(
        'Install the relevant global deps (Rollup, Closure Compiler), etc.',
    )
    .action(commands.installPeerDeps);


commander
    .command('publish [level]')
    .description(
        'Publish this package to NPM using `npm publish`. Removes dev CLI '
      + 'from package.json to prevent installation issues and bumps the '
      + 'version by [level] (patch, minor, or major). Defaults to patch.',
    )
    .action(commands.publish);


commander
    .command('test')
    .description('Run mocha tests.')
    .action(commands.test);


/**
 * Log a `--- gnv ---` intro and some information about the project directory.
 */

const HEAD = (
  commands.checkInsideProject()
  ? ` ${PROJECT_NAME} `
  : ''
);

const TREE = (
  commands.checkInsideProject()
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

/**
 * @param {string...} test
 */
console.log('\n', chalk.grey('--- 𝓰𝓷𝓿 ---'), '\n');

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

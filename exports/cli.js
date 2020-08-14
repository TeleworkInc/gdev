#!/usr/bin/env node

/**
 * @license MIT
 *
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
        'Do not use GitHub integration.',
    )
    .option(
        '-ns, --no-submodule',
        'Do not create as a submodule, even if inside a git repository.',
    )
    .action(commands.create);

commander
    .command('develop')
    .description('Start developing and build when changes are made.')
    .action(commands.develop);

commander
    .command('build')
    .description('Build this workspace and output in [dist].')
    .action(commands.build);

commander
    .command('init [directory]')
    .description('Initialize a workspace inside an existing directory.')
    .action(commands.initialize);


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

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
    .command('create <project>')
    .description('Create a new gnv workspace.')
    .action(commands.create);

commander
    .command('develop')
    .description('Start developing and build when changes are made.')
    .action(commands.develop);

commander
    .command('compile')
    .description('Compile this workspace and output in [dist].')
    .action(commands.compile);

commander
    .command('init [directory]')
    .description('Initialize a workspace inside an existing directory.')
    .action(commands.initialize);

/**
 * Print some info about the project directory.
 */
const TREE = (
  commands.checkInsideProject() ?
  '\n' + treeNodeCli('./lib') :
  ''
);

const HEAD = (
  commands.checkInsideProject() ?
  ` ${PROJECT_NAME} ` :
  ''
);

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
} catch (e) {
  /**
   * If no args are provided, this block executes.
   */
}

console.log('\n');

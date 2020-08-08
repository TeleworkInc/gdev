/**
 * @license MIT
 */
/**
 * @file
 * Specify the exports for this project's CLI.
 */
import program from 'commander';
import tree from 'tree-node-cli';
import chalk from 'chalk';
import { basename } from 'path';
import * as commands from '../lib/commands.js';

const CWD = process.cwd();
const PROJECT_NAME = basename(CWD);

/**
 * Assign actions to CLI commands.
 */
program
    .command('create <project>')
    .description('Create a new gnv workspace.')
    .action(commands.create);

program
    .command('develop')
    .description('Start developing and build when changes are made.')
    .action(commands.develop);

program
    .command('compile')
    .description('Compile this workspace and output in [dist].')
    .action(commands.compile);

program
    .command('init [directory]')
    .description('Initialize a workspace inside an existing directory.')
    .action(commands.initialize);

/**
 * Print some info about the project directory.
 */
const TREE = (
  commands.checkInsideProject()
  ? '\n' + tree('./lib')
  : ''
);

const HEAD = (
  commands.checkInsideProject()
  ? ` ${PROJECT_NAME} `
  : ''
);

console.log('\n', chalk.grey('--- 𝓰𝓷𝓿 ---'), '\n');
if (HEAD) console.log(chalk.bgBlue(chalk.whiteBright(HEAD)));
if (TREE) console.log(chalk.blueBright(TREE), '\n');

/**
 * Parse command line arguments. Use try {...} catch {...} and
 * program.exitOverride() to prevent nonzero exit.
 */
try {
  program.exitOverride();
  program.parse(process.argv);
} catch (e) {
  /**
   * Don't bother throwing any errors if there are no args provided.
   */
}

/**
 * @license MIT
 *
 * @file
 * Specify the exports for this project's CLI.
 */
import program from 'commander';
import aft from 'ascii-file-tree';
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
    .description('Create a new gdev workspace.')
    .action(commands.create);

program
    .command('watch')
    .description('Start developing and build when changes are made.')
    .action(commands.watch);

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
  ? aft.generate({ globs: ['lib/**/*.js'] })
  : ''
);

const HEAD = (
  commands.checkInsideProject()
  ? ` ${PROJECT_NAME} `
  : ''
);

console.log('\n', chalk.grey('--- 𝓰𝓭𝓮𝓿 ---'), '\n');
if (HEAD) console.log(chalk.bgBlue(chalk.whiteBright(HEAD)));
if (TREE) console.log(chalk.blueBright(TREE), '\n');

/**
 * Display the location of the dev and production files.
 */
commands.displayProjectInfo();

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

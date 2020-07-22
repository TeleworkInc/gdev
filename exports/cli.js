#!/usr/bin/env node
import * as commands from '../lib/commands.js';

import { basename } from 'path';
import { version as PACKAGE_VERSION } from '../package.json';

import program from 'commander';
import aft from 'ascii-file-tree';
import chalk from 'chalk';

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
 * Display some introductory text containing the version info and directory
 * structure as a tree.
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


if (PACKAGE_VERSION) {
  console.log('\n', chalk.grey(`gdev v${PACKAGE_VERSION}`), '\n');
}

if (HEAD) console.log(chalk.bgBlue(chalk.whiteBright(HEAD)));
if (TREE) console.log(chalk.blueBright(TREE), '\n');


/**
 * Display the location of the dev and production files.
 */
commands.displayProjectInfo();


/**
 * Parse command line arguments.
 */
program.parse(process.argv);

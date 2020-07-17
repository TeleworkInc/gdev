#!/usr/bin/env node

import { basename } from 'path';

import packageJson from '../package.js';
import program from 'commander';
import aft from 'ascii-file-tree';
import chalk from 'chalk';

/**
 * Imports from /commands.
 */
import * as commands from './commands.js';


/**
 * Define commands and assign actions to them.
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


const CWD = process.cwd();
const PROJECT_NAME = basename(CWD);
const VERSION_INFO = packageJson.version;


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

if (VERSION_INFO) {
  console.log('\n', chalk.grey(`gdev v${VERSION_INFO}`), '\n');
}

if (HEAD) {
  console.log(chalk.bgBlue(chalk.whiteBright(HEAD)));
}

if (TREE) {
  console.log(chalk.blueBright(TREE), '\n');
}


/**
 * Display the location of the dev and production files.
 */
commands.displayBuildInfo();


/**
 * Parse process arguments.
 */
program.parse(process.argv);

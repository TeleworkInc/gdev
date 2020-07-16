#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import { basename, resolve } from 'path';
import aft from 'ascii-file-tree';
import chalk from 'chalk';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


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


/**
 * Get the version of this npm package.
 *
 * @return {string} versionString
 */
function getVersion() {
  return JSON.parse(
      fs.readFileSync(
          resolve(__dirname, '../package.json'),
          'utf-8',
      ),
  ).version;
}


const CWD = process.cwd();
const PROJECT_NAME = basename(CWD);
const VERSION_INFO = getVersion();


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

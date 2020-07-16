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
 * Imports from index.js.
 */
import {
  compile,
  create,
  develop,
  displayBuildInfo,
  initialize,
  insideProject,
} from '../commands/index.js';


/**
 * Define commands and assign actions to them.
 */

program
    .command('create <project>')
    .description('Create a new gproject workspace.')
    .action(create);

program
    .command('develop')
    .description('Start the workspace in development mode.')
    .action(develop);

program
    .command('compile')
    .description('Compile this workspace and output in [dist].')
    .action(compile);

program
    .command('init [directory]')
    .description('Initialize a workspace inside an existing directory.')
    .action(initialize);


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
  insideProject()
  ? aft.generate({ globs: ['lib/**/*.js'] })
  : ''
);

const HEAD = (
  insideProject()
  ? ` ${PROJECT_NAME} `
  : ''
);

if (VERSION_INFO) {
  console.log('\n', chalk.grey(`GProject v${VERSION_INFO}`), '\n');
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
displayBuildInfo();


/**
 * Parse process arguments.
 */
program.parse(process.argv);

#!/usr/bin/env node
const { program } = require('commander');
const path = require('path');
const aft = require('ascii-file-tree');

const chalk = require('chalk');

/**
 * Imports from index.js.
 */
const {
  insideProject,
  displayBuildInfo,
  create,
  compile,
  develop,
  initialize,
} = require('../commands');

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

const CWD = process.cwd();
const PROJECT_NAME = path.basename(CWD);
const VERSION_INFO = require('../package.json').version;

const TREE = insideProject()
  ? aft.generate({
    globs: ['lib/**/*.js'],
  })
  : '';

const HEAD = insideProject()
  ? ` ${PROJECT_NAME} `
  : '';

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

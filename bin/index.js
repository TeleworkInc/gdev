#!/usr/bin/env node
const { program } = require('commander');
const path = require('path');
const aft = require('ascii-file-tree');

const chalk = require('chalk');
const figlet = require('figlet');

/**
 * Imports from index.js.
 */
const {
    insideProject,
    displayBuildInfo,
    create,
    compile,
    develop,
} = require('..');

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
    .description('Compile this workspace and output in [.build].')
    .action(compile);

const CWD = process.cwd();
const PROJECT_NAME = path.basename(CWD);
const VERSION_INFO = require('../package.json').version;

const TREE = insideProject()
    ? aft.generate({
        globs: ['src/**/*.js']
    })
    : '';

const HEAD = insideProject()
    ? ` ${PROJECT_NAME} `
    : '';

if (VERSION_INFO)
    console.log('\n', chalk.white(`GProject v${VERSION_INFO}`), '\n');

if (HEAD)
    console.log(chalk.bgBlue(HEAD));

if (TREE)
    console.log(chalk.blueBright(TREE), '\n');

/**
 * Display the location of the dev and production files.
 */
displayBuildInfo();

/**
 * Parse process arguments.
 */
program.parse(process.argv);
void 0;
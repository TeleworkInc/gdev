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

const LINE = `\n${'-'.repeat(32)}\n`;
const TREE = insideProject()
    ? aft.generate({
        globs: ['src/**/*.js']
    })
    : '';

const CWD = process.cwd();
const PROJECT_NAME = path.basename(CWD);

console.log('\n')
console.log(chalk.blueBright(
    `${PROJECT_NAME}    |    Source Tree`,
    LINE,
    TREE,
    '\n',
));

/**
 * Parse process arguments.
 */
program.parse(process.argv);
#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');

/**
 * Imports from index.js.
 */
const {
    create,
    debug,
    dev,
    compile
} = require('..');

/**
 * Obligatory h4x0r l33t intro.
 */
console.log(chalk.blueBright(
    figlet.textSync('gproject'), '\n'
));

/**
 * Define commands and assign actions to them.
 */
program
    .command('create <project>')
    .description('Create a new gproject workspace.')
    .action(create);

program
    .command('debug [directory]')
    .description('Start the workspace in debug mode.')
    .action(debug);

program
    .command('dev [directory]')
    .description('Start the workspace in development mode.')
    .action(dev);

program
    .command('compile [directory]')
    .option('-d, --dev')
    .description('Compile the distribution file for this workspace.')
    .action(compile);

/**
 * Parse process arguments.
 */
program.parse(process.argv);
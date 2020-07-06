#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');

/**
 * Imports from index.js.
 */
const {
    create,
    dev,
    dist
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
    .command('create')
    .description('Create a new gproject workspace.')
    .action(create);

program
    .command('dev')
    .description('Start the workspace in development mode.')
    .action(dev);

program
    .command('dist')
    .description('Build the distribution file for this workspace.')
    .action(dist);

/**
 * Parse process arguments.
 */
program.parse(process.argv);
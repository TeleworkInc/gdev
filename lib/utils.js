/**
 * @license MIT
 */
/**
 * @fileoverview
 * Logging and other utilities.
 */

import chalk from 'chalk';

/**
 * Log messages in blue.
 *
 * @param {...string} msgs
 * The messages to log
 *
 * @return {void}
 */
export const blue = (...msgs) => chalk.blueBright(...msgs);

/**
 * Log a success message.
 *
 * @param  {...string} msgs
 * The messages to log.
 *
 * @return {void}
 */
export const success = (...msgs) => console.log(
    chalk.bgCyan(
        chalk.whiteBright(' SUCCESS '),
    ),
    ...msgs,
    '\n',
);

/**
 * Log an error message.
 *
 * @param  {...string} msgs
 * The messages to log.
 *
 * @return {void}
 */
export const error = (...msgs) => console.log(
    chalk.bgRed(chalk.whiteBright(' ERROR ')),
    ...msgs,
    '\n',
);

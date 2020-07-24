/**
 * @license MIT
 * @file
 * Runs preprocessed dev files through Google's Closure Compiler.
 */

import glob from 'glob';
import gulp from 'gulp';
import Closure from 'google-closure-compiler';
import fs from 'fs';
import path from 'path';

const Compiler = Closure.compiler;

/**
 * Compile a preprocessed script located at dist/{name}.
 *
 * @param {?object} options
 * Options to pass to the compiler.
 *
 * @return {Promise}
 * A Promise which will resolve when the Closure Compiler is finished.
 */
export const startCompileTask = (options = {}) => {
  const instance = new Compiler(options);
  return new Promise((resolve, reject) => instance.run(
      (exitCode, stdOut, stdErr) => {
        return exitCode == 0
          ? resolve(stdOut)
          : reject(stdErr);
      },
  ));
};

/**
 * Compile a CommonJS script in the `dev/` directory into the `dist/` directory.
 * Used for `executable` builds since they do not have any exports.
 *
 * @param {string} name
 * The name of the preprocessed CJS script to compile, located at
 * dist/{name}.cjs.
 *
 * @param {object?} options
 * Additional flags to pass the compiler.
 *
 * @return {Promise}
 * A Promise which will resolve when the Closure Compiler is finished.
 */
export const compileCJS = (name, options = {}) => startCompileTask({
  // I/O setup.
  js: `dev/${name}.cjs`,
  js_output_file: `dist/${name}.min.cjs`,

  // SIMPLE compilation for CJS to avoid renaming.
  compilation_level: 'SIMPLE',

  // Overrides.
  ...options,
});

/**
 * Prevent transpilation and renaming.
 */
const NO_RENAMING = {
  compilation_level: 'WHITESPACE_ONLY',
  language_in: 'ES_NEXT',
  language_out: 'ES_NEXT',
};

/**
 * Process ES6/CJS modules.
 */
const PROCESS_MODULES = {
  module_resolution: 'NODE',
  process_common_js_modules: true,
};

/**
 * Compile an ES6 module in the dist/ directory.
 *
 * @param {string} name
 * The name of the preprocessed ESM to compile, located at dist/{name}.mjs.
 *
 * @param {object?} options
 * Additional flags to pass the compiler.
 *
 * @return {Promise}
 * A Promise which will resolve when the Closure Compiler is finished.
 */
export const compileESM = async (name, options = {}) => {
  await startCompileTask({
    // I/O setup.
    js: `dev/${name}.mjs`,
    js_output_file: `dist/${name}.min.mjs`,

    // Don't rename vars, use NODE module_resolution.
    ...NO_RENAMING,
    ...PROCESS_MODULES,

    // Overrides.
    ...options,
  });
};

/**
 * Append a shebang to a file and set chmod 755.
 *
 * @param {string} file
 * The file to make executable.
 */
const markExecutable = async (file) => {
  const fileHandle = await fs.promises.open(file, 'r+');
  const currentCode = await fs.promises.readFile(fileHandle, 'utf-8');

  if (currentCode[0] !== '#') {
    await fs.promises.writeFile(
        file,
        `#!/usr/bin/env node\n${currentCode}`,
        'utf-8',
    );
  }

  await fs.promises.chmod(file, '755');
};

/**
 * Mark all CLI builds in dist/ and dev/ as executable.
 */
export const markCLIsExecutable = async () => {
  const files = glob.sync('./**/{dev,dist}/cli.**');
  await Promise.all(files.map(
      async (file) => await markExecutable(file),
  ));
};

/**
 * Compile a script for `node-async` target.
 *
 * @return {Promise}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
export const nodeCompile = async () => await compileCJS('node');

/**
 * Compile the exports/universal.js script.
 *
 * @return {Promise}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
export const universalCompile = async () => {
  await compileCJS('universal', {
    // Compiling dev/universal.cjs -> dist/universal.min.cjs
    js: 'dev/universal.cjs',
    js_output_file: 'dist/universal.min.cjs',

    // SIMPLE compilation and language_in == language_out to prevent name
    // mangling while getting maximum compression.
    compilation_level: 'SIMPLE',
    language_in: 'ES_NEXT',
    language_out: 'ES_NEXT',
  });
};

/**
 * Compile the exports/cli.js script.
 *
 * @return {Promise}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
export const cliCompile = async () => await compileCJS('cli');

/**
 * Compile the executable. This will reduce all of the codebase to just its side
 * effects as best as possible.
 *
 * @return {Promise}
 * The EventEmitter that will fire when Closure Compiler is done.
 */
export const executableCompile = async () => {
  await compileCJS('executable', {
    // Compiling dev/universal -> dist/exe
    ...PROCESS_MODULES,
    entry_point: 'dev/universal.mjs',
    js_output_file: 'dist/exe.js',

    // Maximum tree-shaking and dead code elimination.
    compilation_level: 'ADVANCED',
    dependency_mode: 'PRUNE',

    // generate exports if they exist, must include base.js
    generate_exports: true,
    js: [
      'node_modules/google-closure-library/closure/goog/base.js',
      'dev/universal.mjs',
    ],
  });
};

/**
 * Run generated ESM bundles through the compiler.
 *
 * @return {?}
 * The stream for the task.
 */
export const minifyModules = async () => {
  const files = glob.sync('dev/**/*.mjs', { base: './' });
  await Promise.all(
      files.map(
          async (file) => await compileESM(
              path.basename(file, '.mjs'),
              { jscomp_off: '*' },
          ),
      ),
  );
};

export default gulp.series(
    gulp.parallel(
        nodeCompile,
        cliCompile,
        universalCompile,
        executableCompile,
    ),
    minifyModules,
    markCLIsExecutable,
);

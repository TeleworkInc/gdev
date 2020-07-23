import gulp from 'gulp';
import tap from 'gulp-tap';
import Closure from 'google-closure-compiler';
import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';

const Compiler = Closure.compiler;

/**
 * Compile a preprocessed script located at dist/{name}.
 *
 * @param {?object} options
 * Options to pass to the compiler.
 *
 * @return {EventEmitter}
 * The event which will emit when the Closure Compiler is finished.
 */
export const startCompileTask = (options = {}) => {
  const instance = new Compiler(options);
  const emitter = new EventEmitter();

  instance.run((exitCode, stdOut, stdErr) => {
    if (exitCode !== 0) console.log(exitCode, stdOut, stdErr);
    emitter.emit('finish');
  });

  return emitter;
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
 * @return {EventEmitter}
 * The event which will emit when the Closure Compiler is finished.
 */
export const compileCJS = (name, options = {}) => startCompileTask({
  /**
   * I/O setup.
   */
  js: `dev/${name}.cjs`,
  js_output_file: `dist/${name}.min.cjs`,
  /**
   * SIMPLE compilation for CJS to avoid renaming.
   */
  compilation_level: 'SIMPLE',
  ...options,
});

/**
 * Compile an ES6 module in the dist/ directory.
 *
 * @param {string} name
 * The name of the preprocessed ESM to compile, located at dist/{name}.mjs.
 *
 * @param {object?} options
 * Additional flags to pass the compiler.
 *
 * @return {EventEmitter}
 * The event which will emit when the Closure Compiler is finished.
 */
export const compileESM = (name, options = {}) => {
  console.log('Compiling ESM for', name);
  return startCompileTask({
    /**
     * I/O setup.
     */
    js: `dev/${name}.mjs`,
    js_output_file: `dist/${name}.min.mjs`,
    /**
     * Enable import/export/require keywords.
     */
    module_resolution: 'NODE',
    process_common_js_modules: true,
    /**
     * Prevent transpilation and renaming.
     */
    compilation_level: 'WHITESPACE_ONLY',
    language_in: 'ES_NEXT',
    language_out: 'ES_NEXT',
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
  const currentCode = fs.readFileSync(file);
  if (currentCode[0] !== '#') {
    fs.writeFileSync(file, `#!/usr/bin/env node\n${currentCode}`);
    fs.chmodSync(file, '755');
  }
};

/**
 * Mark all CLI builds in dist/ and dev/ as executable.
 *
 * @return {?}
 * The stream for this task.
 */
export const markCLIsExecutable = () => {
  return gulp
      .src([
        'dev/cli.*',
        'dev/cli.*',
        // '!(*.min.mjs)',
      ], { base: './' })
      .pipe(tap(
          async (file, t) => await markExecutable(file.path),
      ));
};

/**
 * Compile a script for `node-async` target.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
export const nodeCompile = () => compileCJS('node');

/**
 * Compile the exports/universal.js script.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
export const universalCompile = () => {
  return compileCJS('universal', {
    js: 'dev/universal.mjs',
    entry_point: 'dev/universal.mjs',
    compilation_level: 'SIMPLE',
    assume_function_wrapper: true,
    process_common_js_modules: true,
    module_resolution: 'NODE',
  });
};

/**
 * Compile the exports/cli.js script.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
export const cliCompile = () => compileCJS('cli');

/**
 * Compile the rolled-up exe ESM to CJS.
 *
 * @return {EventEmitter}
 * The EventEmitter that will fire when Closure Compiler is done.
 */
export const executableCompile = () => {
  return compileCJS('executable', {
    js: 'dev/universal.mjs',
    entry_point: 'dev/universal.mjs',
    js_output_file: 'dist/exe.js',
    compilation_level: 'ADVANCED',
    isolation_mode: 'iife',
    dependency_mode: 'PRUNE',
    assume_function_wrapper: true,
    process_common_js_modules: true,
    module_resolution: 'NODE',
  });
};

export const minifyModules = () => {
  return gulp
      .src([
        'dev/**/*.mjs',
        '!**/*.min.mjs',
        // '!(*.min.mjs)',
      ], { base: './' })
      .pipe(tap(
          (file, t) => compileESM(path.basename(file.path, '.mjs')),
      ));
};

export default gulp.series(
    gulp.parallel(
        cliCompile,
        universalCompile,
        nodeCompile,
        executableCompile,
    ),
    minifyModules,
    markCLIsExecutable,
);

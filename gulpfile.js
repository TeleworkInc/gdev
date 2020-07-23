import gulp from 'gulp';
import rename from 'gulp-rename';
import Closure from 'google-closure-compiler';
import fs from 'fs';
import EventEmitter from 'events';

const Compiler = Closure.compiler;
const closureGulp = Closure.gulp();

/**
 * Compile a preprocessed script located at dist/{name}.
 *
 * @param {?object} options
 * Options to pass to the compiler.
 *
 * @return {EventEmitter}
 * The event which will emit when the Closure Compiler is finished.
 */
const startCompileTask = (options = {}) => {
  const instance = new Compiler(options);
  const emitter = new EventEmitter();

  instance.run((exitCode, stdOut, stdErr) => {
    if (exitCode !== 0) console.log(exitCode, stdOut, stdErr);
    emitter.emit('finish');
  });

  return emitter;
};

/**
 * Compile a CommonJS script in the dist/ directory.
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
const compileCJS = (name, options = {}) => startCompileTask({
  js: `dist/${name}.cjs`,
  js_output_file: `dist/${name}.min.cjs`,
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
const compileESM = (name, options = {}) => startCompileTask({
  js: `dist/${name}.mjs`,
  js_output_file: `dist/${name}.min.mjs`,
  compilation_level: 'WHITESPACE_ONLY',
  ...options,
});

const markExecutable = async (file) => {
  const currentCode = fs.readFileSync(file);
  if (currentCode[0] !== '#') {
    fs.writeFileSync(file, `#!/usr/bin/env node\n${currentCode}`);
    fs.chmodSync(file, '755');
  }
};

/**
 * Make CLI files executable and include shebang.
 */
const markCLIsExecutable = async () => {
  markExecutable('dist/cli.mjs');
  markExecutable('dist/cli.cjs');
  markExecutable('dist/cli.min.cjs');
};

/**
 * Compile a script for `node-async` target.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
const nodeCompile = () => compileCJS('node');

/**
 * Compile the exports/universal.js script.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
const universalCompile = () => {
  return compileCJS('universal', {
    js: 'dist/universal.mjs',
    entry_point: 'dist/universal.mjs',
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
const cliCompile = () => compileCJS('cli');

/**
 * Compile the rolled-up exe ESM to CJS.
 *
 * @return {EventEmitter}
 * The EventEmitter that will fire when Closure Compiler is done.
 */
const executableCompile = () => {
  return compileCJS('executable', {
    js: 'dist/universal.mjs',
    entry_point: 'dist/universal.mjs',
    js_output_file: 'dist/exe.cjs',
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
      .src('dist/**/*.mjs', { base: './' })
      .pipe(closureGulp({
        compilation_level: 'WHITESPACE_ONLY',
        module_resolution: 'NODE',
        process_common_js_modules: true,
        language_in: 'ES_NEXT',
        language_out: 'ES_NEXT',
      }))
      .pipe(rename({ extname: '.min.mjs' }))
      .pipe(gulp.dest('./dist'));
};

// const minifyModules = () => {
//   return gulp
//       .src('dist/**/*.js', { base: './' })
//       .pipe(closureGulp({
//         compilation_level: 'WHITESPACE_ONLY',
//         module_resolution: 'NODE',
//         process_common_js_modules: true,
//         language_in: 'ES_NEXT',
//         language_out: 'ES_NEXT',
//         js_output_file: 'output.min.js',
//       }))
//       .pipe(rename({ extname: '.min.mjs' }))
//       .pipe(gulp.dest('./dist'));
// };

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

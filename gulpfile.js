import gulp from 'gulp';
import Closure from 'google-closure-compiler';
import fs from 'fs';
import EventEmitter from 'events';

const Compiler = Closure.compiler;

/**
 * @param {string} name
 * The name of the preprocessed script to compile.
 *
 * @param {?object} options
 * Options to pass to the compiler.
 *
 * @return {void}
 */
const doCompile = (name, options = {}) => {
  const instance = new Compiler({
    js: `dist/${name}.cjs`,
    js_output_file: `dist/${name}.min.cjs`,
    compilation_level: 'SIMPLE',
    ...options,
  });

  const emitter = new EventEmitter();

  instance.run((exitCode, stdOut, stdErr) => {
    console.log(exitCode, stdOut, stdErr);
    emitter.emit('finish');
  });

  return emitter;
};

/**
 * Compile a script for `node-async` target.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
const nodeCompile = () => doCompile('node');

/**
 * Compile the exports/cli.js script.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
const cliCompile = () => doCompile('cli');

/**
 * Make CLI files executable and include shebang.
 */
const cliExecutable = async () => {
  const currentCode = fs.readFileSync('dist/cli.min.cjs');
  if (currentCode[0] !== '#') {
    fs.writeFileSync('dist/cli.min.cjs', `#!/usr/bin/env node\n${currentCode}`);
  }
};

/**
 * Compile the exports/universal.js script.
 *
 * @return {EventEmitter}
 * An EventEmitter that will fire when Closure Compiler is done.
 */
const universalCompile = () => {
  return doCompile('universal', {
    entry_point: 'dist/universal.cjs',
    compilation_level: 'ADVANCED',
    isolation_mode: 'iife',
    dependency_mode: 'PRUNE',
    assume_function_wrapper: true,
    process_common_js_modules: true,
    module_resolution: 'NODE',
  });
};

export default gulp.series(
    gulp.parallel(
        cliCompile,
        universalCompile,
        nodeCompile,
    ),
    cliExecutable,
);

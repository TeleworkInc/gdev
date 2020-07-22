import gulp from 'gulp';
import Closure from 'google-closure-compiler';

const Compiler = Closure.compiler;

/**
 * Compile the exports/cli.js script.
 */
const cliCompile = async () => {
  const instance = new Compiler({
    js: 'dist/cli.cjs',
    js_output_file: 'dist/cli.min.cjs',
    compilation_level: 'SIMPLE',
  });

  instance.run((exitCode, stdOut, stdErr) => {
    console.log(exitCode, stdOut, stdErr);
  });
};

const universalCompile = async () => {
  const instance = new Compiler({
    js: 'dist/universal.cjs',
    js_output_file: 'dist/universal.min.cjs',
    compilation_level: 'ADVANCED',
    isolation_mode: 'iife',
    assume_function_wrapper: true,
    process_common_js_modules: true,
    module_resolution: 'NODE',
  });

  instance.run((exitCode, stdOut, stdErr) => {
    console.log(exitCode, stdOut, stdErr);
  });
};

export default gulp.parallel(
    cliCompile,
    universalCompile,
);

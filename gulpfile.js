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
  });

  instance.run((exitCode, stdOut, stdErr) => {
    console.log(exitCode, stdOut, stdErr);
  });
};

export default gulp.parallel(
    cliCompile,
);

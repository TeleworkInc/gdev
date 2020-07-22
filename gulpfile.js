import gulp from 'gulp';
import Closure from 'google-closure-compiler';

const Compiler = Closure.compiler;

/**
 * @param {string} name
 * The name of the preprocessed script to compile.
 *
 * @param {?object} options
 * Options to pass to the compiler.
 */
const doCompile = async (name, options = {}) => {
  const instance = new Compiler({
    js: `dist/${name}.cjs`,
    js_output_file: `dist/${name}.min.cjs`,
    compilation_level: 'SIMPLE',
    ...options,
  });

  instance.run((exitCode, stdOut, stdErr) => {
    console.log(exitCode, stdOut, stdErr);
  });
};

/**
 * Compile a script for `node-async` target.
 */
const nodeCompile = async () => {
  await doCompile('node');
};


/**
 * Compile the exports/cli.js script.
 */
const cliCompile = async () => {
  await doCompile('cli');
};

/**
 * Compile the exports/universal.js script.
 */
const universalCompile = async () => {
  await doCompile('universal', {
    entry_point: 'dist/universal.cjs',
    compilation_level: 'ADVANCED',
    isolation_mode: 'iife',
    dependency_mode: 'PRUNE',
    assume_function_wrapper: true,
    process_common_js_modules: true,
    module_resolution: 'NODE',
  });
};

const RESERVED_EXPORTS = [
  'cli',
  'node',
  'universal',
];

const compileReservedExports = async () => {
  for (const reservedExport of RESERVED_EXPORTS) {
    switch (reservedExport) {
      case 'cli':
        await cliCompile();
        break;
      case 'universal':
        await universalCompile();
        break;
      case 'node':
        await nodeCompile();
        break;
    }
  }
};

export default gulp.parallel(
    compileReservedExports,
);

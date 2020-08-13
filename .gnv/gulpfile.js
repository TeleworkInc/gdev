/**
 * @license MIT
 */
/**
 * @fileoverview
 * Runs preprocessed dev files through Google's Closure Compiler.
 */

import glob from 'glob';
import gulp from 'gulp';
import closure from 'google-closure-compiler';
import fs from 'fs';

/**
 * Move process to project root.
 */
process.chdir('..');

/**
 * Use Closure Compiler for various levels of compression and executable output.
 */
const Compiler = closure.compiler;

/**
 * Prevent transpilation and renaming.
 */
const NO_RENAMING = {
  compilation_level: 'WHITESPACE_ONLY',
  language_in: 'ES_NEXT',
  language_out: 'NO_TRANSPILE',
};

/**
 * Process ES6/CJS modules.
 */
const PROCESS_MODULES = {
  module_resolution: 'NODE',
  process_common_js_modules: true,
};


/**
 * Compile a preprocessed script located at dist/{name}.
 *
 * @param {?object} options
 * Options to pass to the compiler.
 *
 * @return {Promise}
 * A Promise which will resolve when the Closure Compiler is finished.
 */
export const callCompiler = (options = {}) => {
  const instance = new Compiler(options);
  return new Promise((resolve, reject) => instance.run(
      (exitCode, stdOut, stdErr) => {
        return exitCode == 0 ?
          resolve(stdOut) :
          reject(stdErr);
      },
  ));
};


/**
 * Compile a CommonJS script in the `dev/` directory into the `dist/` directory.
 * Used for `executable` builds since they do not have any exports.
 *
 * @param {string} file
 * The location of the preprocessed CJS bundle to compile.
 *
 * @param {object?} options
 * Additional flags to pass the compiler.
 */
export const compileCJS = async (file, options = {}) => {
  await callCompiler({
    // I/O setup.
    js: file,
    js_output_file: file.replace('dev', 'dist'),

    // SIMPLE compilation for CJS to avoid renaming.
    compilation_level: 'SIMPLE',

    // Overrides.
    ...options,
  });
};


/**
 * Compile an ES6 module in the dist/ directory.
 *
 * @param {string} file
 * The location of the preprocessed MJS bundle to compile.
 *
 * @param {object?} options
 * Additional flags to pass the compiler.
 */
export const compileESM = async (file, options = {}) => {
  await callCompiler({
    // I/O setup.
    js: file,
    js_output_file: file.replace('dev', 'dist'),

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
  await Promise.all(
      files.map(async (file) => await markExecutable(file)),
  );
};


/**
 * Compile the exports/cli.js script.
 */
export const buildCliTarget = async () => {
  await compileCJS('dev/cli.cjs');
};


/**
 * Compile the executable. This will reduce all of the codebase to just its side
 * effects as best as possible.
 */
export const buildExecutableTarget = async () => {
  await callCompiler({
    // Compiling dev/universal -> dist/exe
    ...PROCESS_MODULES,
    entry_point: 'dev/universal.mjs',
    js_output_file: 'dist/exe.js',

    // Maximum tree-shaking and dead code elimination.
    compilation_level: 'ADVANCED',
    dependency_mode: 'PRUNE',

    // Do not generate exports for an executable
    generate_exports: false,
    js: [
      'node_modules/google-closure-library/closure/goog/base.js',
      'dev/universal.mjs',
    ],
  });
};


/**
 * Compile a script for `node-async` target.
 */
export const buildNodeTarget = async () => {
  await compileCJS('dev/node.cjs');
};


/**
 * Compile non-default targets, which exist at the top level of the dev/
 * directory.
 */
const buildCustomTargets = async () => {
  await Promise.all(
      glob.sync('dev/*.cjs').map(async (file) => await compileCJS(file)),
  );
};


/**
 * Compile dev/universal.js -> dist/universal.cjs
 */
export const buildUniversalTarget = async () => {
  await compileCJS('dev/universal.cjs', {
    compilation_level: 'SIMPLE',
    language_in: 'ES_NEXT',
    language_out: 'ECMASCRIPT5_STRICT',
    use_types_for_optimization: true,
    process_common_js_modules: false,
  });
};


/**
 * Run ESM bundles in `dev/` through Closure Compiler to minify them, and put
 * the output in `dist/`.
 */
export const buildEsOutputs = async () => {
  const files = glob.sync('dev/*.mjs');
  await Promise.all(
      files.map(
          async (file) =>
            await compileESM(
                file,
                { jscomp_off: '*' },
            ),
      ),
  );
};


/**
 * Export default targets `node`, `CLI`, and `universal` from `dev/` -> `dist/`.
 */
export const buildDefaultTargets = gulp.series(
    /**
     * Can build `node` and `cli` targets simultaneously, since they do not
     * depend on each other.
     */
    gulp.parallel(
        buildNodeTarget,
        buildCliTarget,
    ),
    /**
     * Build `universal` and `exe` targets sequentially, since `exe` is built
     * *from* the `dist/universal` bundle.
     */
    gulp.series(
        /** Build `dist/universal.cjs`. */
        buildUniversalTarget,
        /** Build `dist/exe.js` from `dist/universal.cjs`. */
        buildExecutableTarget,
    ),
);


/**
 * Build files from `dev/` -> `dist/`, and handle post-processing like CLI
 * `chmod +x`.
 */
export default gulp.series(
    /**
     * All `dev/` -> `dist/` builds can run simultaneously, since all the dev
     * files necessary will be ready by this time.
     */
    gulp.parallel(
        /** Build `dev/*.mjs` -> `dist/*.mjs`. */
        buildEsOutputs,
        /** Build CLI, universal, and Node targets. */
        buildDefaultTargets,
        /** Build all non-default export targets. */
        buildCustomTargets,
    ),
    /** Make sure CLIs are chmod 755. */
    markCLIsExecutable,
);

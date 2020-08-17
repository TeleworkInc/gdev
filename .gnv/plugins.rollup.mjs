import shebang from 'rollup-plugin-preserve-shebang';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import disablePackages from 'rollup-plugin-disable-packages';
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';

/**
 * Plugins to use for rolling up Node deps.
 *
 * Includes a CL pass before CJS / Node resolution *plus* another pass after,
 * just to ensure that we are never crawling dead dependencies. Big concern as
 * the dependency tree gets large (which is common with npm packages).
 */
export const plugins = [
  shebang(),
  closureCompiler({
    compilation_level: 'SIMPLE',
    language_in: 'ES_NEXT',
    language_out: 'NO_TRANSPILE',
  }),
  commonjs({
    transformMixedEsModules: true,
  }),
  json(),
  disablePackages('fsevents'),
  nodeResolve({
    preferBuiltins: true,
  }),
];

import shebang from 'rollup-plugin-preserve-shebang';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import disablePackages from 'rollup-plugin-disable-packages';


export const plugins = [
  shebang(),
  commonjs({
    transformMixedEsModules: true,
  }),
  json(),
  disablePackages('fsevents'),
  nodeResolve({
    preferBuiltins: true,
  }),
];

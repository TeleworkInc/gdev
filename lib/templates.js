/**
 * @license MIT
 */
/**
 * @fileoverview
 * Specify the exports for this project's CLI.
 */

export const INTRO_TEMPLATE = `
/**
 * The Production flag will be overwritten to \`true\` when the project is
 * compiled in release mode.
 *
 * @define {boolean}
 */
export const PRODUCTION = goog.define('PRODUCTION', false);

console.log('Welcome to gnv!');
console.log('Production mode:', PRODUCTION);
`;

export const ESLINT_TEMPLATE = `
env:
  browser: true
  commonjs: true
  es2020: true
  node: true

extends:
  - google
  - plugin:jsdoc/recommended

parserOptions:
  ecmaVersion: 11
  sourceType: module

ignorePatterns:
  - "**/dist/**"

rules:
  require-jsdoc:
    - error
    - require:
        ClassDeclaration: true
        FunctionDeclaration: false
        MethodDefinition: false
        ArrowFunctionExpression: false
        FunctionExpression: false

  operator-linebreak:
    - error
    - before

  object-curly-spacing:
    - error
    - always

settings:
  jsdoc:
    mode: closure
`;

export const DEFAULT_FLAGS = [
  '-W="VERBOSE"',
  '--process_common_js_modules',
  '--module_resolution="NODE"',
  '--language_in="ES_NEXT"',
  '--language_out="NO_TRANSPILE"',
  '--jscomp_off="nonStandardJsDocs"',
  '--rewrite_polyfills',
  '--use_types_for_optimization',
];

export const TEST_STRING = 'HELLO WORLD!';

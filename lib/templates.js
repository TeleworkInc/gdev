/**
 * @license MIT
 */
/**
 * @file
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
  '--language_in="ECMASCRIPT_NEXT"',
  '--jscomp_off="nonStandardJsDocs"',
  '--rewrite_polyfills',
  '--use_types_for_optimization',
];

export const DEV_FLAGS = [
  '--define="PRODUCTION=false"',
  '-O="SIMPLE"',
];

export const RELEASE_FLAGS = [
  '--define="PRODUCTION=true"',
  '-O="ADVANCED"',
  '--language_out="ECMASCRIPT5_STRICT"',
  '--isolation_mode="IIFE"',
  '--assume_function_wrapper',
];

export const COMPILER_INCLUDES = [
  `--js="defs/**.js"`,
  `--js="lib/**.js"`,
];

export const TEST_STRING = 'HELLO WORLD!';

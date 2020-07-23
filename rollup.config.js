/**
 * Using rollup for ESM bundling, primarily for dev refresh on save.
 */

const exportESM = (name) => {
  return {
    input: `exports/${name}.js`,
    output: {
      file: `dev/${name}.mjs`,
      format: 'esm',
    },
  };
};

const exportCJS = (name) => {
  return {
    input: `exports/${name}.js`,
    output: {
      file: `dev/${name}.cjs`,
      format: 'cjs',
    },
  };
};

export default [
  /**
   * Export ES6 modules for cli, node, and universal targets, which may be
   * distributed.
   */
  exportESM('cli'),
  exportESM('node'),
  exportESM('universal'),
  /**
   * Prefer to bundle universal bundle with Rollup, since it will not depend on
   * NodeJS packages by definition, and Rollup is more reliable. Webpack will be
   * used to generate the CJS versions of the other ES6 modules.
   */
  exportCJS('universal'),
];

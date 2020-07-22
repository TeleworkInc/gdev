/**
 * Using rollup for ESM bundling, primarily for dev refresh on save.
 */

const exportModule = (name) => {
  return {
    input: `exports/${name}.js`,
    output: {
      file: `dist/${name}.mjs`,
      format: 'esm',
    },
  };
};

export default [
  exportModule('cli'),
  exportModule('node'),
  exportModule('universal'),
];

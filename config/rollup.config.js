import shebang from 'rollup-plugin-preserve-shebang';

export default [
  {
    input: 'config/exports.js',
    output: [
      {
        file: 'dist/exports.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/exports.mjs',
        format: 'esm',
      },
    ],
    plugins: [
      shebang(),
    ],
  },
  {
    input: 'lib/cli.js',
    output: [
      {
        file: 'dist/cli.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/cli.mjs',
        format: 'esm',
      },
    ],
    plugins: [
      shebang(),
    ],
  },
];

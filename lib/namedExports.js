/**
 * @license MIT
 */
/**
 * @fileoverview
 * Extract named exports from a module with a default export defined as a single
 * object assignment.
 */

import fs from 'fs';
import glob from 'glob';
import esprima from 'esprima';
import esquery from 'esquery';
import { assert } from 'console';
import { basename, extname } from 'path';

/**
 * Assumes all named exports are placed on the `default` object; otherwise,
 * exports only what is on the default.
 *
 * @param {string} name
 * The name of the export to extract named exports from.
 *
 * @return {string} exportStatements
 * The generated named export statements.
 */
export const getNamedExports = (name) => {
  /**
   * Read source from dev file and remove shebang.
   */
  const devSource = fs.readFileSync(
      `dev/${name}.mjs`,
      'utf-8',
  ).replace(/^#!.*/, '');

  /**
   * Read source from dev file and remove shebang.
   */
  const distSource = fs.readFileSync(
      `dist/${name}.mjs`,
      'utf-8',
  ).replace(/^#!.*/, '');

  const distAst = esprima.parseModule(distSource);
  const devAst = esprima.parseModule(devSource);

  const devDefaultExportAssignments = esquery.query(
      devAst,
      'ExportDefaultDeclaration ObjectExpression',
  );

  assert(
      devDefaultExportAssignments.length == 1,
      `There must be only one default export in dev/${name}.mjs.`,
  );

  const distDefaultExportDeclarations = esquery.query(
      distAst,
      'ExportDefaultDeclaration Identifier',
  );

  assert(
      distDefaultExportDeclarations.length == 1,
      `There must be only one default export in dist/${name}.mjs.`,
  );

  const moduleName = distDefaultExportDeclarations[0]?.name;

  const defaultExport = devDefaultExportAssignments[0];
  const namedExports = defaultExport.properties.map(
      (property) => property.key.name,
  );

  const getExportStatement = (exportName) => (
    `export const ${exportName} = ${moduleName}["${exportName}"];`
  );

  const exportStatements = (
    namedExports
        .map(getExportStatement)
        .join('\n')
  );

  return exportStatements;
};

/**
 * Add the named export statements to files in dist/*.mjs.
 */
export const addNamedExports = async () => {
  await glob.sync('dist/*.cjs').map(
      async (file) => {
        console.log('Adding exports to', file);
        const name = basename(file, extname(file));
        const namedExports = getNamedExports(name);
        await fs.promises.appendFile(
            file.replace('cjs', 'mjs'),
            '\n' + namedExports,
        );
      },
  );
};

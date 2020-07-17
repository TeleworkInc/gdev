/**
 * Make `package.json` available via `import` without
 * `--experimental_json_modules` flag.
 */

import fs from 'fs';
import path from 'path';

export const INSTALL_DIR = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '..',
);

export const PACKAGE_INFO = JSON.parse(
    fs.readFileSync(path.resolve(INSTALL_DIR, 'package.json')),
);

export const PACKAGE_VERSION = PACKAGE_INFO.version;

/**
 * Make `package.json` available via `import` without
 * `--experimental_json_modules` flag.
 */

import fs from 'fs';
export default JSON.parse(fs.readFileSync('package.json'));

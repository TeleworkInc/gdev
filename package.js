import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PACKAGE_INFO = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, 'package.json'),
));

export const PACKAGE_VERSION = PACKAGE_INFO.version;

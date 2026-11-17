// Build client.js by inlining src/theme.css into src/client.template.js.
// Usage: node src/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const css = readFileSync(join(here, 'theme.css'), 'utf8')
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const template = readFileSync(join(here, 'client.template.js'), 'utf8');
const out = template.replace('__THEME_CSS__', css);
writeFileSync(join(root, 'client.js'), out);
console.log('client.js written:', out.length, 'bytes');

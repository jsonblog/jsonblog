import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', 'src', 'styles');
const dist = join(here, '..', 'dist');
mkdirSync(dist, { recursive: true });
for (const f of readdirSync(src)) if (f.endsWith('.css')) copyFileSync(join(src, f), join(dist, f));
console.log('copied css → dist');

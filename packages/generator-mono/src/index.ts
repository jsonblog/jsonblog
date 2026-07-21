import { createGenerator } from '@jsonblog/core';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

/**
 * The mono theme renders ISO dates (YYYY-MM-DD, UTC) in a monospace face — a
 * deliberate technical aesthetic — so it overrides the base `formatDate` helper.
 */
const isoDate = (date: string): string => {
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * "Warm paper, serif prose, mono UI" theme. Engine logic lives in `@jsonblog/core`;
 * this package contributes the templates, the stylesheet, and the ISO date helper.
 */
export const generateBlog = createGenerator({
  templatesDir: path.join(__dirname, '../templates'),
  cssSourceFile: 'tailwind.css',
  generatorName: pkg.name,
  generatorVersion: pkg.version,
  helpers: { formatDate: isoDate },
});

export default generateBlog;

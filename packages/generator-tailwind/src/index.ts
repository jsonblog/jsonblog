import { createGenerator } from '@jsonblog/core';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

/**
 * The Tailwind theme for JsonBlog. All engine logic lives in `@jsonblog/core`;
 * this package contributes the templates and the compiled Tailwind stylesheet.
 */
export const generateBlog = createGenerator({
  templatesDir: path.join(__dirname, '../templates'),
  cssSourceFile: 'tailwind.css',
  generatorName: pkg.name,
  generatorVersion: pkg.version,
});

export default generateBlog;

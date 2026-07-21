import { createGenerator } from '@jsonblog/core';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

/**
 * The boilerplate theme — a minimal, dependency-light starting point for writing
 * your own JsonBlog generator. All engine logic lives in `@jsonblog/core`; this
 * package contributes the templates and a hand-written stylesheet (`main.css`).
 */
export const generateBlog = createGenerator({
  templatesDir: path.join(__dirname, '../templates'),
  cssSourceFile: 'main.css',
  generatorName: pkg.name,
  generatorVersion: pkg.version,
  // The boilerplate post template does not render its own <h1>, so the post's
  // markdown heading is kept (unlike the tailwind/mono themes).
  stripPostTitle: false,
});

export default generateBlog;

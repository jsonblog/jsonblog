import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.resolve(__dirname, '..', '..', 'dist', 'index.js');
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json'), 'utf8')
);

/** Run the built CLI in `cwd`. Returns {status, stdout, stderr}. */
const run = (args: string[], cwd: string) => {
  try {
    const stdout = execFileSync('node', [CLI, ...args], { cwd, encoding: 'utf8' });
    return { status: 0, stdout, stderr: '' };
  } catch (e: any) {
    return { status: e.status ?? 1, stdout: String(e.stdout ?? ''), stderr: String(e.stderr ?? '') };
  }
};

describe('jsonblog CLI', () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsonblog-cli-'));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('reports the real package version', () => {
    const { stdout } = run(['--version'], dir);
    expect(stdout.trim()).toBe(pkg.version);
  });

  it('init → validate → build produces a site with directory URLs', () => {
    expect(run(['init'], dir).status).toBe(0);
    expect(fs.existsSync(path.join(dir, 'blog.json'))).toBe(true);

    expect(run(['validate'], dir).status).toBe(0);

    const build = run(['build'], dir);
    expect(build.status).toBe(0);
    const index = fs.readFileSync(path.join(dir, 'build', 'index.html'), 'utf8');
    expect(index).toContain('href="/about/"'); // directory URL, not /about.html
    expect(index).not.toMatch(/href="\/[^"]+\.html"/); // no flat internal links
  });

  it('refuses to overwrite blog.json without --force', () => {
    run(['init'], dir);
    const again = run(['init'], dir);
    expect(again.status).toBe(1);
    expect(run(['init', '--force'], dir).status).toBe(0);
  });

  it('exits non-zero on an invalid config', () => {
    fs.writeFileSync(path.join(dir, 'blog.json'), JSON.stringify({ nope: true }));
    expect(run(['build'], dir).status).not.toBe(0);
    expect(run(['validate'], dir).status).not.toBe(0);
  });
});

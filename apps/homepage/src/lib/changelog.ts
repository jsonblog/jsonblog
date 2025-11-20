import fs from 'fs';
import path from 'path';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface PackageChangelog {
  packageName: string;
  displayName: string;
  entries: ChangelogEntry[];
}

const packages = [
  { name: '@jsonblog/cli', path: 'apps/cli' },
  { name: '@jsonblog/schema', path: 'packages/schema' },
  { name: '@jsonblog/generator-boilerplate', path: 'packages/generator-boilerplate' },
];

export function getChangelogs(): PackageChangelog[] {
  const monorepoRoot = path.join(process.cwd(), '..', '..');

  return packages.map((pkg) => {
    const changelogPath = path.join(monorepoRoot, pkg.path, 'CHANGELOG.md');

    if (!fs.existsSync(changelogPath)) {
      return {
        packageName: pkg.name,
        displayName: pkg.name.replace('@jsonblog/', ''),
        entries: [],
      };
    }

    const content = fs.readFileSync(changelogPath, 'utf-8');
    const entries = parseChangelog(content);

    return {
      packageName: pkg.name,
      displayName: pkg.name.replace('@jsonblog/', ''),
      entries,
    };
  });
}

function parseChangelog(content: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const lines = content.split('\n');

  let currentVersion: string | null = null;
  let currentDate: string | null = null;
  let currentChanges: string[] = [];

  for (const line of lines) {
    // Match version headers like "## 3.0.0" or "## [3.0.0]"
    const versionMatch = line.match(/^##\s+\[?(\d+\.\d+\.\d+)\]?(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?/);

    if (versionMatch) {
      // Save previous entry if exists
      if (currentVersion && currentChanges.length > 0) {
        entries.push({
          version: currentVersion,
          date: currentDate || 'Unknown',
          changes: currentChanges,
        });
      }

      // Start new entry
      currentVersion = versionMatch[1] || null;
      currentDate = versionMatch[2] || null;
      currentChanges = [];
    } else if (currentVersion && line.trim().startsWith('-')) {
      // Collect change items
      currentChanges.push(line.trim().substring(1).trim());
    }
  }

  // Save last entry
  if (currentVersion && currentChanges.length > 0) {
    entries.push({
      version: currentVersion,
      date: currentDate || 'Unknown',
      changes: currentChanges,
    });
  }

  return entries;
}

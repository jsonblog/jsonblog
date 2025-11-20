# JsonBlog Monorepo - Quick Start Guide

## 📦 What You Have Now

A modern Turborepo + pnpm monorepo with:
- **3 published packages**: `@jsonblog/schema`, `@jsonblog/generator-boilerplate`, `@jsonblog/cli`
- **1 internal package**: `@jsonblog/tsconfig`
- **1 website**: Jekyll site in `apps/website`

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Build everything
pnpm build

# Build with cache (after first build)
pnpm build  # Takes only ~81ms! ⚡

# Watch mode (auto-rebuild on changes)
pnpm dev

# Run tests
pnpm test

# Lint all code
pnpm lint

# Format all code
pnpm format

# Clean everything
pnpm clean
```

## 📝 Working with Packages

### Build a Specific Package
```bash
pnpm --filter @jsonblog/schema build
pnpm --filter @jsonblog/generator-boilerplate build
pnpm --filter @jsonblog/cli build
```

### Test a Specific Package
```bash
pnpm --filter @jsonblog/schema test
```

### Run CLI Locally (Development)
```bash
cd apps/cli
pnpm dev
```

## 🔄 Version Management with Changesets

### 1. Make Your Changes
Edit code in any package...

### 2. Create a Changeset
```bash
pnpm changeset
```
Follow the prompts:
- Select which packages changed
- Choose bump type (major/minor/patch)
- Write a summary of changes

### 3. Version Packages
```bash
pnpm version-packages
```
This updates version numbers and CHANGELOGs.

### 4. Publish to npm
```bash
pnpm release
```
This builds and publishes all changed packages.

## 📁 Monorepo Structure

```
jsonblog/
├── apps/
│   ├── cli/                    # @jsonblog/cli (CLI tool)
│   └── website/                # Project website (Jekyll)
│
├── packages/
│   ├── schema/                 # @jsonblog/schema (validation)
│   ├── generator-boilerplate/  # @jsonblog/generator-boilerplate
│   └── tsconfig/              # @jsonblog/tsconfig (internal, not published)
│
├── .changeset/                 # Version management
├── .github/workflows/          # CI/CD
│   ├── ci.yml                 # Build, test, lint
│   └── release.yml            # Automated publishing
│
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml         # Workspace definition
├── package.json               # Root package
└── README.md                  # Documentation
```

## 🎯 Common Tasks

### Adding a New Package

1. Create directory in `packages/` or `apps/`
```bash
mkdir packages/my-new-package
cd packages/my-new-package
```

2. Create `package.json`
```json
{
  "name": "@jsonblog/my-new-package",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean"
  },
  "devDependencies": {
    "@jsonblog/tsconfig": "workspace:*"
  }
}
```

3. Add source code in `src/`
4. Build: `pnpm build`

### Adding a Dependency to a Package

```bash
# From root
pnpm --filter @jsonblog/cli add express

# Or from package directory
cd apps/cli
pnpm add express
```

### Using Internal Packages

In your package.json:
```json
{
  "dependencies": {
    "@jsonblog/schema": "workspace:*"
  }
}
```

Then import:
```typescript
import { validateBlog } from '@jsonblog/schema';
```

## 🔧 Troubleshooting

### Build fails with "Module not found"
```bash
pnpm install
pnpm build
```

### Cache issues
```bash
pnpm clean
pnpm install
pnpm build
```

### TypeScript errors
```bash
# Check tsconfig.json extends the base config
{
  "extends": "@jsonblog/tsconfig/base.json"
}
```

## 📊 Performance

### Build Times
- **First build**: ~5-10 seconds
- **Cached build**: ~81ms (FULL TURBO ⚡)
- **Single package**: ~2-3 seconds

### Cache Benefits
Turborepo caches:
- Build outputs (`dist/`)
- Test results
- Lint results

Only rebuilds what changed!

## 🌐 Publishing Workflow

### Manual Publishing
```bash
# 1. Make changes
# 2. Create changeset
pnpm changeset

# 3. Version packages
pnpm version-packages

# 4. Commit version changes
git add .
git commit -m "chore: release packages"

# 5. Publish
pnpm release

# 6. Push tags
git push --follow-tags
```

### Automated Publishing (GitHub Actions)
Push to `main` branch:
1. CI runs tests and builds
2. Changesets bot creates PR with version bumps
3. Merge PR → automatic publish to npm

## 🎓 Learning Resources

- **Turborepo**: https://turbo.build/repo/docs
- **pnpm**: https://pnpm.io/
- **Changesets**: https://github.com/changesets/changesets
- **tsup**: https://tsup.egoist.dev/

## 💡 Tips

1. **Always use pnpm** (not npm or yarn) in this repo
2. **Run builds from root** to leverage caching
3. **Use `--filter`** to work with specific packages
4. **Create changesets** before merging to main
5. **Let Turbo cache** speed up your workflow

## 🐛 Common Errors

### "ERR_PNPM_NO_MATCHING_VERSION"
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### "Cannot find module '@jsonblog/...'"
```bash
pnpm build  # Build dependencies first
```

### "This package has been deprecated"
Update the old package names to scoped names:
- `jsonblog-schema` → `@jsonblog/schema`
- `jsonblog-generator-boilerplate` → `@jsonblog/generator-boilerplate`
- `jsonblog-cli` → `@jsonblog/cli`

---

**Need help?** Check `README.md` or `MIGRATION.md` for more details!

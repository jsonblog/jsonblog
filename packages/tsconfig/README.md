# @jsonblog/tsconfig

Shared TypeScript configurations for the JsonBlog monorepo.

## Configurations

- `base.json` - Base configuration for all packages
- `node20.json` - Configuration optimized for Node.js 20+

## Usage

In your package's `tsconfig.json`:

```json
{
  "extends": "@jsonblog/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

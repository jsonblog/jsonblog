# JsonBlog Monorepo

A modern monorepo for the JsonBlog ecosystem - a community-driven schema and tooling for portable blog content.

## 📦 Packages

### Apps

- **[@jsonblog/cli](./apps/cli)** - Command-line tool for generating static blogs from JsonBlog format
- **[website](./apps/website)** - Project homepage and documentation (Jekyll)

### Packages

- **[@jsonblog/schema](./packages/schema)** - Core schema definition and validation for JsonBlog
- **[@jsonblog/generator-boilerplate](./packages/generator-boilerplate)** - Reference implementation for static site generation
- **[@jsonblog/tsconfig](./packages/tsconfig)** - Shared TypeScript configurations (internal)

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

### Installation

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Watch mode for all packages
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🏗️ Monorepo Structure

This monorepo uses:

- **[Turborepo](https://turbo.build)** - Build system for fast, incremental builds with caching
- **[pnpm](https://pnpm.io)** - Fast, disk space efficient package manager
- **[Changesets](https://github.com/changesets/changesets)** - Version management and publishing
- **TypeScript Project References** - For incremental compilation across packages

## 📝 Versioning & Publishing

We use Changesets to manage versions and changelogs:

```bash
# Create a changeset (describe your changes)
pnpm changeset

# Version packages based on changesets
pnpm version-packages

# Build and publish to npm
pnpm release
```

## 🔧 Useful Commands

```bash
# Clean all build artifacts
pnpm clean

# Build a specific package
pnpm --filter @jsonblog/schema build

# Test a specific package
pnpm --filter @jsonblog/cli test

# Run CLI locally
pnpm --filter @jsonblog/cli dev
```

## 📚 Package Dependencies

```
@jsonblog/schema (foundation)
       ↑
       |
@jsonblog/generator-boilerplate
       ↑
       |
@jsonblog/cli (consumer)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm test && pnpm lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT © JSON Blog Team

## 🔗 Links

- [Documentation](https://github.com/jsonblog/jsonblog)
- [Report Issues](https://github.com/jsonblog/jsonblog/issues)
- [Discussions](https://github.com/jsonblog/jsonblog/discussions)

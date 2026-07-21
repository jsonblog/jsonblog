# Contributing to JsonBlog

Thanks for helping out! This is a pnpm + Turborepo monorepo.

## Setup

```bash
pnpm install          # Node >= 20 (CI runs 24), pnpm pinned via packageManager
pnpm build            # build all packages
pnpm test             # Vitest across the workspace
pnpm lint             # Biome
pnpm typecheck        # tsc --noEmit
pnpm format           # Biome format --write
```

Work on a single package with a filter: `pnpm --filter @jsonblog/core test`.

## Making a change

1. Branch off `main`.
2. Make your change. Keep it focused; match the surrounding style (Biome enforces it).
3. Add/adjust tests — engine changes go in `@jsonblog/core`'s Vitest suite; the CLI has an integration suite. Coverage on `core` must stay ≥ 80%.
4. Run `pnpm lint typecheck test build` — all must be green.
5. **Add a changeset**: `pnpm changeset` and describe the change (choose the affected packages + semver bump). CI fails a PR without one.
6. Open a PR against `main`.

## Adding a generator (theme)

A theme is templates + CSS + optional helper overrides on top of `@jsonblog/core` — see [ARCHITECTURE.md](./ARCHITECTURE.md). Copy `packages/generator-boilerplate` as a starting point.

## Releases

Merging the automated "version packages" PR publishes changed packages to npm under `@jsonblog/*` via Changesets + OIDC Trusted Publishing (with provenance). No manual `npm publish`.

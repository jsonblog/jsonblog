Complete picture confirmed. The blog's `jsonblog-generator-mono@0.2.0` is a **third copy of the same engine** (identical dep set: axios/handlebars/markdown-it/pino/rss/slugify) and is the one piece of unique jsonblog-ecosystem code not in the product monorepo. The blog's other packages (`ui`, `tsconfig`, `eslint-config-custom`) are its own scaffolding and stay put. I now have everything needed. Here is the decisive plan.

---

# JsonBlog Monorepo Perfection + The Perfect ajaxdavis.dev Blog — Architecture & Execution Plan

**Author:** Lead architect · **Date:** 2026-07-21 · **Status:** Decisive. Execute without re-deciding.
**Product monorepo:** `/mnt/donto-data/workspace/jsonblog/jsonblog` → `github.com/jsonblog/jsonblog`
**Flagship consumer (the blog):** `/mnt/donto-data/workspace/lordajax.com` → `github.com/thomasdavis/lordajax.com` (ajaxdavis.dev)

The framing that governs every decision: **jsonblog is the substrate/product; the ajaxdavis.dev blog is the flagship example-consumer that proves it.** The blog does not get bespoke one-off fixes — every reusable improvement (SEO head, a11y, perf, syntax highlighting) lands in `@jsonblog/core` + `@jsonblog/generator-mono` so it ships to every jsonblog user, and the blog becomes a thin, dogfooding consumer of the *published* packages.

---

## 1. GOAL — Definition of "Done" (measurable acceptance criteria)

### 1A. The monorepo is "done" when ALL of these are true

| # | Criterion | How it's verified |
|---|---|---|
| M1 | `pnpm install --frozen-lockfile` is clean; `pnpm turbo run lint typecheck test build` is **green** locally and in CI | CI job passes on a PR |
| M2 | **Every** publishable package passes `publint` **and** `attw --pack .` (types resolve for ESM+CJS) | `prepublishOnly` + CI gate green |
| M3 | Test suite is real (not stub/placeholder) and **green**, with coverage **≥ 80%** (lines/functions/branches/statements) on `core`, `schema`, and all generators | `vitest run --coverage` gate |
| M4 | **Zero broken internal links** in any generator's output; **builds are deterministic** (building the same blog twice yields byte-identical output) | link-check test + double-build `diff` test, both in CI |
| M5 | `jsonblog init → build → validate → dev` all work end-to-end from the published tarball on Node 22 and Node 24; `--version` reports the real package version | packaged smoke test (`pnpm pack` → install → run) |
| M6 | Release is **fully automated & tokenless**: push to `main` → Changesets "Version Packages" PR → merge → publish to npm under `@jsonblog/*` via **OIDC Trusted Publishing + provenance** (no `NPM_TOKEN`) | one real release cuts a version PR + publishes with a provenance badge |
| M7 | Package set is exactly: `@jsonblog/{core, schema, generator-boilerplate, generator-tailwind, generator-mono, cli, homepage, tsconfig}`; layering is acyclic; `turbo boundaries` passes | `turbo boundaries` + dep-graph check |
| M8 | Legacy is retired: 3 unscoped npm packages deprecated with forward pointers; 4 standalone GitHub repos archived; `apps/website` removed; `jsonblog.org` 301 → `jsonblog.dev` | `npm view` shows deprecation; repos show Archived; `curl -I jsonblog.org` = 301 |
| M9 | Root community docs exist: `README`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, `ARCHITECTURE`, `LICENSE`, `.github/ISSUE_TEMPLATE/*`, `PULL_REQUEST_TEMPLATE.md` | files present + linked |
| M10 | Tooling is the 2026 stack (see §3), pinned: `packageManager: pnpm@11.x`, catalogs with `catalogMode: strict`, Node 24 in CI | versions in lockfile/config |

### 1B. The blog is "done" ("absolutely perfect") when ALL of these are true

| # | Criterion | How it's verified |
|---|---|---|
| B1 | The blog builds from the **published** `@jsonblog/generator-mono` (no local-only generator); `blog.json`'s `generator.name` matches the generator actually used | `pnpm why`/lockfile shows the scoped dep; grep build script |
| B2 | **Lighthouse (mobile + desktop): Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100** | `lhci`/PageSpeed on the live URL |
| B3 | **`axe-core` and WCAG 2.2 AA: zero violations** on home, about, projects, a post, and the devlog index | axe CI run |
| B4 | **No `example.com`** anywhere in the build (sitemap, rss, HTML); every URL is `https://ajaxdavis.dev/...`; zero broken internal links | grep build dir + link-check |
| B5 | Per-page `<head>` completeness: self-referential **canonical**, non-empty **meta description**, **Open Graph** + **Twitter `summary_large_image`** + a real **OG image**, and **JSON-LD** (`Person` + `WebSite` on home, `BlogPosting` per post) | head snapshot test |
| B6 | Real `robots.txt` shipped with a `Sitemap:` line; valid `sitemap.xml` + `rss.xml` (no raw frontmatter bleeding into feed excerpts) | fetch + validate |
| B7 | **Fonts self-hosted** (woff2, `font-display: swap`, `<link rel=preload>`); **no third-party CDN** at page load (no Google Fonts `@import`, no cdnjs highlight.js) | grep build; network panel = 0 cross-origin |
| B8 | **Build-time syntax highlighting** (no runtime JS unless deliberate); code blocks are colorized and copy-able | visual + DOM check |
| B9 | a11y specifics: homepage has an `<h1>`, a skip-to-content link, `aria-label` on each `<nav>`, visible `:focus-visible` ring, `--muted` text ≥ 4.5:1 contrast, dates in `<time datetime>` | axe + manual contrast check |
| B10 | Reader nav: prev/next post links, tags rendered (styles already exist), homepage lede + brand mark, devlog grouped by year | visual review |
| B11 | Deployed on the OVH box behind Caddy at `ajaxdavis.dev` (DNS via Cloudflare) and all repos pushed | `curl -I https://ajaxdavis.dev` = 200 + correct headers; `git log` pushed |

---

## 2. CURRENT STATE (the honest picture)

1. **The monorepo infra layer is already good and live.** Turborepo + pnpm workspaces + Changesets, 4 published scoped packages (`@jsonblog/cli 3.1.1`, `schema 3.1.0`, `generator-boilerplate 5.0.0`, `generator-tailwind 4.3.0`), a real Next.js 15 / React 19 homepage on Vercel with a generator marketplace + build-time npm stats + `demos.jsonblog.dev`. CI + release workflows exist.
2. **There is NO source split-brain with the 4 old standalone repos.** Every `src/`, template, asset, and the whole Jekyll site in `jsonblog-{cli,generator-boilerplate,schema,website}` is a **strict subset** of the monorepo (verified byte-for-byte). The monorepo is authoritative. What blocks archiving is *not* code — it's **npm name continuity** (unscoped→scoped) and the **`jsonblog.org` deploy pointer**.
3. **There IS unique un-ported code — the blog's `jsonblog-generator-mono@0.2.0`.** It lives in the *blog's own* monorepo (`lordajax.com/packages/`) and on npm unscoped. It's the tasteful editorial theme the blog runs on, and it's a **third copy of the same engine** (identical deps to boilerplate/tailwind). None of the product packages contain it. **This must be ported before anything is archived.**
4. **The engine is triplicated three ways.** `generator-boilerplate`, `generator-tailwind`, and `generator-mono` share ~90% identical code (`fetchFile`, `processContent`, RSS, sitemap, pagination, dev-server). There is no `@jsonblog/core`; every fix must currently be made three times.
5. **Real bugs are shipped in published packages.** (a) `generator-boilerplate` v5 emits directory URLs (`/slug/index.html`) but its `.hbs` templates still link to flat `/slug.html` → **live 404s on every static host**. (b) `@jsonblog/cli` `init` **crashes under ESM** (raw `__dirname`, no shim), `--version` is hardcoded `2.6.0` (wrong), the `serve` log prints literal `${port}`, and a failed `build` **exits 0**. (c) RSS `pubDate`/sitemap `lastmod` fall back to `new Date()` → **non-deterministic builds**.
6. **Tests are not trustworthy.** CLI tests exercise *stub* commands, not the real CLI. Generator tests are **stale** (assert the pre-v5 flat-URL output) and **don't run** (workspace `tsconfig` isn't linked). "Extensive coverage" is aspirational.
7. **Schema has a dual-validation drift.** Zod is the real validator, but a hand-maintained `schema.json` (draft-04) + `ajv` + an **orphaned `commander` CLI** ship unused and have **diverged** from the Zod source of truth (a `blog.json` with `meta` passes JSON-Schema but fails Zod). Zod is still v3.
8. **Two homepages on two domains.** `apps/homepage` (Next.js, `jsonblog.dev`, maintained) vs `apps/website` (Jekyll, `jsonblog.org`, content frozen 2014–2019, not in the workspace, README still describes JSON Resume). No redirect exists.
9. **The blog is a strong-but-imperfect consumer.** ajaxdavis.dev is genuinely tasteful (editorial serif prose, real dark mode, human/AI devlog split) but ships three broken SEO artifacts (`example.com` hardcoded in **both** sitemap and RSS), **no OG/Twitter/JSON-LD**, **empty meta descriptions**, **no homepage `<h1>`**, render-blocking Google-Fonts `@import`, cdnjs highlight.js, unhighlighted code blocks, `--muted` text failing contrast, and no prev/next/tags. Its `blog.json` even lies about which generator builds it.
10. **2026 tooling gaps.** Jest (should be Vitest), ESLint+Prettier (should consolidate), classic `NPM_TOKEN` publishing (npm killed classic tokens Dec 2025 — must move to OIDC), no catalogs, no `publint`/`attw` gates, no project references, no `verbatimModuleSyntax`, no `sideEffects: false`.

---

## 3. TARGET ARCHITECTURE

### 3.1 Final layout

```
jsonblog/                          github.com/jsonblog/jsonblog
├── apps/
│   ├── cli/                       @jsonblog/cli          (public, ESM-only)
│   └── homepage/                  @jsonblog/homepage     (private; Next.js on Vercel; jsonblog.dev)
├── packages/
│   ├── core/                      @jsonblog/core         (public) ← NEW: the shared engine
│   ├── schema/                    @jsonblog/schema       (public; Zod 4, single source of truth)
│   ├── generator-boilerplate/     @jsonblog/generator-boilerplate  (public; templates+CSS over core)
│   ├── generator-tailwind/        @jsonblog/generator-tailwind     (public; templates+Tailwind over core)
│   ├── generator-mono/            @jsonblog/generator-mono         (public) ← NEW: graduated from the blog; FLAGSHIP theme
│   └── tsconfig/                  @jsonblog/tsconfig     (private, internal)
├── biome.json                     (root lint/format config; packages extend it)
├── turbo.json  pnpm-workspace.yaml  tsconfig.json (solution)  .changeset/
└── .github/ (ISSUE_TEMPLATE, PULL_REQUEST_TEMPLATE, workflows/{ci,release}.yml)
   + CONTRIBUTING / CODE_OF_CONDUCT / SECURITY / ARCHITECTURE / LICENSE / README

DELETED: apps/website (Jekyll)   —   its 301 handled at DNS/Caddy, content salvage in Phase 1
```

**Dependency layering (acyclic, enforced by `turbo boundaries` + TS project references):**
```
@jsonblog/schema ─┐
                  ├─▶ @jsonblog/core ─▶ generator-{boilerplate,tailwind,mono} ─▶ @jsonblog/cli ─▶ @jsonblog/homepage
@jsonblog/tsconfig (dev-time, everywhere)
```

**The blog** (`lordajax.com`, separate repo) consumes **published** `@jsonblog/cli` + `@jsonblog/generator-mono`. Its `ui`/`tsconfig`/`eslint-config-custom` packages are blog scaffolding and stay in the blog repo.

### 3.2 The canonical generator contract (locked)

Pure function; CLI owns disk I/O (the current pure-function design is correct — keep it, standardize the name):

```ts
// from @jsonblog/core
export interface GeneratedFile { name: string; content: string }   // name = relative path incl. subdirs
export interface GenerateOptions { basePath: string; baseUrl: string; config?: Record<string, unknown> }
export type Generate = (blog: Blog, options: GenerateOptions) => Promise<GeneratedFile[]>;

// each generator:
export const generate: Generate = /* ... */;
export const generateBlog = generate;   // back-compat alias, kept for exactly one major, then removed
export default generate;
```
`baseUrl` is promoted to a **first-class option** (was buried/inconsistent as `meta.canonical` vs `site.url`). Canonical field in the schema = **`blog.site.url`**; `core` derives RSS `site_url`, sitemap `<loc>`, and `<link rel=canonical>` from it uniformly.

### 3.3 The 2026 tool stack (ONE choice per decision, with rationale)

| Decision | **Choice** | One-line rationale |
|---|---|---|
| Package manager | **pnpm 11.x**, pinned exact via `packageManager` | Fastest, strict node_modules kills phantom deps, first-class catalogs, v11 minimum-release-age supply-chain defense. |
| Version pinning | **pnpm catalogs + `catalogMode: strict`** | One source of truth for shared dep versions; strict mode forbids bare version drift in child packages. |
| Task runner | **Turborepo 2.x** (`tasks`, not `pipeline`) | Content-hash caching, `--affected`, experimental Boundaries; simpler than Nx for a JS/TS repo. |
| Remote cache | **Vercel Remote Cache** (`TURBO_TOKEN`/`TURBO_TEAM`, read-only on fork PRs) | Sub-2-min CI; homepage already on Vercel so zero new vendor. |
| Library bundler | **tsup 8.x** (pinned) | Battle-tested zero-config ESM+CJS+`.d.ts` in one pass; already in use — don't churn to tsdown yet. |
| App build | **Framework-native** (Next.js owns homepage; blog uses its own static `build-site.mjs`) | Never bundle apps with tsup; Turbo only orchestrates. |
| Publish-correctness gates | **publint + @arethetypeswrong/cli** in `prepublishOnly` + CI | Catches the #1 broken-publish class ("types resolve for ESM but not CJS"). |
| Test runner | **Vitest 4.x** (migrate off Jest) | Native TS/ESM via esbuild, 5–10× faster, `projects` for the monorepo, shared config with Vite. |
| Lint + format | **Biome 2.x** (drop ESLint + Prettier) | One Rust binary does format+lint+import-sort ~20× faster; 2.0 nested config extends a root `biome.json`. Next's own `next build`/TS gate covers framework specifics. |
| Versioning/publish | **Changesets** | De-facto monorepo multi-package release standard; "Version Packages" PR flow; respects npm OIDC. |
| Publish auth | **npm Trusted Publishing (OIDC) + provenance** (`id-token: write`, `NPM_CONFIG_PROVENANCE=true`) | npm revoked classic tokens Dec 2025; OIDC = no long-lived secret + verifiable attestation. |
| TypeScript | **5.9**, shared `@jsonblog/tsconfig` base + **project references** (`composite`) + `verbatimModuleSyntax` + `isolatedModules` | Incremental, dependency-ordered typecheck; enforces package boundaries; catches type-only import mistakes. |
| Validation lib | **Zod 4** (single source of truth) + `z.toJSONSchema()` to generate `schema.json` | Kills the ajv/JSON-Schema drift; Zod 4 has native ISO date primitives + smaller bundle. |
| Node baseline | libs `engines: ">=22"`; **apps/CI on Node 24 LTS** (`.nvmrc = 24`) | 22 = safe library floor (LTS to Apr-2027); 24 = 2026 active LTS shipping npm 11 (needed for OIDC ≥ 11.5.1). |

---

## 4. PHASED EXECUTION PLAN

Ordering guarantees **nothing is lost**: unique code (`generator-mono`) is ported and the standalone subsets are re-confirmed *before* any archive/deprecate step (Phase 7). Each phase ends with a concrete verification.

### Phase 0 — Snapshot & safety net
- Tag current state of all repos: `git tag pre-perfection-2026-07-21 && git push --tags` in jsonblog + lordajax.com.
- Record the npm publish matrix (`npm view <pkg> version` for every scoped + unscoped name) into a scratch note.
- Confirm all working trees clean; create working branch `perfection` in the product monorepo.
- **Verify:** tags pushed; branch created; npm baseline recorded.

### Phase 1 — Port unique code + re-confirm subsets (NOTHING LOST)
- **Graduate the mono generator:** copy `lordajax.com/packages/jsonblog-generator-mono` → `jsonblog/packages/generator-mono`; rename to `@jsonblog/generator-mono`; scope its deps to `workspace:*`/catalogs; wire into workspace.
- **Re-confirm the 4 standalone repos are strict subsets:** `diff -rq` each `jsonblog-{cli,generator-boilerplate,schema,website}` against its monorepo home (expected: empty except evolved `src/index.ts`, already reviewed). Salvage from `apps/website`: the 4 blog posts, `team.html`, wanted icons → stash into homepage content before it's deleted.
- **Baseline snapshots:** build the current mono generator and save golden output of the *current* ajaxdavis.dev build for later byte-diffing.
- **Verify:** `@jsonblog/generator-mono` builds in the monorepo and reproduces the blog's current output byte-for-byte; `diff -rq` on the 4 standalone repos shows no un-ported source.

### Phase 2 — Extract `@jsonblog/core` (kill the 3-way duplication)
- Create `packages/core` housing the shared engine: `fetchFile`, `processContent`, markdown pipeline, pagination, RSS, sitemap, **the SEO head-builder** (canonical/description/OG/Twitter/JSON-LD), the **dev-server** (express + chokidar + WS live-reload, currently stranded), types, logger.
- Refactor `generator-{boilerplate,tailwind,mono}` to depend on `core` and contribute only **templates + CSS + theme tokens**. Standardize the exported contract (§3.2).
- **Verify:** golden-file test — each generator's output is byte-identical to its Phase-1 snapshot (proves the refactor changed nothing observable), *except* the intentional URL-bug fix (Phase 3).

### Phase 3 — Fix the shipped bugs
- **Boilerplate URL 404s:** migrate all `.hbs` templates + README to directory URLs (`/slug/`), matching what the engine emits. (Now trivial — templates are the only per-generator surface.)
- **CLI:** shim `__dirname` (`fileURLToPath(import.meta.url)`); source `--version` from `package.json`; fix the `${port}` template-literal log; make validation/generator failures **exit non-zero**; add **`jsonblog dev`** (build + serve + live-reload via core's dev-server) and surface **`jsonblog validate`**; replace pino output with human CLI output (chalk is already a dep); add `--force`/overwrite guard to `init`; fix `watch` to also handle `add`/`unlink` + debounce; correct the README for the scoped package.
- **Determinism:** remove `new Date()` fallbacks in RSS/sitemap (use post dates or omit); make output reproducible.
- **Schema:** upgrade to Zod 4; generate `schema.json` from Zod via `z.toJSONSchema()`; delete hand-maintained `schema.json`, `ajv`, and the orphaned `commander` validate CLI; add `site.url`, wire `generator.config` through, `sideEffects: false`, declare `typescript`+`@jsonblog/tsconfig` devDeps, delete dead test fixtures.
- **Tailwind:** delete dead `templates/main.css`; make `clean` not break module-load (guard the `readFileSync`); remove unused `assets/*.svg`.
- **Security:** add opt-in HTML sanitization (sanitize-html/DOMPurify) in core's markdown path for remote `source` content.
- **Verify:** run a generator over a fixture → link-check finds **zero** dead links; `jsonblog init && jsonblog build && jsonblog dev` works end-to-end; double-build `diff` is empty; `jsonblog build` on an invalid blog exits non-zero.

### Phase 4 — Modernize tooling
- pnpm 11 pinned; add `pnpm-workspace.yaml` catalogs + `catalogMode: strict`; route shared deps (typescript, vitest, zod, @types/node, handlebars, markdown-it…) through the catalog.
- Turbo 2 `turbo.json` (`tasks`, correct `outputs`, `env`/`globalEnv`, `typecheck` task, `dev` persistent+uncached); enable `turbo boundaries` with package tags.
- Migrate Jest → **Vitest 4** (delete `jest.config.js`/`ts-jest`); consolidate lint to **Biome 2** (root `biome.json`, per-package nested config; delete ESLint+Prettier).
- TS 5.9 solution `tsconfig.json` + project references + `composite`; upgrade `@jsonblog/tsconfig` base (add `exports` map, `verbatimModuleSyntax`, `isolatedModules`, `NodeNext`).
- Add `publint` + `attw` to every publishable package's `prepublishOnly`; set `sideEffects: false`, correct `exports` order (types → import → require), Node engines.
- **Verify:** `pnpm turbo run lint typecheck test build` green; `publint && attw --pack .` green per package; `turbo boundaries` clean.

### Phase 5 — Tests to green + coverage gate
- Rewrite generator tests for directory URLs; add real CLI tests (fixture-based `init`/`build`/`validate`/output-snapshot, exit-code assertions); add `core` engine tests (fetch, markdown, RSS, sitemap, pagination, SEO head, dev-server); schema round-trip tests including the Zod↔JSON-Schema equivalence.
- Set Vitest coverage thresholds to 80% and wire into the `test` task.
- **Verify:** `pnpm test` green; coverage ≥ 80% gate passes in CI.

### Phase 6 — CI + release automation + community docs
- `ci.yml`: `fetch-depth: 0`, `pnpm/action-setup@v4`, Node 24, `--frozen-lockfile`, `pnpm turbo run lint typecheck test build --affected`, remote cache, plus a **`changeset status --since=origin/main`** PR check (fail on missing changeset) and the **link-check + double-build determinism** gates from Phases 3–4.
- `release.yml`: `permissions: id-token: write`; ensure `npm ≥ 11.5.1`; `changesets/action@v1` with `NPM_CONFIG_PROVENANCE=true`; **remove `NPM_TOKEN`**.
- Add `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, `ARCHITECTURE` (the layering + generator contract), `LICENSE`, issue/PR templates, Dependabot.
- **Verify:** CI green on a throwaway PR; `changeset version` dry-run produces correct bumps; OIDC config validated (Phase 7 does the first live publish).

### Phase 7 — Publish, deprecate, archive (the irreversible, sign-off-gated steps — see §5)
- Create changesets; let the release flow publish **`@jsonblog/core`** + **`@jsonblog/generator-mono`** (new public) and re-publish **`@jsonblog/cli 3.1.1`** and any changed packages, all with provenance.
- `npm deprecate jsonblog-cli|jsonblog-generator-boilerplate|jsonblog-schema "moved to @jsonblog/<name>"`.
- Re-point `jsonblog.org` → 301 to `jsonblog.dev` (Cloudflare/DNS); delete `apps/website`.
- Archive the 4 standalone GitHub repos.
- **Verify:** `npm view @jsonblog/core version` etc. resolve; `npm view jsonblog-cli` shows the deprecation; `curl -I jsonblog.org` = 301; repos show "Archived".

### Phase 8 — The perfect-blog pass (in `lordajax.com`)
- Repoint the blog to **published** `@jsonblog/generator-mono` (+ `@jsonblog/cli`); make `blog.json`'s `generator.name` truthful; keep the human/AI two-blog `build-site.mjs` (that composition is legitimately custom) but have it consume the published generator.
- Land every §6 item. Reusable fixes (SEO head, self-hosted fonts, Shiki highlighting, a11y contrast/focus/skip-link, `<time>`, prev/next, tags) go **into `@jsonblog/core` + generator-mono** and flow back as a generator release; blog-specific data (real `site.url`, per-post `description`/`tags`, OG image, intro lede) goes into `blog.json`/content; the `build-site.mjs` post-process loop injects per-page canonical/OG/prev-next.
- **Verify:** Lighthouse ≥95/100/100/100 (mobile+desktop), axe zero violations, `grep -r example.com build/` empty, link-check clean, network panel shows zero cross-origin requests.

### Phase 9 — Deploy on the box + push
- Build the blog's static output; serve via **Caddy `file_server`** on the OVH box; DNS `ajaxdavis.dev` → `15.235.185.42` (Cloudflare proxied, SSL Full, Caddy `tls internal`); ship real `robots.txt` + `sitemap.xml`. (Homepage stays on Vercel as canonical `jsonblog.dev` — already working, owns demos subdomains + build-time npm stats.)
- Commit + push all repos (jsonblog + lordajax.com), following the commit-often/push-often rule; tag releases.
- **Verify:** `curl -I https://ajaxdavis.dev` = 200 with correct cache/content headers; sitemap + rss resolve to real URLs; `git status` clean and pushed on both repos.

---

## 5. DECISIONS NEEDING USER SIGN-OFF (outward-facing / irreversible only)

Everything not in this list, I will just do. These five need an explicit yes because they touch public identity, the npm registry, or DNS:

1. **Archive the 4 public standalone repos** (`jsonblog/jsonblog-cli`, `-generator-boilerplate`, `-schema`, `-website`) on GitHub after publish-continuity (Phase 7). *Reversible-ish but public.* → **OK to archive?**
2. **npm registry changes:** (a) `npm deprecate` the 3 unscoped packages with forward pointers; (b) publish **two new public packages** `@jsonblog/core` and `@jsonblog/generator-mono` (the latter graduated from the blog's `jsonblog-generator-mono@0.2.0` — decide whether to also `deprecate jsonblog-generator-mono → @jsonblog/generator-mono`); (c) re-publish `@jsonblog/cli 3.1.1`. → **Approve the npm publish/deprecate set?**
3. **Migrate npm publishing to OIDC Trusted Publishing.** This requires the npm account owner to configure a trusted publisher **per package** at `npmjs.com/package/<name>/access` (pointing at `github.com/jsonblog/jsonblog` + `release.yml`). I can't click those. → **Will you set up the per-package trusted publishers (or keep `NPM_TOKEN` short-term)?**
4. **Domains / DNS:** (a) `jsonblog.org` 301 → `jsonblog.dev` and retire the Jekyll site; (b) confirm `jsonblog.dev` is the single canonical product domain; (c) decide `jsonblog.com` (redirect if owned, else ignore); (d) keep `*.demos.jsonblog.dev`; (e) point `ajaxdavis.dev` at the box IP via Cloudflare. → **Approve this domain map?**
5. **GitHub org/canonical-repo normalization:** homepage links reference `github.com/ajaxdavis/jsonblog` while the repo is `github.com/jsonblog/jsonblog`. → **Confirm `jsonblog/jsonblog` is the canonical repo to normalize all links to.**

---

## 6. THE PERFECT-BLOG SPEC (ajaxdavis.dev end-state checklist)

Grouped; each item marked **[core/gen]** (fix lands in `@jsonblog/core`/generator-mono → ships to all users) or **[blog]** (blog data/content/deploy). Priority order preserved from the gap survey.

### SEO (highest value — two live bugs first)
- [ ] **[blog+gen]** Kill `example.com`: set `blog.site.url = "https://ajaxdavis.dev"`; core derives all URLs from it; fix the hardcoded `example.com` in `build-site.mjs`.
- [ ] **[core/gen]** Per-page **canonical** `<link rel="canonical">` (self-referential).
- [ ] **[core/gen + blog]** Non-empty **meta description** per page (from per-post `description` frontmatter, fallback = first paragraph).
- [ ] **[core/gen + blog]** **Open Graph** (`og:title/description/image/type/url`) + **Twitter `summary_large_image`**; ship/generate a real **OG image** (static default + per-post if available).
- [ ] **[core/gen]** **JSON-LD**: `Person` + `WebSite` on the homepage, `BlogPosting` (headline, datePublished, author, url) per post.
- [ ] **[blog]** Ship a real **`robots.txt`** with `Sitemap: https://ajaxdavis.dev/sitemap.xml`.
- [ ] **[core/gen]** Strip frontmatter (`text:`/`code:` lines) before generating RSS `<description>` excerpts.
- [ ] **[core/gen]** `<meta name="author">`, and keep `<html lang="en">`.

### Performance
- [ ] **[core/gen]** **Self-host** Source Serif 4 + JetBrains Mono as `woff2`, `font-display: swap`, `<link rel="preload">` the above-the-fold weights; **remove the Google-Fonts CSS `@import`** (worst-case render-blocking + privacy).
- [ ] **[core/gen]** Remove cdnjs highlight.js; move to build-time highlighting (below).
- [ ] **[blog/deploy]** Fingerprint/cache-bust CSS (`main.[hash].css`) or set cache headers + purge on deploy.
- [ ] **[core/gen]** `loading="lazy"` + explicit `width`/`height` on video/thumbnail images (kills CLS).
- [ ] **[core/gen]** Optionally inline the ~11.5KB critical CSS into `<head>` after fonts are fixed.

### Accessibility (WCAG 2.2 AA, zero axe violations)
- [ ] **[core/gen]** Homepage masthead title becomes an `<h1>` and links to `/`.
- [ ] **[core/gen]** **Skip-to-content** link (visually-hidden, first focusable).
- [ ] **[core/gen]** `aria-label` on each `<nav>` (`"Primary"`, `"Pagination"`).
- [ ] **[core/gen]** Darken `--muted` to ≥ 4.5:1 in light mode (~`#6f6c66`) and lighten in dark mode; applies to `.log-date`, `.post-frontmatter`, `.foot`, `.log-head`.
- [ ] **[core/gen]** Visible `:focus-visible` ring matching the accent.
- [ ] **[core/gen]** Dates rendered as `<time datetime="YYYY-MM-DD">` (also feeds `BlogPosting`).

### Content presentation
- [ ] **[core/gen]** **Build-time syntax highlighting** via **Shiki** (rehype) — colorized, no runtime JS.
- [ ] **[core/gen]** Copy-to-clipboard on code blocks (tiny inline JS or CSS-label; respects the near-no-JS stance).
- [ ] **[core/gen]** Post metadata: reading time + tags (styles already exist and are currently unused).
- [ ] **[core/gen]** Fix the boilerplate/mono double-`<h1>` (strip leading `# Title` from post markdown, as tailwind already does).
- [ ] **[core/gen]** `<figure>/<figcaption>` convention for in-body images.

### Information architecture & navigation
- [ ] **[core/gen]** **Prev/next post** links in the post footer (inject in the build post-process loop, which already iterates ordered posts).
- [ ] **[core/gen + blog]** **Tags/topics** per post (mobtranslate, donto, omega, tpmjs, jsonresume…) → browsable archive.
- [ ] **[blog]** Devlog index grouped by year (`## 2026` / `## 2025`) instead of one 40-item wall (or reinstate pagination).
- [ ] **[blog]** Homepage **lede** (1–2 sentences in the existing voice) + optionally a featured latest-devlog card (`.featured` style already exists).

### Visual design & brand
- [ ] **[blog/gen]** Add a distinctive **brand mark** (small SVG monogram/wordmark in the masthead) so identity survives beyond the typeface.
- [ ] **[core/gen]** Tint in-prose links to `--accent` (keep underline) so body links are scannable.
- [ ] **[core/gen]** Optional manual **dark-mode toggle** (no-JS-friendly) + per-scheme `<meta name="theme-color">`.
- [ ] **[core/gen]** `@media print` stylesheet (hide chrome, black-on-white, show link URLs) — a cheap "perfect" touch for a text-first site.

### Config truthfulness & deploy
- [ ] **[blog]** `blog.json` `generator.name` = the generator actually used; consume the **published** `@jsonblog/generator-mono` (no local-only package).
- [ ] **[blog/deploy]** Deploy static build behind **Caddy** on the OVH box at `ajaxdavis.dev`; DNS via Cloudflare; all repos pushed + tagged.

**Reusability note:** the majority of B-items are **[core/gen]** — they upgrade `@jsonblog/core` + `@jsonblog/generator-mono` and therefore ship to every jsonblog user, not just this blog. That is the whole point: perfecting the blog *is* how we prove and harden the substrate.
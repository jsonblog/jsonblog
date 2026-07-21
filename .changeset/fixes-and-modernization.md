---
"@jsonblog/cli": minor
"@jsonblog/schema": minor
"@jsonblog/generator-boilerplate": patch
"@jsonblog/generator-tailwind": patch
---

Bug fixes and modernization:

- **generator-boilerplate**: fix flat-URL 404s — templates now emit directory URLs (`/slug/`) matching the engine output.
- **schema**: add `site.url` as the canonical-origin field; drop the unused ajv dependency and orphaned CLI.
- **cli**: fix the ESM `init` crash, report the real `--version`, exit non-zero on build/validation failure, clean human-readable output, and add `jsonblog validate` and `jsonblog dev` (live-reload). `init` now scaffolds runnable sample content and guards against clobbering with `--force`.
- Deterministic builds across all generators (no `new Date()` in output); canonical/OG/RSS/sitemap URLs derive from `blog.site.url`.
- Correct dual ESM/CJS type exports (publint + are-the-types-wrong clean).

# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Instead, use GitHub's
private ["Report a vulnerability"](https://github.com/jsonblog/jsonblog/security/advisories/new)
flow, or email the maintainer. We'll acknowledge within a few days and keep you
updated on a fix.

## Scope

JsonBlog generates static HTML from a `blog.json`. The most relevant surface is
markdown/HTML rendering of post content: if a blog sources content from remote
URLs, treat that content as untrusted. Reports about XSS via rendered content,
supply-chain issues, or the CLI/dev-server are all in scope.

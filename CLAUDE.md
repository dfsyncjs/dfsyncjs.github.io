# CLAUDE.md

## Project purpose

This repository is the documentation website for `@dfsync/client`.

`@dfsync/client` is a Node.js and TypeScript HTTP client for service-to-service communication. It focuses on reliable backend HTTP calls with retry, auth, lifecycle hooks, request metadata, response validation, and structured errors.

Package source:

- https://github.com/dfsyncjs/dfsync/tree/main/packages/client

Documentation website:

- https://github.com/dfsyncjs/dfsyncjs.github.io

## Source of truth

Documentation must match the current release branch or PR in the `dfsync` monorepo.

Before updating docs for a release, inspect the package source and tests instead of guessing behavior:

- `packages/client/src/index.ts`
- `packages/client/src/types/*`
- `packages/client/src/errors/*`
- `packages/client/src/core/request.ts`
- `packages/client/src/core/should-retry.ts`
- `packages/client/tests`

If behavior is unclear, check the release branch or ask before documenting it.

## Documentation structure

Markdown docs live in:

- `docs/<package-slug>/<version>/*.md`

Current `@dfsync/client` docs live in:

- `docs/client/v1/*.md`

Docs are loaded by:

- `src/content/docsContent.ts`

Default docs constants are defined in:

- `src/content/docsNavigation.ts`

Package docs navigation and markdown imports are defined in `docsPackages` inside `src/content/docsContent.ts`.

When adding a new markdown page, add it to the relevant package/version entry in `docsPackages` unless the page is intentionally hidden.

The default docs package is `client`, so `#/docs` is treated as `@dfsync/client` documentation.

Canonical docs URLs use:

- `#/docs/<package-slug>/<version>/<page-slug>`

For example:

- `#/docs/client/v1/getting-started`

## Current docs pages

- Getting Started
- Installation
- Create Client
- Response Handling
- Auth
- Hooks
- Observability
- Retry
- Errors
- Examples
- API Reference

## Important API concepts

Keep these names and behaviors consistent across the docs:

- `baseUrl`, never `baseURL`
- `createClient`
- `get`, `delete`, `post`, `put`, `patch`, `request`
- auth strategies: `bearer`, `apiKey`, `custom`
- retry config: `attempts`, `retryOn`, `retryMethods`, `backoff`, `baseDelayMs`
- request metadata: `requestId`, `x-request-id`
- idempotency: `idempotencyKey`, `idempotency-key`
- response validation: `validateResponse`, `ResponseValidator`, `ValidationError`
- hooks: `beforeRequest`, `afterResponse`, `onError`, `onRetry`
- errors: `DfsyncError`, `HttpError`, `NetworkError`, `TimeoutError`, `ValidationError`, `RequestAbortedError`

## Release docs checklist

When preparing docs for a new `@dfsync/client` release:

1. Compare the release branch against `main` in `packages/client`.
2. Check public exports from `packages/client/src/index.ts`.
3. Check public config, request, hook, and auth types.
4. Check new or changed error classes.
5. Check tests for behavioral rules.
6. Update relevant docs pages.
7. Update `docsPackages` in `docsContent.ts` if adding pages or packages.
8. Run verification commands.

## Adding another package

When adding docs for another package:

1. Create `docs/<package-slug>/<version>`.
2. Add the package to `docsPackages` in `src/content/docsContent.ts`.
3. Define package label, default version, default page slug, navigation, and markdown imports.
4. Keep `client` as the default docs package unless the product direction changes.
5. Verify package routes under `#/docs/<package-slug>/<version>/<page-slug>`.

## Local commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format:check
```

## Writing rules

- Keep docs factual and implementation-aligned.
- Prefer examples that compile against the real public API.
- Do not document behavior unless it is confirmed by source or tests.
- Keep examples focused on backend and service-to-service use cases.
- Keep release notes and docs versioned around `@dfsync/client`, not the full monorepo.

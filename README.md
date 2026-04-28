# dfsyncjs.github.io

Documentation website for [`@dfsync/client`](https://github.com/dfsyncjs/dfsync/tree/main/packages/client).

`@dfsync/client` is a Node.js and TypeScript HTTP client for service-to-service communication. It provides retries, auth, lifecycle hooks, request metadata, response validation, and structured errors.

Website repository:

- https://github.com/dfsyncjs/dfsyncjs.github.io

Package monorepo:

- https://github.com/dfsyncjs/dfsync

## Tech stack

- React
- TypeScript
- Vite
- Material UI
- React Router
- `react-markdown` with `remark-gfm`

## Project structure

```text
docs/<package>/<version>/        Markdown documentation content
docs/client/v1/                  @dfsync/client v1 documentation
src/content/docsContent.ts      Package docs registry and markdown import map
src/content/docsNavigation.ts   Default docs package/version constants
src/pages/Docs/                 Documentation page renderer
src/components/                 Shared UI components
src/services/analytics/         Analytics helpers
```

## Documentation pages

The current `v1` docs include:

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

`#/docs` is the default documentation entry point for `@dfsync/client`.

Canonical documentation URLs use:

```text
#/docs/<package>/<version>/<page>
```

For example:

```text
#/docs/client/v1/getting-started
```

When adding a new markdown file under `docs/<package>/<version>`, also add it to the relevant package/version entry in:

- `src/content/docsContent.ts`

## Adding package docs

To add documentation for another package:

1. Create `docs/<package>/<version>`.
2. Add the package to `docsPackages` in `src/content/docsContent.ts`.
3. Define the package label, default version, default page, navigation, and markdown imports.
4. Verify routes under `#/docs/<package>/<version>/<page>`.

## Source of truth

Docs should match the current `@dfsync/client` source in the monorepo:

- `packages/client/src/index.ts`
- `packages/client/src/types/*`
- `packages/client/src/errors/*`
- `packages/client/src/core/*`
- `packages/client/tests`

For release documentation, compare the release branch or PR against `main` before editing this site.

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Verification

Run these before opening or merging documentation changes:

```bash
npm run format:check
npm run typecheck
npm run lint
npm run build
```

## Notes for docs updates

- Use `baseUrl`, not `baseURL`.
- Keep examples aligned with the public `@dfsync/client` API.
- Do not document behavior unless it is confirmed by source or tests.
- If a behavior is release-specific, check the active release branch or PR.

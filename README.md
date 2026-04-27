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
docs/v1/                        Markdown documentation content
src/content/docsContent.ts      Markdown import map
src/content/docsNavigation.ts   Docs sidebar/navigation
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

When adding a new markdown file under `docs/v1`, also add it to:

- `src/content/docsContent.ts`
- `src/content/docsNavigation.ts`

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

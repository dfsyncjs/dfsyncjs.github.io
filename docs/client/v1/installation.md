# Installation

Install the package with your preferred package manager.

Install the package from npm:

```bash
npm install @dfsync/client
```

or with yarn:

```bash
yarn add @dfsync/client
```

## Requirements

- Node.js `>= 20`

## Optional peer dependencies

`zod` is an optional peer dependency, required only if you use the built-in zod validation adapter.

```bash
npm install zod
```

The core package has no runtime dependencies. Installing `zod` is not needed for any other feature.

## ESM / CJS

The package ships with both import and require entry points, plus TypeScript types.

## ESM

```ts
import { createClient } from '@dfsync/client';
```

## CommonJS

```javascript
const { createClient } = require('@dfsync/client');
```

## Subpath exports

Optional adapters ship as separate entry points, so they are only loaded when you import them.

```ts
import { zodAdapter } from '@dfsync/client/adapters/zod';
```

See **Response Handling** for how to use it.

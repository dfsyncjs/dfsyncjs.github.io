# Getting Started

`@dfsync/client` is a lightweight HTTP client built around a predictable request lifecycle for service-to-service communication in Node.js.

It provides sensible defaults for:

- microservices
- internal APIs
- worker and integration services
- external API communication

The client focuses on predictable behavior, extensibility, and a clean developer experience.

## Main features

- predictable request lifecycle
- request ID propagation (`x-request-id`)
- request cancellation via `AbortSignal`
- built-in retry with configurable policies
- lifecycle hooks: `beforeRequest`, `afterResponse`, `onError`

- typed responses
- automatic JSON parsing
- consistent error handling

- auth support: bearer, API key, custom
- support for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`

## Quick example

```ts
import { createClient } from '@dfsync/client';

type User = {
  id: string;
  name: string;
};

const client = createClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
});

const user = await client.get<User>('/users/1');
```

## How requests work

A request in `@dfsync/client` follows a predictable lifecycle:

1. create request context
2. build final URL from `baseUrl`, `path`, and query params
3. merge client and request headers
4. apply authentication
5. attach request metadata (e.g. `x-request-id`)
6. run `beforeRequest` hooks
7. send request with `fetch`
8. retry on failure (if configured)
9. parse response (JSON, text, or `undefined`)
10. run `afterResponse` or `onError` hooks

## Runtime requirements

- Node.js >= 20
- a working fetch implementation

If you do not pass a custom `fetch`, the client uses `globalThis.fetch`.

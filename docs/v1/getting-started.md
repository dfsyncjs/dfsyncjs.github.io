# Getting Started

`@dfsync/client` is a lightweight TypeScript HTTP client designed for reliable service-to-service communication.

It provides sensible defaults for:

- microservices
- internal APIs
- worker and integration services
- external API communication

The client focuses on predictable behavior, extensibility, and a clean developer experience.

## What you get

- typed responses
- simple client creation
- request timeout support
- automatic JSON parsing
- text response support
- structured error classes
- auth support
- lifecycle hooks
- custom `fetch` support

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

console.log(user.id);
console.log(user.name);
```

## How requests work

A request in `@dfsync/client` follows this flow:

1. build final URL from `baseUrl`, `path`, and optional query params
2. merge default, client-level, and request-level headers
3. apply auth configuration
4. run `beforeRequest` hooks
5. send request with `fetch`
6. parse response as JSON, text, or `undefined` for `204`
7. throw structured errors for failed requests
8. run `afterResponse` or `onError` hooks

## Runtime requirements

- Node.js >= 20
- a working fetch implementation

If you do not pass a custom `fetch`, the client uses `globalThis.fetch`.

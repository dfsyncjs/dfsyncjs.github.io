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
- retry support
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

A request in `@dfsync/client` goes through the following lifecycle:

1. Build request URL

   The final URL is constructed from `baseUrl`, `path`, and optional query parameters.

2. Merge headers

   Default headers, client-level headers, and request-level headers are combined.

3. Apply authentication

   The configured auth strategy (Bearer, API key, or custom) is applied to the request.

4. Run `beforeRequest` hooks

   Hooks can modify the request before it is sent.

5. Execute the HTTP request

   The request is sent using the Fetch API.

6. Retry if necessary

   If the request fails with a retryable error, it may be retried according to the configured retry policy.

7. Parse the response

   The response body is parsed automatically:
   - JSON → parsed object
   - text → string
   - `204 No Content` → `undefined`

8. Handle errors

   Non-success responses and network failures are converted into structured errors.

9. Run response hooks
   - `afterResponse` runs for successful responses
   - `onError` runs when an error occurs

## Runtime requirements

- Node.js >= 20
- a working fetch implementation

If you do not pass a custom `fetch`, the client uses `globalThis.fetch`.

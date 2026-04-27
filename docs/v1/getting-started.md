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
- lifecycle hooks: `beforeRequest`, `afterResponse`, `onError`, `onRetry`

- typed responses
- automatic JSON parsing
- response validation with `ValidationError`
- consistent error handling

- auth support: bearer, API key, custom
- idempotency key support for safer retries
- support for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`

## Quick example

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  retry: {
    attempts: 2,
    retryOn: ['5xx', 'network-error'],
  },
  hooks: {
    onRetry: ({ requestId, retryReason, retryDelayMs }) => {
      console.log(`[${requestId}] retrying in ${retryDelayMs}ms`, retryReason);
    },
  },
});

const data = await client.get('/health');
```

This gives you:

- timeouts
- retries
- structured errors
- request lifecycle hooks
- built-in retry observability

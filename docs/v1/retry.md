# Retry

`@dfsync/client` supports configurable retry policies for transient failures.

Retries are useful when communicating with external services that may temporarily fail or return `5xx` responses.

The retry behavior can be configured globally for the client or overridden per request.

---

## Basic retry configuration

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
  },
});
```

If a retryable error occurs, the request will be retried up to the configured number of attempts.

## Retry conditions

By default, retries happen for:

- network errors
- HTTP 5xx responses

Example:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 3,
  },
});
```

## Retry backoff

Two retry strategies are supported:

### Fixed delay

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 3,
    backoff: 'fixed',
    baseDelayMs: 300,
  },
});
```

Retry delays:

```bash
300ms
300ms
300ms
```

### Exponential backoff

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 3,
    backoff: 'exponential',
    baseDelayMs: 300,
  },
});
```

Retry delays:

```bash
300ms
600ms
1200ms
```

If `attempts` is `0` (default), no retries are performed and retry delays are ignored.

## Retry methods

By default retries apply to:

- `GET`
- `PUT`
- `DELETE`

POST requests are **not retried by default**.

Example enabling POST retries:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryMethods: ['GET', 'POST'],
  },
});
```

## Retry conditions configuration

You can control which errors trigger retries.

Supported conditions:

- network-error
- 5xx
- 429

Example:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryOn: ['network-error', '5xx', '429'],
  },
});
```

## Per-request retry override

Request-level configuration overrides the client configuration.

```ts
await client.get('/users', {
  retry: {
    attempts: 1,
  },
});
```

## Retry and hooks

Hooks behave as follows when retries are enabled:

| Hook            | Behavior                              |
| --------------- | ------------------------------------- |
| `beforeRequest` | executed on every retry attempt       |
| `afterResponse` | executed only on successful response  |
| `onError`       | executed once after the final failure |

Example:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: { attempts: 2 },
  hooks: {
    onError(ctx) {
      console.error(ctx.error);
    },
  },
});
```

## Summary

Retry is designed for **safe and predictable service-to-service communication** and works well for:

- microservices
- external APIs
- background workers
- integration services

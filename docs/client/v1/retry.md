# Retry

`@dfsync/client` supports configurable retry policies for transient failures.

Retries are useful when communicating with external services that may temporarily fail or return `5xx` responses.

The retry behavior can be configured globally for the client or overridden per request.

Retries can be configured for:

- `network-error`
- `5xx`
- `429`

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryOn: ['network-error', '5xx', '429'],
    backoff: 'exponential',
    baseDelayMs: 300,
  },
});
```

## Retry-After support

When a retryable response includes a `Retry-After` header, `@dfsync/client` uses that value before falling back to the configured backoff strategy.

Supported formats:

- seconds
- HTTP-date

If `Retry-After` is invalid, `@dfsync/client` falls back to normal retry backoff.

## Observing retries

Use `onRetry` to inspect retry behavior.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryOn: ['5xx', '429'],
  },
  hooks: {
    onRetry: ({ requestId, retryReason, retryDelayMs, retrySource }) => {
      console.log({
        requestId,
        retryReason,
        retryDelayMs,
        retrySource,
      });
    },
  },
});
```

## Notes

- `attempt` is zero-based
- `maxAttempts` is the total number of allowed attempts, including the initial request
- `requestId` remains stable across retries

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

`POST` and `PATCH` requests are **not retried by default**.

To retry `POST` or `PATCH`, both conditions must be true:

- the method is explicitly included in `retry.retryMethods`
- the request provides `idempotencyKey`

Example enabling safe POST retries:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryMethods: ['GET', 'POST'],
    retryOn: ['5xx'],
  },
});

await client.post(
  '/payments',
  { amount: 100 },
  {
    idempotencyKey: 'payment-123',
  },
);
```

The idempotency key is propagated as the `idempotency-key` header.

If `POST` or `PATCH` is included in `retryMethods` without `idempotencyKey`, the request is not retried.

Validation failures are not retried.

## Retry and hooks

Hooks behave as follows when retries are enabled:

| Hook            | Behavior                               |
| --------------- | -------------------------------------- |
| `beforeRequest` | executed on every retry attempt        |
| `afterResponse` | executed only on successful response   |
| `onRetry`       | executed before the next retry attempt |
| `onError`       | executed once after the final failure  |

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

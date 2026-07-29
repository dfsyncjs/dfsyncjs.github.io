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

## Retry configuration

```ts
type RetryConfig = {
  attempts?: number;
  backoff?: 'fixed' | 'exponential';
  baseDelayMs?: number;
  retryOn?: ('network-error' | '5xx' | '429')[];
  retryMethods?: ('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')[];
  maxElapsedMs?: number;
  jitter?: boolean;
  shouldRetry?: RetryPredicate;
};
```

Defaults:

| Option         | Default                       |
| -------------- | ----------------------------- |
| `attempts`     | `0`                           |
| `backoff`      | `'exponential'`               |
| `baseDelayMs`  | `300`                         |
| `retryOn`      | `['network-error', '5xx']`    |
| `retryMethods` | `['GET', 'PUT', 'DELETE']`    |
| `jitter`       | `false`                       |
| `maxElapsedMs` | not set — no budget           |
| `shouldRetry`  | not set — built-in rules only |

`attempts` counts retries **after** the first attempt, so `attempts: 2` means up to three requests in total.

Request-level `retry` replaces the client-level values for the options it specifies.

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

### Jitter

Setting `jitter: true` applies full jitter to backoff delays: each delay is chosen uniformly between `0` and the computed backoff value.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 3,
    backoff: 'exponential',
    baseDelayMs: 300,
    jitter: true,
  },
});
```

Retry delays become:

```bash
0–300ms
0–600ms
0–1200ms
```

This helps avoid retry storms when many clients fail at the same time and would otherwise retry in lockstep.

Jitter is disabled by default, and it is never applied to server-directed `Retry-After` delays.

## Retry budget

`maxElapsedMs` caps the total time spent retrying, measured from the first attempt.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 5,
    backoff: 'exponential',
    baseDelayMs: 300,
    maxElapsedMs: 2000,
  },
});
```

Before each retry, the client checks whether waiting the next delay would push the elapsed time past the budget. If it would, the client stops retrying immediately and throws the last error instead of waiting.

This means:

- the budget is checked against the elapsed time **plus** the next planned delay
- the client never sleeps past the budget just to make one more attempt
- retries can end before `attempts` is exhausted
- `onRetry` does not run for the attempt that was cut off by the budget

Use it to keep worst-case request latency bounded and predictable.

## Custom retry conditions

`shouldRetry` is an optional predicate that can further restrict retries.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 3,
    shouldRetry({ error, attempt, maxAttempts, requestId, method }) {
      return attempt < 1; // only ever retry once
    },
  },
});
```

It receives:

```ts
type RetryPredicateContext = {
  error: Error;
  attempt: number;
  maxAttempts: number;
  requestId: string;
  method: RequestMethod;
};
```

The predicate runs **only after** the built-in rules already decided the request is retryable. That ordering is deliberate:

- returning `false` stops retries
- returning `true` keeps the built-in decision
- it can never make non-retryable failures retryable — validation errors and `4xx` responses stay non-retryable regardless of what the predicate returns

Retry decisions are evaluated in this order:

1. attempts remaining
2. method is in `retryMethods`
3. `POST` / `PATCH` require `idempotencyKey`
4. error type matches `retryOn`
5. `shouldRetry`, when configured
6. retry budget (`maxElapsedMs`)

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

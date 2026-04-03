# Observability

`@dfsync/client` provides built-in request lifecycle metadata for better visibility and debugging.

Each request exposes:

- **requestId** — stable identifier across retries
- **attempt / maxAttempts** — retry progress
- **startedAt / endedAt / durationMs** — timing information
- **retryReason** — why a retry happened (`network-error`, `5xx`, `429`)
- **retryDelayMs** — delay before the next retry
- **retrySource** — delay source (`backoff` or `retry-after`)

### Example

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryOn: ['5xx'],
  },
  hooks: {
    onRetry(ctx) {
      console.log({
        requestId: ctx.requestId,
        attempt: ctx.attempt,
        maxAttempts: ctx.maxAttempts,
        delay: ctx.retryDelayMs,
        reason: ctx.retryReason,
        source: ctx.retrySource,
      });
    },
  },
});
```

This makes it easier to understand:

- what happened during a request
- how retries behaved
- how long requests actually took

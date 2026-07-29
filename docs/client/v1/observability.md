# Observability

`@dfsync/client` provides built-in request lifecycle metadata for better visibility and debugging.

Each request exposes:

- **requestId** — stable identifier across retries
- **operationName** — optional human-readable operation label, when the request provides it
- **attempt / maxAttempts** — retry progress
- **startedAt / endedAt / durationMs** — timing information
- **validation** — response validation metadata in `afterResponse`, when validation is configured
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
- whether response validation ran and passed
- how retries behaved
- how long requests actually took

## Grouping requests with operationName

`requestId` identifies one request. `operationName` identifies the kind of request, which is what you usually want to aggregate on in metrics and traces.

```ts
await client.get('/users', {
  operationName: 'listUsers',
});
```

Every lifecycle hook receives it, so a single hook can label all telemetry:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    afterResponse({ operationName, durationMs }) {
      console.log('http.client.duration', {
        operation: operationName ?? 'unknown',
        durationMs,
      });
    },
  },
});
```

See **Create Client** for details.

## Metadata on errors

Lifecycle metadata is not limited to hooks. Every error thrown from the request lifecycle carries `requestId`, `attempt`, and `durationMs`, so you can correlate a failure at the call site without wiring an `onError` hook.

```ts
import { DfsyncError } from '@dfsync/client';

try {
  await client.get('/users');
} catch (error) {
  if (error instanceof DfsyncError) {
    console.error(error.requestId, error.attempt, error.durationMs);
  }
}
```

See **Errors** for the full list.

## Telemetry exporters

For a structured telemetry sink instead of ad-hoc hooks, implement a `TelemetryExporter` and map it onto the client with `createTelemetryHooks`.

```ts
import { createClient, createTelemetryHooks } from '@dfsync/client';
import type { TelemetryExporter } from '@dfsync/client';

const exporter: TelemetryExporter = {
  onRequestStart(ctx) {
    console.log('start', ctx.operationName, ctx.requestId);
  },
  onRequestSuccess(ctx) {
    console.log('done', ctx.operationName, ctx.durationMs);
  },
  onRequestError(ctx) {
    console.error('error', ctx.requestId, ctx.error);
  },
  onRequestRetry(ctx) {
    console.warn('retry', ctx.requestId, ctx.retryReason);
  },
};

const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: createTelemetryHooks(exporter),
});
```

Exporter methods receive the same context objects as the corresponding hooks, so nothing new is exposed — it is the same metadata behind a stable interface.

See **Extensibility** for the exporter contract.

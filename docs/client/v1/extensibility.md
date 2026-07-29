# Extensibility

`@dfsync/client` exposes a small, stable set of interfaces for extending the client. They are intentionally minimal and built on the existing request lifecycle, so extensions never introduce a separate runtime path.

There are four extension points:

| Interface           | Configured via         | Purpose                            |
| ------------------- | ---------------------- | ---------------------------------- |
| `AuthProvider`      | `auth.apply`           | apply authentication to a request  |
| `ValidationAdapter` | `responseSchema`       | validate parsed response data      |
| `RetryPredicate`    | `retry.shouldRetry`    | further restrict retry decisions   |
| `TelemetryExporter` | `createTelemetryHooks` | observe the full request lifecycle |

## Auth provider

`AuthProvider` is the contract behind `{ type: 'custom' }` auth. It applies authentication by mutating the request headers or URL through the provided `AuthContext`.

```ts
type AuthContext = {
  request: RequestConfig;
  url: URL;
  headers: Record<string, string>;
};

type AuthProvider = (ctx: AuthContext) => void | Promise<void>;
```

```ts
import { createClient } from '@dfsync/client';
import type { AuthProvider } from '@dfsync/client';

const serviceAuth: AuthProvider = async ({ headers, url }) => {
  headers['x-service-name'] = 'billing-worker';
  url.searchParams.set('tenant', 'acme');
};

const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'custom',
    apply: serviceAuth,
  },
});
```

Auth runs before `beforeRequest` hooks, so hooks can still see and modify whatever the provider produced.

See **Auth** for the built-in `bearer` and `apiKey` strategies.

## Validation adapter

`ValidationAdapter` is the `safeParse`-style contract used by `responseSchema`. It receives the parsed response data and returns a `ValidationResult`.

```ts
type ValidationResult<TData = unknown> = {
  success: boolean;
  data?: TData;
  error?: unknown;
};

type ValidationAdapter<TData = unknown> = (
  data: unknown,
) => ValidationResult<TData> | Promise<ValidationResult<TData>>;
```

Adapters are lightweight wrappers around a schema library and add no runtime dependency to the core package.

```ts
import type { ValidationAdapter } from '@dfsync/client';

const userSchema: ValidationAdapter = (data) => {
  const ok = typeof data === 'object' && data !== null && 'id' in data;

  return ok ? { success: true } : { success: false, error: 'missing id' };
};

const client = createClient({
  baseUrl: 'https://api.example.com',
  responseSchema: userSchema,
});
```

When `success` is `false`, the client throws `ValidationError` and exposes the adapter's `error` on `error.issues`.

See **Response Handling** for `responseSchema`, precedence rules, and the ready-made zod adapter.

## Retry policy

`RetryPredicate` is the contract for custom retry conditions, configured as `retry.shouldRetry`.

```ts
type RetryPredicateContext = {
  error: Error;
  attempt: number;
  maxAttempts: number;
  requestId: string;
  method: RequestMethod;
};

type RetryPredicate = (ctx: RetryPredicateContext) => boolean;
```

```ts
import type { RetryPredicate } from '@dfsync/client';

const retryOnlyOnce: RetryPredicate = ({ attempt }) => attempt < 1;

const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 3,
    shouldRetry: retryOnlyOnce,
  },
});
```

The predicate runs only after the built-in rules already decided a request is retryable. It can restrict retries, but it can never make non-retryable errors retryable.

See **Retry** for the full retry model.

## Telemetry exporter

`TelemetryExporter` is a telemetry sink that observes the request lifecycle. Each method receives the same context object as the corresponding lifecycle hook, so no internal state is exposed.

```ts
type TelemetryExporter = {
  onRequestStart?(ctx: BeforeRequestContext): void | Promise<void>;
  onRequestSuccess?(ctx: AfterResponseContext): void | Promise<void>;
  onRequestError?(ctx: ErrorContext): void | Promise<void>;
  onRequestRetry?(ctx: RetryContext): void | Promise<void>;
};
```

Exporters do not run themselves. Map an exporter onto the client's `hooks` with `createTelemetryHooks`:

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
    console.warn('retry', ctx.requestId, ctx.retryReason, ctx.retryDelayMs);
  },
};

const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: createTelemetryHooks(exporter),
});
```

All exporter methods are optional. Only the methods you define are wired to hooks:

| Exporter method    | Hook            |
| ------------------ | --------------- |
| `onRequestStart`   | `beforeRequest` |
| `onRequestSuccess` | `afterResponse` |
| `onRequestError`   | `onError`       |
| `onRequestRetry`   | `onRetry`       |

### Combining telemetry with your own hooks

`createTelemetryHooks` returns a standard `HooksConfig`, and every hook accepts a single function or an array. That means telemetry composes with application hooks:

```ts
import { createClient, createTelemetryHooks } from '@dfsync/client';
import type { ErrorContext, TelemetryExporter } from '@dfsync/client';

const reportError = (ctx: ErrorContext) => {
  console.error(ctx.error);
};

const exporter: TelemetryExporter = {
  onRequestError: reportError,
};

const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    ...createTelemetryHooks(exporter),
    onError: [reportError, ({ requestId }) => console.error('audit', requestId)],
  },
});
```

### Error behavior in exporters

Because exporters run as hooks, they inherit hook error semantics:

- a throwing `onRequestStart` prevents the request from being sent, and the error is rethrown
- a throwing `onRequestSuccess` is rethrown to the caller
- a throwing `onRequestError` or `onRequestRetry` never hides the original request failure

Keep exporters non-throwing so telemetry cannot change request behavior.

## Why these interfaces

Each extension point maps onto a stage the client already has:

1. auth → `AuthProvider`
2. retry decision → `RetryPredicate`
3. response validation → `ValidationAdapter`
4. lifecycle observation → `TelemetryExporter`

This keeps the public surface small and the request lifecycle predictable.

## Related guides

- See **Auth** for built-in auth strategies
- See **Response Handling** for `responseSchema` and the zod adapter
- See **Retry** for retry conditions and the retry budget
- See **Hooks** for the underlying lifecycle mechanism
- See **Observability** for the metadata exporters receive
- See **Serialization** for `serializeBody` and `parseResponse`

# Create Client

Use `createClient` to create a reusable HTTP client instance.

It provides a consistent way to configure:

- base URL and default headers
- timeouts and retries
- auth
- lifecycle hooks
- request observability metadata
- response validation
- body serialization and response parsing

## Basic client

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
});
```

## Client with timeout

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
});
```

## Client with default headers

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  headers: {
    'x-service-name': 'billing-worker',
  },
});
```

## Client with custom fetch

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  fetch: globalThis.fetch,
});
```

## Client configuration

```ts
type ClientConfig = {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  fetch?: typeof globalThis.fetch;
  auth?: {
    // see Auth section
  };
  hooks?: {
    // see Hooks section
  };
  retry?: RetryConfig;
  validateResponse?: ResponseValidator;
  responseSchema?: ValidationAdapter;
  serializeBody?: BodySerializer;
  parseResponse?: ResponseParser;
};
```

Hook configuration supports:

- `beforeRequest`
- `afterResponse`
- `onError`
- `onRetry`

Retry configuration supports:

- retry attempts
- retry conditions
- backoff strategy
- `Retry-After` handling
- jitter and an overall retry budget
- a custom `shouldRetry` predicate

## HTTP methods

The client provides a predictable set of methods:

```text
client.get(path, options?)
client.delete(path, options?)

client.post(path, body?, options?)
client.put(path, body?, options?)
client.patch(path, body?, options?)

client.request(config)
```

### Body vs options

- `get` and `delete` do not accept body
- `post`, `put`, and `patch` accept request body as the second argument
- `options` is used for headers, query, timeout, retry, validation, idempotency keys, and other settings

## GET request

```ts
type User = {
  id: string;
  name: string;
};

const user = await client.get<User>('/users/1');
```

## GET with query params

```ts
const users = await client.get('/users', {
  query: {
    page: 1,
    active: true,
  },
});
```

## POST request

```ts
const created = await client.post('/users', {
  name: 'Tom',
  email: 'tom@example.com',
});
```

## PUT request

```ts
const updated = await client.put('/users/1', {
  name: 'Tom Updated',
});
```

## PATCH request

```ts
const updatedUser = await client.patch('/users/1', {
  name: 'Jane',
});
```

## DELETE request

```ts
const result = await client.delete('/users/1');
```

## Request options

```ts
type RequestOptions = {
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: RetryConfig;
  signal?: AbortSignal;
  requestId?: string;
  operationName?: string;
  idempotencyKey?: string;
  validateResponse?: ResponseValidator;
  responseSchema?: ValidationAdapter;
  serializeBody?: BodySerializer;
  parseResponse?: ResponseParser;
};
```

`requestId` can be provided explicitly when you want to correlate logs or trace a request across services.

`operationName` labels the request with a stable, human-readable name for logging and tracing.

Request-level `retry` overrides client-level retry settings.

Request-level validation, serialization, and parsing options override their client-level counterparts.

## Low-level request

```ts
const result = await client.request({
  method: 'POST',
  path: '/events',
  body: {
    type: 'user.created',
  },
  requestId: 'req-123',
  timeout: 3000,
});
```

If both `requestId` and `x-request-id` header are provided, `x-request-id` takes precedence.

### Request Config

```ts
type RequestConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: RetryConfig;
  signal?: AbortSignal;
  requestId?: string;
  operationName?: string;
  idempotencyKey?: string;
  validateResponse?: ResponseValidator;
  responseSchema?: ValidationAdapter;
  serializeBody?: BodySerializer;
  parseResponse?: ResponseParser;
};
```

## Request context

Each request attempt is executed within a request context that contains:

- `requestId` — stable identifier for the full request lifecycle
- `operationName` — optional human-readable operation label, present only when provided
- `attempt` — current retry attempt (zero-based)
- `maxAttempts` — total number of allowed attempts, including the initial request
- `signal` — AbortSignal for cancellation
- `startedAt` — request start timestamp

Completed attempts may also expose:

- `endedAt` — request end timestamp
- `durationMs` — total duration for the current attempt

Retry-specific contexts may also expose:

- `retryDelayMs`
- `retryReason`
- `retrySource`

This context is available through lifecycle hooks.

## Request ID

Each request has a `requestId` that is:

- automatically generated by default
- can be overridden per request
- propagated via the `x-request-id` header
- remains stable across retries

This allows tracing requests across services.

It also makes retries easier to correlate in logs and monitoring systems.

### Example

```ts
await client.get('/users', {
  requestId: 'req_123',
});
```

You can also override the header directly:

```ts
await client.get('/users', {
  headers: {
    'x-request-id': 'custom-id',
  },
});
```

## Operation name

Use `operationName` to attach a stable, human-readable label to a request.

```ts
await client.get('/users', {
  operationName: 'listUsers',
});
```

Unlike `requestId`, which identifies a single request, `operationName` identifies the _kind_ of request. That makes it useful for grouping logs, metrics, and traces across many executions of the same call.

It is part of the request context and is exposed in every lifecycle hook:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    afterResponse({ operationName, requestId, durationMs }) {
      console.log(operationName, requestId, durationMs);
      // 'listUsers' 'k3f9x2' 42
    },
  },
});
```

`operationName` is not sent as a header. It stays inside the client lifecycle, so you decide how to expose it.

When it is not provided, the field is absent from the hook context rather than set to `undefined`.

## Idempotency key

Use `idempotencyKey` for non-idempotent operations that may be retried safely.

```ts
await client.post(
  '/payments',
  { amount: 100 },
  {
    idempotencyKey: 'payment-123',
  },
);
```

This adds:

```http
idempotency-key: payment-123
```

If both `idempotencyKey` and an explicit `idempotency-key` header are provided, the explicit header takes precedence.

`POST` and `PATCH` requests are retried only when the method is included in `retry.retryMethods` and the request provides `idempotencyKey`.

## Response validation

Use `validateResponse` to validate parsed response data before it is returned.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  validateResponse(data) {
    return typeof data === 'object' && data !== null && 'id' in data;
  },
});
```

You can override validation per request:

```ts
await client.get('/users/1', {
  validateResponse(data) {
    return typeof data === 'object' && data !== null && 'email' in data;
  },
});
```

Returning `false` throws `ValidationError`. Returning `true` or `undefined` passes validation.

For schema-based validation, use `responseSchema` instead — it accepts a `safeParse`-style adapter and ships with a ready-made zod adapter:

```ts
import { z } from 'zod';
import { zodAdapter } from '@dfsync/client/adapters/zod';

const client = createClient({
  baseUrl: 'https://api.example.com',
  responseSchema: zodAdapter(z.object({ id: z.string() })),
});
```

See **Response Handling** for both validation styles and their precedence rules.

## Request cancellation

Requests can be cancelled using `AbortSignal`:

```ts
const controller = new AbortController();

const promise = client.get('/users', {
  signal: controller.signal,
});

controller.abort();
```

Cancellation is treated differently from timeouts:

- timeout → `TimeoutError`
- manual cancellation → `RequestAbortedError`

## Header behavior

Headers are resolved as part of the request lifecycle in the following order:

1. default headers
2. client headers
3. request headers
4. auth modifications
5. beforeRequest hook modifications

This means request-level headers override client-level headers, and auth can still overwrite auth-related header values.

## Timeout behavior

Timeout is resolved as part of the request lifecycle:

1. request-level timeout
2. client-level timeout
3. default timeout: `5000`

## Response parsing

Responses are parsed automatically during the response phase:

- `application/json` → parsed JSON
- other content types → text
- `204 No Content` → `undefined`

You can replace this with a custom `parseResponse`. See **Serialization**.

## Body behavior

If request body is an object, the client:

- serializes it with `JSON.stringify(...)`
- sets `content-type: application/json` only if you did not set it yourself

If request body is a string, the client:

- sends it as-is
- does not force a `content-type`

You can replace this with a custom `serializeBody`. See **Serialization**.

## Retry observability

Retries can be observed using lifecycle hooks.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryOn: ['5xx', '429'],
    backoff: 'exponential',
    baseDelayMs: 300,
  },
  hooks: {
    onRetry({ requestId, attempt, maxAttempts, retryDelayMs, retryReason, retrySource }) {
      console.log({
        requestId,
        attempt,
        maxAttempts,
        retryDelayMs,
        retryReason,
        retrySource,
      });
    },
  },
});
```

This is useful for logging, monitoring, and debugging retry behavior.

## Retry-After support

When a retryable response includes a `Retry-After` header, `@dfsync/client` uses that value before falling back to the configured backoff strategy.

Supported formats:

- seconds
- HTTP-date

If the header value is invalid, `@dfsync/client` falls back to normal retry backoff.

## Related guides

- See **Hooks** for lifecycle hooks and observability metadata
- See **Response Handling** for parsing and response validation
- See **Serialization** for `serializeBody` and `parseResponse`
- See **Retry** for retry conditions, backoff, jitter, and the retry budget
- See **Errors** for failure behavior, error types, and error metadata
- See **Extensibility** for the stable extension interfaces

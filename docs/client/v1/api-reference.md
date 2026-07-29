# API Reference

## Exports

```ts
import {
  createClient,
  createTelemetryHooks,
  DfsyncError,
  HttpError,
  NetworkError,
  TimeoutError,
  ValidationError,
  RequestAbortedError,
} from '@dfsync/client';
```

Subpath exports:

```ts
import { zodAdapter } from '@dfsync/client/adapters/zod';
```

## createClient

Creates a configured HTTP client.

```ts
import { createClient } from '@dfsync/client';

const client = createClient({ baseUrl: 'https://api.example.com' });
```

## createTelemetryHooks

Maps a `TelemetryExporter` onto a `HooksConfig`.

```ts
import { createClient, createTelemetryHooks } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: createTelemetryHooks(exporter),
});
```

## Client methods

```text
client.get(path, options?)
client.delete(path, options?)

client.post(path, body?, options?)
client.put(path, body?, options?)
client.patch(path, body?, options?)

client.request(config)
```

## Configuration

| Option             | Type                    | Description                       |
| ------------------ | ----------------------- | --------------------------------- |
| `baseUrl`          | `string`                | required base URL                 |
| `timeout`          | `number`                | request timeout, default `5000`   |
| `headers`          | `Record<string,string>` | default headers                   |
| `fetch`            | `typeof fetch`          | custom fetch implementation       |
| `auth`             | `AuthConfig`            | auth strategy                     |
| `hooks`            | `HooksConfig`           | lifecycle hooks                   |
| `retry`            | `RetryConfig`           | retry policy                      |
| `validateResponse` | `ResponseValidator`     | predicate response validation     |
| `responseSchema`   | `ValidationAdapter`     | schema-based response validation  |
| `serializeBody`    | `BodySerializer`        | custom request body serialization |
| `parseResponse`    | `ResponseParser`        | custom response parsing           |

## Request options

| Option             | Type                | Description                      |
| ------------------ | ------------------- | -------------------------------- |
| `query`            | `QueryParams`       | query string values              |
| `headers`          | `HeadersMap`        | request headers                  |
| `timeout`          | `number`            | per-request timeout              |
| `retry`            | `RetryConfig`       | per-request retry policy         |
| `signal`           | `AbortSignal`       | external cancellation            |
| `requestId`        | `string`            | explicit request identifier      |
| `operationName`    | `string`            | human-readable operation label   |
| `idempotencyKey`   | `string`            | idempotency key for safe retries |
| `validateResponse` | `ResponseValidator` | per-request predicate validation |
| `responseSchema`   | `ValidationAdapter` | per-request schema validation    |
| `serializeBody`    | `BodySerializer`    | per-request body serialization   |
| `parseResponse`    | `ResponseParser`    | per-request response parsing     |

`client.request(config)` additionally takes `method`, `path`, and `body`.

## Retry

| Option         | Type               | Default                    |
| -------------- | ------------------ | -------------------------- |
| `attempts`     | `number`           | `0`                        |
| `backoff`      | `RetryBackoff`     | `'exponential'`            |
| `baseDelayMs`  | `number`           | `300`                      |
| `retryOn`      | `RetryCondition[]` | `['network-error', '5xx']` |
| `retryMethods` | `RequestMethod[]`  | `['GET', 'PUT', 'DELETE']` |
| `jitter`       | `boolean`          | `false`                    |
| `maxElapsedMs` | `number`           | not set                    |
| `shouldRetry`  | `RetryPredicate`   | not set                    |

```ts
type RetryCondition = 'network-error' | '5xx' | '429';
type RetryBackoff = 'fixed' | 'exponential';

type RetryPredicateContext = {
  error: Error;
  attempt: number;
  maxAttempts: number;
  requestId: string;
  method: RequestMethod;
};

type RetryPredicate = (ctx: RetryPredicateContext) => boolean;
```

## Response validation

```ts
type ResponseValidator<TData = unknown> = (data: TData) => boolean | void | Promise<boolean | void>;

type ValidationResult<TData = unknown> = {
  success: boolean;
  data?: TData;
  error?: unknown;
};

type ValidationAdapter<TData = unknown> = (
  data: unknown,
) => ValidationResult<TData> | Promise<ValidationResult<TData>>;
```

Precedence: request `responseSchema` → request `validateResponse` → client `responseSchema` → client `validateResponse`.

## Serialization

```ts
type SerializerContext = {
  request: RequestConfig;
  requestId: string;
};

type SerializedBody = {
  body: BodyInit;
  contentType?: string;
};

type BodySerializer = (
  body: unknown,
  ctx: SerializerContext,
) => SerializedBody | Promise<SerializedBody>;

type ResponseParser = (response: Response, ctx: SerializerContext) => unknown | Promise<unknown>;
```

## Hooks

- `beforeRequest`
- `afterResponse`
- `onError`
- `onRetry`

Each accepts a single function or an array of functions.

```ts
type RetrySource = 'backoff' | 'retry-after';
```

## Telemetry

```ts
type TelemetryExporter = {
  onRequestStart?(ctx: BeforeRequestContext): void | Promise<void>;
  onRequestSuccess?(ctx: AfterResponseContext): void | Promise<void>;
  onRequestError?(ctx: ErrorContext): void | Promise<void>;
  onRequestRetry?(ctx: RetryContext): void | Promise<void>;
};
```

## Auth

```ts
type AuthContext = {
  request: RequestConfig;
  url: URL;
  headers: Record<string, string>;
};

type AuthProvider = (ctx: AuthContext) => void | Promise<void>;
```

Strategies: `bearer`, `apiKey`, `custom`.

## Errors

- `DfsyncError` — base class, carries `code`, optional `cause`, and `requestId` / `attempt` / `durationMs`
- `HttpError` — non-2xx responses
- `NetworkError` — network failures
- `TimeoutError` — request timed out
- `ValidationError` — response validation failed, exposes optional `issues`
- `RequestAbortedError` — request was cancelled

## Exported types

Client and requests:

- `Client`
- `ClientConfig`
- `RequestConfig`
- `RequestOptions`
- `RequestMethod`

Retry:

- `RetryConfig`
- `RetryCondition`
- `RetryBackoff`
- `RetryPredicate`
- `RetryPredicateContext`

Validation:

- `ResponseValidator`
- `ValidationAdapter`
- `ValidationResult`

Serialization:

- `BodySerializer`
- `ResponseParser`
- `SerializedBody`
- `SerializerContext`

Auth:

- `AuthConfig`
- `AuthContext`
- `AuthProvider`

Hooks and telemetry:

- `HooksConfig`
- `HookBeforeRequest`
- `HookAfterResponse`
- `HookOnError`
- `HookOnRetry`
- `BeforeRequestContext`
- `AfterResponseContext`
- `ErrorContext`
- `RetryContext`
- `RetrySource`
- `TelemetryExporter`

# API Reference

## createClient

Creates a configured HTTP client.

```ts
import { createClient } from '@dfsync/client';
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

- `baseUrl`
- `timeout`
- `headers`
- `fetch`
- `retry`
- `auth`
- `hooks`
- `validateResponse`

## Request options

- `query`
- `headers`
- `timeout`
- `retry`
- `signal`
- `requestId`
- `idempotencyKey`
- `validateResponse`

## Retry

- `attempts`
- `backoff`
- `baseDelayMs`
- `retryOn`
- `retryMethods`

## Response validation

```ts
type ResponseValidator<TData = unknown> = (data: TData) => boolean | void | Promise<boolean | void>;
```

## Hooks

- `beforeRequest`
- `afterResponse`
- `onError`
- `onRetry`

## Errors

- `HttpError`
- `NetworkError`
- `TimeoutError`
- `ValidationError`
- `RequestAbortedError`

## Exported types

- `AuthConfig`
- `Client`
- `ClientConfig`
- `RetryConfig`
- `RetryCondition`
- `RetryBackoff`
- `ResponseValidator`
- `BeforeRequestContext`
- `AfterResponseContext`
- `ErrorContext`
- `RetryContext`
- `HooksConfig`
- `RequestConfig`
- `RequestOptions`

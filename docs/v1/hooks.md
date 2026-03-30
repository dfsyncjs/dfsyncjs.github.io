# Hooks

Hooks allow you to extend and observe the request lifecycle.

Supported hooks:

- `beforeRequest`
- `afterResponse`
- `onError`
- `onRetry`

Each hook can be:

- a single function
- an array of functions

Hooks run sequentially in the order you provide them.

## Request metadata

Hooks receive structured lifecycle metadata, including request details, retry information, and timing fields.

Available metadata includes:

- `requestId` — stable across retries
- `attempt`
- `maxAttempts`
- `startedAt`
- `endedAt`
- `durationMs`

Retry-specific hooks also expose:

- `retryDelayMs`
- `retryReason`
- `retrySource`

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: (ctx) => {
      console.log(ctx.requestId, ctx.attempt);
    },
  },
});
```

## beforeRequest

Use `beforeRequest` to mutate headers or the final request URL before `fetch` is called.

### Add headers

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: ({ headers }) => {
      headers['x-request-id'] = crypto.randomUUID();
    },
  },
});
```

### Modify query params

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: ({ url }) => {
      url.searchParams.set('trace', '1');
    },
  },
});
```

### Async beforeRequest

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: async ({ headers }) => {
      const token = await Promise.resolve('abc');
      headers['x-async-token'] = token;
    },
  },
});
```

### Multiple beforeRequest hooks

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: [
      ({ headers }) => {
        headers['x-step-1'] = 'done';
      },
      ({ headers }) => {
        headers['x-step-2'] = `${headers['x-step-1']}-next`;
      },
    ],
  },
});
```

If one `beforeRequest` hook throws, the request is not sent and the original error is rethrown.

### beforeRequest context

```text
request, url, headers, signal, attempt, maxAttempts, requestId, startedAt
```

## afterResponse

Use `afterResponse` to inspect successful responses after parsing.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    afterResponse: ({ response, data }) => {
      console.log(response.status);
      console.log(data);
    },
  },
});
```

### Multiple beforeRequest hooks

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    afterResponse: [
      ({ data }) => {
        console.log('first hook', data);
      },
      () => {
        console.log('second hook');
      },
    ],
  },
});
```

If an `afterResponse` hook throws, that hook error is rethrown.

### afterResponse context

```text
request, url, headers, signal, attempt, maxAttempts, requestId, startedAt, endedAt, durationMs, response, data
```

## onError

Use `onError` to observe failed requests.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    onError: ({ error }) => {
      console.error('request failed', error);
    },
  },
});
```

onError runs for:

- HttpError
- NetworkError
- TimeoutError

### Important behavior

If an `onError` hook itself throws, the original request error is preserved.

This is intentional, so hook failures never hide the real request failure.

### onError context

```text
request, url, headers, signal, attempt, maxAttempts, requestId, startedAt, endedAt, durationMs, error
```

## onRetry

Use `onRetry` to observe retry behavior before the next attempt is executed.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryOn: ['5xx', '429'],
  },
  hooks: {
    onRetry: ({ requestId, attempt, maxAttempts, retryDelayMs, retryReason, retrySource }) => {
      console.log(
        `[${requestId}] retry ${attempt + 1}/${maxAttempts} in ${retryDelayMs}ms`,
        retryReason,
        retrySource,
      );
    },
  },
});
```

`onRetry` runs only when a retry will actually happen.

### onRetry context

```text
request, url, headers, signal, attempt, maxAttempts, requestId, startedAt, endedAt, durationMs, error, retryDelayMs, retryReason, retrySource
```

## Hook context summary

All hooks receive request lifecycle metadata.

Common fields:

```text
request, url, headers, signal, attempt, maxAttempts, requestId, startedAt
```

Additional fields:

- `afterResponse` → `endedAt`, `durationMs`, `response`,`data`
- `onError` → `endedAt`, `durationMs`, `error`
- `onRetry` → `endedAt`, `durationMs`, `error`, `retryDelayMs`, `retryReason`, `retrySource`

## Hook order

Request lifecycle order is:

1. auth
2. `beforeRequest`
3. fetch execution
4. response parsing
5. `afterResponse` on success

Retry flow:

1. auth
2. `beforeRequest`
3. fetch execution
4. retry decision
5. `onRetry` before the next attempt
6. next retry attempt

Failure flow:

1. auth
2. `beforeRequest`
3. fetch execution
4. retry loop (if enabled)
5. `onError` on final failure

## Hook config example

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: [
      ({ headers }) => {
        headers['x-service'] = 'gateway';
      },
      ({ headers }) => {
        headers['x-request-id'] = crypto.randomUUID();
      },
    ],
    afterResponse: ({ response }) => {
      console.log('status:', response.status);
    },
    onError: ({ error }) => {
      console.error(error);
    },
  },
});
```

## Note

Use hooks for infrastructure concerns instead of duplicating logic across your application.

# Hooks

Hooks allow you to extend the behavior of the HTTP client during the request lifecycle.

Supported hooks:

- `beforeRequest`
- `afterResponse`
- `onError`

Each hook can be:

- a single function
- an array of functions

Hooks run sequentially in the order you provide them.

## Request metadata

Hooks receive a rich lifecycle context, including request metadata and execution details.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: {
    beforeRequest: (ctx) => {
      console.log(ctx.requestId, ctx.attempt);
    },
    onError: (ctx) => {
      console.error(ctx.requestId, ctx.error);
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

## Hook context

### beforeRequest context

```text
request, url, headers
```

### afterResponse context

```text
request, url, headers, response, data
```

### onError context

```text
request, url, headers, error
```

## Hook order

Request lifecycle order is:

1. auth
2. `beforeRequest`
3. fetch
4. response parsing
5. `afterResponse` on success
6. `onError` on failure

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

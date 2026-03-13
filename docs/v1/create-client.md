# Create Client

Use `createClient` to create a reusable HTTP client instance.

## Basic client

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseURL: 'https://api.example.com',
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
};
```

## Supported request methods

The client provides these convenience methods:

- client.get(path, options?)
- client.post(path, body?, options?)
- client.put(path, body?, options?)
- client.delete(path, options?)

It also provides:

- client.request(config)

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

## DELETE request

```ts
const result = await client.delete('/users/1');
```

## Low-level request API

```ts
const result = await client.request({
  method: 'POST',
  path: '/events',
  body: {
    type: 'user.created',
  },
  headers: {
    'x-request-id': 'req-123',
  },
  timeout: 3000,
});
```

## Request options

For `get()` and `delete()`:

```ts
type RequestOptions = {
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  timeout?: number;
};
```

For `request()`:

```ts
type RequestConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
};
```

## Header behavior

Headers are merged in this order:

1. default headers
2. client headers
3. request headers
4. auth modifications
5. beforeRequest hook modifications

That means request-level headers override client-level headers, and auth can still overwrite auth-related header values.

## Timeout behavior

Timeout is resolved in this order:

1. request-level timeout
2. client-level timeout
3. default timeout: `5000`

## Response parsing

Responses are parsed automatically:

- `application/json` → parsed JSON
- other content types → text
- `204 No Content` → `undefined`

## Body behavior

If request body is an object, the client:

- serializes it with `JSON.stringify(...)`
- sets `content-type: application/json` only if you did not set it yourself

If request body is a string, the client:

- sends it as-is
- does not force a `content-type`

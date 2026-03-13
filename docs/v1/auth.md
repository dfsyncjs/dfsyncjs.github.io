# Auth

`@dfsync/client` supports three auth strategies:

- bearer token
- API key
- custom auth

Auth is configured once at client creation time.

## Bearer token

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'bearer',
    token: 'secret-token',
  },
});
```

This adds:

```http
authorization: Bearer secret-token
```

## Async bearer token

You can resolve the token lazily:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'bearer',
    token: async () => {
      return process.env.API_TOKEN!;
    },
  },
});
```

## Custom bearer header name

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'bearer',
    token: 'secret-token',
    headerName: 'x-authorization',
  },
});
```

## API key in header

By default, API key auth uses header mode and the header name `x-api-key`.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'apiKey',
    value: 'api-key-123',
  },
});
```

This adds:

```http
x-api-key: api-key-123
```

## Async API key resolver

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'apiKey',
    value: async () => {
      return process.env.API_KEY!;
    },
  },
});
```

## Custom API key header name

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'apiKey',
    value: 'api-key-123',
    name: 'x-service-key',
  },
});
```

## API key in query string

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'apiKey',
    value: 'query-key',
    in: 'query',
    name: 'api_key',
  },
});
```

A request like:

```ts
await client.get('/users', {
  query: { page: 1 },
});
```

becomes:

```text
https://api.example.com/users?page=1&api_key=query-key
```

## Custom auth

Use custom auth when you need full control over headers and URL mutation.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'custom',
    apply: ({ headers, url, request }) => {
      headers['x-service-name'] = 'billing-worker';
      url.searchParams.set('tenant', 'acme');
    },
  },
});
```

## Auth context

Custom auth receives:

```ts
{
  request,
  url,
  headers
}
```

This lets you inspect the request and modify the final URL or headers before the request is sent.

## Auth execution order

Auth runs before `beforeRequest` hooks.

That means `beforeRequest` hooks can see and further modify headers or query params already produced by auth.

## Auth precedence

If auth writes to a header that already exists, auth wins.

Example:

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  headers: {
    authorization: 'Bearer old-token',
  },
  auth: {
    type: 'bearer',
    token: 'new-token',
  },
});
```

Final header:

```http
authorization: Bearer new-token
```

## Auth config reference

```ts
type AuthValueResolver = string | (() => string | Promise<string>);

type BearerAuthConfig = {
  type: 'bearer';
  token: AuthValueResolver;
  headerName?: string;
};

type ApiKeyAuthConfig = {
  type: 'apiKey';
  value: AuthValueResolver;
  in?: 'header' | 'query';
  name?: string;
};

type CustomAuthConfig = {
  type: 'custom';
  apply: (ctx: {
    request: RequestConfig;
    url: URL;
    headers: Record<string, string>;
  }) => void | Promise<void>;
};
```

## Common use cases

- internal service authentication
- bearer tokens
- API tokens
- integration services

## Why configure auth on the client?

Centralizing authentication inside the client configuration provides:

- consistent authentication across requests
- cleaner application code
- easier token rotation or refresh logic

## Notes

Keep auth logic centralized in the client configuration instead of repeating it in every request.

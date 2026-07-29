# Response Handling

`@dfsync/client` parses successful and failed HTTP responses before returning data or throwing an error.

Response handling has three steps:

1. parse the response body
2. throw `HttpError` for non-2xx responses
3. validate successful response data when validation is configured

## Response parsing

Responses are parsed automatically:

- `application/json` responses are parsed with `response.json()`
- other response types are returned as text
- `204 No Content` returns `undefined`

```ts
const user = await client.get<User>('/users/1');
```

The generic type controls the TypeScript return type. Runtime validation is separate and only runs when you configure `validateResponse` or `responseSchema`.

You can replace the default parsing entirely with `parseResponse`. See **Serialization**.

## Failed HTTP responses

For non-2xx responses, the client parses the response body first and throws `HttpError`.

```ts
import { HttpError } from '@dfsync/client';

try {
  await client.get('/users/unknown');
} catch (error) {
  if (error instanceof HttpError) {
    console.log(error.status);
    console.log(error.data);
  }
}
```

`validateResponse` does not run for non-2xx responses.

## Response validation

There are two ways to validate a successful response:

- `validateResponse` — a boolean predicate, best for small inline checks
- `responseSchema` — a `safeParse`-style adapter, best for schema libraries such as zod

Both run only after a successful HTTP response, and both fail with `ValidationError`.

## validateResponse

Use `validateResponse` when a successful HTTP response still needs a runtime shape check before your application uses it.

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  validateResponse(data) {
    return typeof data === 'object' && data !== null && 'id' in data;
  },
});

const user = await client.get('/users/1');
```

The validator receives parsed response data.

Validation passes when the validator:

- returns `true`
- returns `undefined`

Validation fails when the validator returns `false`.

Return `false` for expected validation failures. If the validator itself throws, that error follows the normal request error path instead of becoming `ValidationError`.

## Async validation

Validators can be async.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  async validateResponse(data) {
    return typeof data === 'object' && data !== null && 'id' in data;
  },
});
```

## Request-level validation

You can override client-level validation for one request.

```ts
await client.get('/users/1', {
  validateResponse(data) {
    return typeof data === 'object' && data !== null && 'email' in data;
  },
});
```

Request-level `validateResponse` takes precedence over client-level `validateResponse`.

## Schema adapters

For richer validation, `responseSchema` accepts a `safeParse`-style adapter that returns a `ValidationResult`.

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

The adapter receives the parsed response data. When `success` is `false`, the client throws `ValidationError` and exposes the adapter's `error` on `error.issues`.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  responseSchema(data) {
    const ok = typeof data === 'object' && data !== null && 'id' in data;

    return ok ? { success: true } : { success: false, error: 'missing id' };
  },
});
```

This is the contract that schema-library adapters build on.

Adapters can be async, and `responseSchema` can also be set per request:

```ts
await client.get('/users/1', {
  responseSchema: (data) => ({ success: 'email' in (data as object) }),
});
```

### Validation does not transform the response

`ValidationResult.data` is reserved for future response transformation. In this version the original parsed data is returned even when an adapter reports transformed `data`.

If you need transformation today, do it after the call returns, or use `parseResponse`.

## Zod adapter

A ready-made adapter for [zod](https://zod.dev) ships in a dedicated subpath. `zod` is an optional peer dependency — it is required only if you use this adapter, and it adds no runtime dependency to the core package.

```bash
npm install zod
```

```ts
import { z } from 'zod';
import { createClient } from '@dfsync/client';
import { zodAdapter } from '@dfsync/client/adapters/zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const client = createClient({
  baseUrl: 'https://api.example.com',
  responseSchema: zodAdapter(userSchema),
});

const user = await client.get('/users/1');
```

On failure, the zod error is available on `ValidationError.issues`:

```ts
import { ValidationError } from '@dfsync/client';

try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.issues);
  }
}
```

`zodAdapter` is typed structurally against `safeParse`, so it works across zod versions and with any other `safeParse`-compatible schema.

## Validation precedence

When more than one validator is configured, exactly one runs. Precedence is:

1. request-level `responseSchema`
2. request-level `validateResponse`
3. client-level `responseSchema`
4. client-level `validateResponse`

In other words: a request-level option beats a client-level one, and within the same level `responseSchema` beats `validateResponse`.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  validateResponse: () => true,
  responseSchema: zodAdapter(userSchema), // wins at client level
});

await client.get('/users/1', {
  validateResponse: (data) => 'email' in (data as object), // wins overall
});
```

If no validator is configured, validation does not run at all.

## ValidationError

When a `validateResponse` predicate returns `false`, or a `responseSchema` adapter reports `success: false`, the client throws `ValidationError`.

```ts
import { ValidationError } from '@dfsync/client';

try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.data);
    console.log(error.response.status);
  }
}
```

`ValidationError` includes:

- `code` -> `"VALIDATION_ERROR"`
- `data` -> parsed response data
- `response` -> original `Response`
- `issues` -> adapter-specific details, when validation ran through a `responseSchema` adapter

Like every lifecycle error, it also carries `requestId`, `attempt`, and `durationMs`. See **Errors**.

Validation failures are not retried, and no `shouldRetry` predicate can make them retryable.

## Hooks and validation

When response validation is configured and passes, `afterResponse` receives validation metadata.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  validateResponse(data) {
    return typeof data === 'object' && data !== null && 'id' in data;
  },
  hooks: {
    afterResponse(ctx) {
      console.log(ctx.validation);
      // { enabled: true, passed: true }
    },
  },
});
```

If validation is not configured, `ctx.validation` is not present.

If validation returns `false`, `afterResponse` is not called. The request fails with `ValidationError`, and `onError` runs after the final failure.

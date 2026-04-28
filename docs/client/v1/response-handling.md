# Response Handling

`@dfsync/client` parses successful and failed HTTP responses before returning data or throwing an error.

Response handling has three steps:

1. parse the response body
2. throw `HttpError` for non-2xx responses
3. validate successful response data when `validateResponse` is configured

## Response parsing

Responses are parsed automatically:

- `application/json` responses are parsed with `response.json()`
- other response types are returned as text
- `204 No Content` returns `undefined`

```ts
const user = await client.get<User>('/users/1');
```

The generic type controls the TypeScript return type. Runtime validation is separate and only runs when you configure `validateResponse`.

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

## ValidationError

When validation returns `false`, the client throws `ValidationError`.

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

Validation failures are not retried.

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

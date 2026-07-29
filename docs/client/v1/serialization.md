# Serialization

`@dfsync/client` serializes request bodies and parses responses with predictable defaults, and lets you replace either side of the pipeline when you need a different format.

Use this when you integrate with a service that does not speak JSON — form-encoded APIs, custom envelopes, or text protocols.

## Default behavior

Request bodies:

- object body → serialized with `JSON.stringify(...)`, and `content-type: application/json` is set only if you did not set it yourself
- string body → sent as-is, without forcing a `content-type`
- no body → nothing is serialized

Responses:

- `application/json` → parsed with `response.json()`
- other content types → returned as text
- `204 No Content` → `undefined`

If you configure neither `serializeBody` nor `parseResponse`, this default behavior is preserved.

## serializeBody

`serializeBody` turns a request body into a `fetch`-compatible body. It is called only when a body is present.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  serializeBody(body) {
    return {
      body: new URLSearchParams(body as Record<string, string>).toString(),
      contentType: 'application/x-www-form-urlencoded',
    };
  },
});

await client.post('/form', { a: 1, b: 2 });
```

The request is sent as:

```http
content-type: application/x-www-form-urlencoded

a=1&b=2
```

### Content type precedence

The returned `contentType` is optional, and it is applied only when no `content-type` header is already present.

```ts
await client.post(
  '/form',
  { a: 1 },
  {
    headers: { 'content-type': 'application/custom' },
  },
);
```

Here the explicit header wins and the serializer's `contentType` is ignored.

Because serialization runs after `beforeRequest` hooks, a `content-type` set by a hook also takes precedence over the serializer's `contentType`.

## parseResponse

`parseResponse` turns a `Response` into data.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  async parseResponse(response) {
    const text = await response.text();
    return Object.fromEntries(new URLSearchParams(text));
  },
});

const user = await client.get('/users/1');
```

### It runs for every response

`parseResponse` runs for successful **and** failed responses, before the client classifies the result and before validation. That means a custom parser affects the whole pipeline:

- `HttpError.data` contains the custom-parsed error body
- `validateResponse` and `responseSchema` receive the custom-parsed value

```ts
import { HttpError } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  parseResponse: async (response) => {
    const text = await response.text();
    return Object.fromEntries(new URLSearchParams(text));
  },
});

try {
  await client.get('/users/999');
} catch (error) {
  if (error instanceof HttpError) {
    console.log(error.data);
    // { code: 'not_found' } parsed from `code=not_found`
  }
}
```

### Custom parsers replace the default entirely

When `parseResponse` is configured, the default content-type handling does not run. Your parser is responsible for every case it needs to support, including `204 No Content` and non-JSON payloads.

A parser that cannot handle a payload can simply throw — see **Error behavior** below for how that is classified.

## Serializer context

Both options receive a lightweight context as the second argument:

```ts
type SerializerContext = {
  request: RequestConfig;
  requestId: string;
};
```

This is useful for logging or for branching on the request itself.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  parseResponse(response, { request, requestId }) {
    console.log(requestId, request.path);
    return response.text();
  },
});
```

## Request-level overrides

Both options can be set on the client or per request. A request-level option takes precedence over the client-level one.

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  parseResponse: () => 'client-level',
});

const result = await client.get('/thing', {
  parseResponse: () => 'request-level',
});
// 'request-level'
```

## Type reference

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

## Error behavior

A parser is allowed to throw. The failure is treated as a contract error, not a transport error:

| Situation                             | Result                                    | Retried?          |
| ------------------------------------- | ----------------------------------------- | ----------------- |
| 2xx, parser throws                    | `ParseError` with the failure as `cause`  | no                |
| non-2xx, parser throws                | `HttpError` with the status, `data` unset | per `retryOn`     |
| parser throws during abort or timeout | `RequestAbortedError` / `TimeoutError`    | no                |
| parser throws a `DfsyncError`         | that error, unchanged                     | per its own rules |

```ts
import { ParseError } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  parseResponse: (response) => response.json(),
});

try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof ParseError) {
    console.error('could not parse body', error.cause);
  }
}
```

Two consequences worth knowing:

- **Parsing failures are never retried.** If a service intermittently returns a truncated body, retrying will not be triggered automatically — handle it at the call site, or make the parser tolerant.
- **A failed response keeps its status.** A `503` whose body cannot be parsed still surfaces as `HttpError` with `status: 503` and is still retried according to `retryOn`, so a broken error payload never costs you a retry.

If you would rather reject bad payloads through validation than through parsing, return a value from the parser and let `responseSchema` or `validateResponse` decide — that produces `ValidationError` with `issues` instead of `ParseError` with `cause`.

The same rules apply to the default parser: a `200` advertising `content-type: application/json` with a malformed body throws `ParseError`.

## Related guides

- See **Response Handling** for parsing defaults and response validation
- See **Create Client** for body and header behavior
- See **Errors** for error types and error metadata

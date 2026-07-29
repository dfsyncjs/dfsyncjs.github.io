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

If `parseResponse` throws, the failure is treated as a transport failure and normalized into `NetworkError`. Because network errors are retryable, a throwing parser can trigger retries when `retryOn` includes `network-error`. Keep parsers defensive, and prefer returning a value your validation layer can reject over throwing.

## Related guides

- See **Response Handling** for parsing defaults and response validation
- See **Create Client** for body and header behavior
- See **Errors** for error types and error metadata

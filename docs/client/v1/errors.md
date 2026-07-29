# Errors

`@dfsync/client` throws structured error classes for different failure types.

## Error classes

- `DfsyncError` - basic Error class
- `HttpError` — non-2xx responses
- `NetworkError` — network failures
- `TimeoutError` — request timed out
- `ParseError` — response body could not be parsed
- `ValidationError` — response validation failed
- `RequestAbortedError` — request was cancelled

This allows you to handle failures more precisely.

`ParseError` and `ValidationError` are **contract errors**: the response arrived, but it is not something the caller can work with. Every other type is a **transport error**: the response never arrived intact.

That distinction drives retry behavior — transport errors can be retried, contract errors never are.

## Base error

All library-specific errors extend `DfsyncError`.

```ts
import { DfsyncError } from '@dfsync/client';
```

It includes:

- `message`
- `code`
- optional `cause`

## Error metadata

Every error thrown from the request lifecycle extends `DfsyncError` and carries request context metadata. This lets you correlate failures without relying on lifecycle hooks.

- `requestId` — the request identifier (matches `x-request-id`)
- `attempt` — the attempt number on which the request ultimately failed
- `durationMs` — total time spent before the error was thrown

```ts
import { DfsyncError } from '@dfsync/client';

try {
  await client.get('/users/1', { requestId: 'req_123' });
} catch (error) {
  if (error instanceof DfsyncError) {
    console.log(error.requestId, error.attempt, error.durationMs);
  }
}
```

These fields are optional in the type, because an error constructed outside of a request lifecycle has no request context to attach.

Errors that are not `DfsyncError` instances are left untouched and receive no metadata.

## HttpError

Thrown when the server returns a non-2xx response.

```ts
import { HttpError } from '@dfsync/client';

try {
  await client.get('/users/999');
} catch (error) {
  if (error instanceof HttpError) {
    console.log(error.status);
    console.log(error.statusText);
    console.log(error.data);
  }
}
```

Properties:

- `code` → `"HTTP_ERROR"`
- `status`
- `statusText`
- `data`
- `response`

Example use:

```ts
try {
  await client.get('/users/999');
} catch (error) {
  if (error instanceof HttpError) {
    if (error.status === 404) {
      return null;
    }

    if (error.status === 401) {
      throw new Error('Unauthorized');
    }

    throw error;
  }

  throw error;
}
```

## NetworkError

Thrown when `fetch` fails before a valid HTTP response is received.

```ts
import { NetworkError } from '@dfsync/client';

try {
  await client.get('/users');
} catch (error) {
  if (error instanceof NetworkError) {
    console.error(error.message);
    console.error(error.cause);
  }
}
```

Properties:

- `code` → `"NETWORK_ERROR"`
- optional `cause`

## TimeoutError

Thrown when the request is aborted because it exceeded the configured timeout.

```ts
import { TimeoutError } from '@dfsync/client';

try {
  await client.get('/slow-endpoint');
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error(error.timeout);
  }
}
```

Properties:

- `code` → `"TIMEOUT_ERROR"`
- `timeout`
- optional `cause`

## ParseError

Thrown when a successful response arrives but its body cannot be parsed.

```ts
import { ParseError } from '@dfsync/client';

try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof ParseError) {
    console.error(error.response.status);
    console.error(error.cause);
  }
}
```

Properties:

- `code` → `"PARSE_ERROR"`
- `response`
- optional `cause` — the original parsing failure

This covers both the default parser and a custom `parseResponse`. A `200` response advertising `content-type: application/json` with a malformed body throws `ParseError`, and so does a custom parser that throws.

Parsing failures are **not retried**. A body the server cannot serialize correctly is a contract problem, not a transient transport problem, so retrying it wastes attempts.

### Failed responses are still classified by status

A parsing failure never masks the HTTP status. When a non-2xx response has an unparsable body, the client still throws `HttpError` with the correct status, leaving `data` as `undefined`:

```ts
// 503 with an HTML error page but `content-type: application/json`
try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof HttpError) {
    console.log(error.status); // 503
    console.log(error.data); // undefined
  }
}
```

This also means retry behavior for failed responses is unchanged: a `5xx` whose body cannot be parsed is still retried according to `retryOn`.

### Cancellation still wins

If the request is aborted while the body is being read, the error keeps its own classification — `TimeoutError` or `RequestAbortedError` — rather than becoming `ParseError`.

## ValidationError

Thrown when a successful response fails `validateResponse` or `responseSchema`.

```ts
import { ValidationError } from '@dfsync/client';

try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.data);
    console.error(error.response.status);
    console.error(error.issues);
  }
}
```

Properties:

- `code` → `"VALIDATION_ERROR"`
- `data`
- `response`
- optional `issues`

`issues` carries adapter-specific validation details and is populated when validation ran through a `responseSchema` adapter that reported an `error`. With a plain `validateResponse` predicate there are no adapter details, so `issues` is `undefined`.

```ts
import { z } from 'zod';
import { ValidationError } from '@dfsync/client';
import { zodAdapter } from '@dfsync/client/adapters/zod';

const client = createClient({
  baseUrl: 'https://api.example.com',
  responseSchema: zodAdapter(z.object({ id: z.string() })),
});

try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.issues); // the zod error
  }
}
```

Validation failures are not retried.

## RequestAbortedError

Thrown when the request is cancelled by an external `AbortSignal`.

```ts
import { RequestAbortedError } from '@dfsync/client';

const controller = new AbortController();

const promise = client.get('/users', {
  signal: controller.signal,
});

controller.abort();

try {
  await promise;
} catch (error) {
  if (error instanceof RequestAbortedError) {
    console.error('Request was cancelled');
  }
}
```

Properties:

- `code` → `"REQUEST_ABORTED"`
- optional `cause`

## Error handling example

```ts
import { HttpError, NetworkError, ParseError, TimeoutError, ValidationError } from '@dfsync/client';

try {
  const result = await client.get('/users/1');
  return result;
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('Request timed out');
    throw error;
  }

  if (error instanceof NetworkError) {
    console.error('Network failure');
    throw error;
  }

  if (error instanceof HttpError) {
    console.error('HTTP status:', error.status);
    console.error('Response payload:', error.data);
    throw error;
  }

  if (error instanceof ParseError) {
    console.error('Unparsable response body:', error.cause);
    throw error;
  }

  if (error instanceof ValidationError) {
    console.error('Unexpected response payload:', error.data);
    throw error;
  }

  throw error;
}
```

Order the transport checks (`TimeoutError`, `NetworkError`) and the response checks (`HttpError`, `ParseError`, `ValidationError`) however suits your service — the classes are siblings, not a hierarchy, so the branches are independent.

## How response bodies are exposed in errors

For failed HTTP responses, the client parses the body first and stores it on `HttpError.data`.

That means if the server responds with JSON:

```json
{ "message": "Bad Request" }
```

you can access it as:

```ts
if (error instanceof HttpError) {
  console.log(error.data);
}
```

## What is not wrapped

Errors thrown inside:

- custom auth
- `beforeRequest`
- `afterResponse`
- `serializeBody`

are rethrown as-is.

They are not converted into `DfsyncError` subclasses, and they do not receive error metadata.

`parseResponse` behaves differently: it runs inside the response phase, so a throwing parser becomes `ParseError` with the original failure kept as `cause`. Two exceptions preserve more specific classifications:

- an abort raised during parsing stays `TimeoutError` or `RequestAbortedError`
- a `DfsyncError` thrown by a custom parser is passed through unchanged, never re-wrapped

See **Serialization** for details.

## Note

Handle errors close to the application logic that depends on the request result.

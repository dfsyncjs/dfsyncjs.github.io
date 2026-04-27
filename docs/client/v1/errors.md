# Errors

`@dfsync/client` throws structured error classes for different failure types.

## Error classes

- `DfsyncError` - basic Error class
- `HttpError` — non-2xx responses
- `NetworkError` — network failures
- `TimeoutError` — request timed out
- `ValidationError` — response validation failed
- `RequestAbortedError` — request was cancelled

This allows you to handle failures more precisely.

## Base error

All library-specific errors extend `DfsyncError`.

```ts
import { DfsyncError } from '@dfsync/client';
```

It includes:

- `message`
- `code`
- optional `cause`

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

## ValidationError

Thrown when a successful response fails `validateResponse`.

```ts
import { ValidationError } from '@dfsync/client';

try {
  await client.get('/users/1');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.data);
    console.error(error.response.status);
  }
}
```

Properties:

- `code` → `"VALIDATION_ERROR"`
- `data`
- `response`

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
import { HttpError, NetworkError, TimeoutError, ValidationError } from '@dfsync/client';

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

  if (error instanceof ValidationError) {
    console.error('Unexpected response payload:', error.data);
    throw error;
  }

  throw error;
}
```

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

are rethrown as-is.

They are not converted into `DfsyncError` subclasses.

## Note

Handle errors close to the application logic that depends on the request result.

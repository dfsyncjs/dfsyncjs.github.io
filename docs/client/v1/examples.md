# Examples

## Basic client

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
});
```

## GET method

```ts
const users = await client.get('/users');
```

## POST method

```ts
const createdUser = await client.post('/users', {
  name: 'Tom',
});
```

## PATCH method

```ts
const updatedUser = await client.patch('/users/1', {
  name: 'Jane',
});
```

## DELETE method

```ts
const deletedUser = await client.delete('/users/1');
```

## Low-level request

```ts
const singleUser = await client.request<User>({
  method: 'GET',
  path: '/users/2',
});
```

## Client with auth

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  auth: {
    type: 'bearer',
    token: 'TOKEN',
  },
});
```

## Response validation

```ts
import { ValidationError } from '@dfsync/client';

const client = createClient({
  baseUrl: 'https://api.example.com',
  validateResponse(data) {
    return typeof data === 'object' && data !== null && 'id' in data;
  },
});

try {
  const user = await client.get('/users/1');
  console.log(user);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.data);
  }
}
```

## Schema validation with zod

```ts
import { z } from 'zod';
import { createClient, ValidationError } from '@dfsync/client';
import { zodAdapter } from '@dfsync/client/adapters/zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const client = createClient({
  baseUrl: 'https://api.example.com',
  responseSchema: zodAdapter(userSchema),
});

try {
  const user = await client.get('/users/1');
  console.log(user);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.issues);
  }
}
```

## Safe POST retry

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 2,
    retryMethods: ['POST'],
    retryOn: ['5xx'],
  },
});

const payment = await client.post(
  '/payments',
  { amount: 100 },
  {
    idempotencyKey: 'payment-123',
  },
);
```

## Bounded retries with jitter

```ts
const client = createClient({
  baseUrl: 'https://api.example.com',
  retry: {
    attempts: 5,
    backoff: 'exponential',
    baseDelayMs: 200,
    jitter: true,
    maxElapsedMs: 3000,
    shouldRetry: ({ method }) => method === 'GET',
  },
});
```

## Form-encoded request body

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

await client.post('/token', { grant_type: 'client_credentials' });
```

## Labeled request with telemetry

```ts
import { createClient, createTelemetryHooks } from '@dfsync/client';
import type { TelemetryExporter } from '@dfsync/client';

const exporter: TelemetryExporter = {
  onRequestSuccess({ operationName, durationMs }) {
    console.log(operationName, durationMs);
  },
  onRequestError({ operationName, error }) {
    console.error(operationName, error);
  },
};

const client = createClient({
  baseUrl: 'https://api.example.com',
  hooks: createTelemetryHooks(exporter),
});

await client.get('/users', {
  operationName: 'listUsers',
});
```

## Error metadata at the call site

```ts
import { DfsyncError } from '@dfsync/client';

try {
  await client.get('/users/1', { requestId: 'req_123' });
} catch (error) {
  if (error instanceof DfsyncError) {
    console.error({
      requestId: error.requestId,
      attempt: error.attempt,
      durationMs: error.durationMs,
    });
  }
}
```

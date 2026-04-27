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

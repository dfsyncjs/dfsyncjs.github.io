# Create Client

Use `createClient` to configure a reusable HTTP client.

## Basic example

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseURL: 'https://api.example.com',
});
```

## Configuration

```ts
const client = createClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    Accept: 'application/json',
  },
});
```

## Making requests

```ts
const users = await client.get('/users');

const createdUser = await client.post('/users', {
  name: 'Roman',
});
```

Using a shared client keeps configuration centralized and consistent across requests.

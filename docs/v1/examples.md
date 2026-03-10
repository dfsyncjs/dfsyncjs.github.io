# Examples

## Basic client

```ts
const client = createClient({
  baseURL: 'https://api.example.com',
});
```

## GET request

```ts
const users = await client.get('/users');
```

## POST JSON

```ts
const createdUser = await client.post('/users', {
  name: 'Tom',
});
```

## Client with auth

```ts
const client = createClient({
  baseURL: 'https://api.example.com',

  auth: async ({ request }) => {
    request.headers.set('Authorization', 'Bearer TOKEN');
  },
});
```

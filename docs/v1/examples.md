# Examples

## Basic client

```ts
const client = createClient({
  baseURL: 'https://api.example.com',
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
  baseURL: 'https://api.example.com',

  auth: async ({ request }) => {
    request.headers.set('Authorization', 'Bearer TOKEN');
  },
});
```

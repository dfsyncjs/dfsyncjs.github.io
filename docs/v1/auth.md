# Auth

`@dfsync/client` supports auth configuration so you can attach tokens or other credentials to requests.

This allows you to centralize auth logic instead of repeating it in every request.

## Example

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseURL: 'https://api.example.com',

  auth: async ({ request }) => {
    request.headers.set('Authorization', 'Bearer TOKEN');
  },
});
```

Every request sent by the client will include the Authorization header.

## Common use cases

- internal service authentication
- bearer tokens
- API tokens
- integration services

## Why configure auth on the client?

Centralizing authentication inside the client configuration provides:

- consistent authentication across requests
- cleaner application code
- easier token rotation or refresh logic

## Notes

Keep auth logic centralized in the client configuration instead of repeating it in every request.

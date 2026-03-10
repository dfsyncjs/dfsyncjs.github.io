# Hooks

Hooks allow you to extend the behavior of the HTTP client during the request lifecycle.

They can be used to implement cross-cutting concerns such as logging, tracing, or instrumentation.

## Example

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseURL: 'https://api.example.com',
  hooks: {
    beforeRequest: [
      async (ctx) => {
        console.log('Outgoing request:', ctx.request.url);
      },
    ],
    afterResponse: [
      async (ctx) => {
        console.log('Response status:', ctx.response.status);
      },
    ],
  },
});
```

## Common use cases

Hooks can be used for:

- request logging
- tracing and correlation IDs
- metrics and observability
- debugging outgoing requests
- modifying requests before they are sent

## Note

Use hooks for infrastructure concerns instead of duplicating logic across your application.

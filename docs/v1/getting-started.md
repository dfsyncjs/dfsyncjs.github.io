# Getting Started

`@dfsync/client` is a lightweight TypeScript HTTP client designed for reliable service-to-service communication.

It provides sensible defaults for:

- microservices
- internal APIs
- worker and integration services
- external API communication

The client focuses on predictable behavior, extensibility, and a clean developer experience.

## Quick example

```ts
import { createClient } from '@dfsync/client';

const client = createClient({
  baseURL: 'https://api.example.com',
});

const users = await client.get('/users');
```

## Features

- simple HTTP client API
- built-in auth support
- lifecycle hooks
- consistent error handling
- good defaults for service communication

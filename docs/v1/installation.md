# Installation

Install the package with your preferred package manager.

## npm

```bash
npm install @dfsync/client
```

## Requirements

- Node.js 18+
- TypeScript (recommended)

## After installation

Create your first client instance:

```typescript
import { createClient } from '@dfsync/client';

const client = createClient({
  baseURL: 'https://api.example.com',
});
```

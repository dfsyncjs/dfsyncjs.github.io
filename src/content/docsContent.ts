export const docsContent = {
  v1: {
    'getting-started': () => import('../../docs/v1/getting-started.md?raw'),
    installation: () => import('../../docs/v1/installation.md?raw'),
    'create-client': () => import('../../docs/v1/create-client.md?raw'),
    'response-handling': () => import('../../docs/v1/response-handling.md?raw'),
    auth: () => import('../../docs/v1/auth.md?raw'),
    hooks: () => import('../../docs/v1/hooks.md?raw'),
    retry: () => import('../../docs/v1/retry.md?raw'),
    errors: () => import('../../docs/v1/errors.md?raw'),
    examples: () => import('../../docs/v1/examples.md?raw'),
    observability: () => import('../../docs/v1/observability.md?raw'),
    'api-reference': () => import('../../docs/v1/api-reference.md?raw'),
  },
} as const;

export type DocsVersion = keyof typeof docsContent;

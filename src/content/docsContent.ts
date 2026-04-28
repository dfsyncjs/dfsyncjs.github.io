export const docsPackages = {
  client: {
    label: '@dfsync/client',
    packageName: '@dfsync/client',
    defaultVersion: 'v1',
    defaultSlug: 'getting-started',
    versions: {
      v1: {
        navigation: [
          { label: 'Getting Started', slug: 'getting-started' },
          { label: 'Installation', slug: 'installation' },
          { label: 'Create Client', slug: 'create-client' },
          { label: 'Response Handling', slug: 'response-handling' },
          { label: 'Auth', slug: 'auth' },
          { label: 'Hooks', slug: 'hooks' },
          { label: 'Observability', slug: 'observability' },
          { label: 'Retry', slug: 'retry' },
          { label: 'Errors', slug: 'errors' },
          { label: 'Examples', slug: 'examples' },
          { label: 'API Reference', slug: 'api-reference' },
        ],
        content: {
          'getting-started': () => import('../../docs/client/v1/getting-started.md?raw'),
          installation: () => import('../../docs/client/v1/installation.md?raw'),
          'create-client': () => import('../../docs/client/v1/create-client.md?raw'),
          'response-handling': () => import('../../docs/client/v1/response-handling.md?raw'),
          auth: () => import('../../docs/client/v1/auth.md?raw'),
          hooks: () => import('../../docs/client/v1/hooks.md?raw'),
          retry: () => import('../../docs/client/v1/retry.md?raw'),
          errors: () => import('../../docs/client/v1/errors.md?raw'),
          examples: () => import('../../docs/client/v1/examples.md?raw'),
          observability: () => import('../../docs/client/v1/observability.md?raw'),
          'api-reference': () => import('../../docs/client/v1/api-reference.md?raw'),
        },
      },
    },
  },
} as const;

export type DocsPackageSlug = keyof typeof docsPackages;

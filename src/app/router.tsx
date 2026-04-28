import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import {
  defaultDocsPackage,
  defaultDocsSlug,
  defaultDocsVersion,
} from '../content/docsNavigation.ts';

const HomePage = lazy(() => import('../pages/Home/HomePage'));
const DocsPage = lazy(() =>
  import('../pages/Docs/DocsPage').then((module) => ({
    default: module.DocsPage,
  })),
);
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/docs',
    element: (
      <Navigate
        to={`/docs/${defaultDocsPackage}/${defaultDocsVersion}/${defaultDocsSlug}`}
        replace
      />
    ),
  },
  {
    path: '/docs/:packageSlug',
    element: <DocsPage />,
  },
  {
    path: '/docs/:packageSlug/:version/:slug',
    element: <DocsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

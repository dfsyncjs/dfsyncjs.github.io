import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/Home/HomePage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
];

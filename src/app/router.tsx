import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router';
import { AdminLayout } from '../components/layout/AdminLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import AdminAntrianPage from '../pages/AdminAntrianPage';
import AdminDenahPage from '../pages/AdminDenahPage';
import AdminDetailMejaPage from '../pages/AdminDetailMejaPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminMenuPage from '../pages/AdminMenuPage';
import HomePage from '../pages/HomePage';
import MejaPage from '../pages/MejaPage';
import NotFoundPage from '../pages/NotFoundPage';
import TagihanPage from '../pages/TagihanPage';

// Halaman katalog komponen, hanya di mode dev (tidak ikut build produksi).
const DevUiPage = import.meta.env.DEV ? lazy(() => import('../pages/DevUiPage')) : null;

const devRoutes: RouteObject[] = DevUiPage
  ? [
      {
        path: '/dev/ui',
        element: (
          <Suspense fallback={null}>
            <DevUiPage />
          </Suspense>
        ),
      },
    ]
  : [];

// Peta route PRD 16.1. RequireAdmin untuk /admin/* ditambahkan di M5.
const routes: RouteObject[] = [
  {
    element: <CustomerLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/meja/:nomor', element: <MejaPage /> },
      { path: '/meja/:nomor/tagihan', element: <TagihanPage /> },
    ],
  },
  { path: '/admin/masuk', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDenahPage /> },
      { path: 'meja/:nomor', element: <AdminDetailMejaPage /> },
      { path: 'antrian', element: <AdminAntrianPage /> },
      { path: 'menu', element: <AdminMenuPage /> },
    ],
  },
  ...devRoutes,
  { path: '*', element: <NotFoundPage /> },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

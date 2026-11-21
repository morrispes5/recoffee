import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { Skeleton } from '../components/ui';
import HomePage from '../pages/HomePage';
import MejaPage from '../pages/MejaPage';
import NotFoundPage from '../pages/NotFoundPage';
import TagihanPage from '../pages/TagihanPage';

// Halaman admin dimuat terpisah agar HP pelanggan tidak mengunduh kode admin (NFR-01).
const AdminLayout = lazy(() =>
  import('../components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })),
);
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'));
const AdminDenahPage = lazy(() => import('../pages/AdminDenahPage'));
const AdminDetailMejaPage = lazy(() => import('../pages/AdminDetailMejaPage'));
const AdminAntrianPage = lazy(() => import('../pages/AdminAntrianPage'));
const AdminMenuPage = lazy(() => import('../pages/AdminMenuPage'));

// Halaman katalog komponen, hanya di mode dev (tidak ikut build produksi).
const DevUiPage = import.meta.env.DEV ? lazy(() => import('../pages/DevUiPage')) : null;

function Muat({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-admin px-5 py-12 sm:px-8">
          <Skeleton lines={4} className="max-w-md" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const devRoutes: RouteObject[] = DevUiPage
  ? [
      {
        path: '/dev/ui',
        element: (
          <Muat>
            <DevUiPage />
          </Muat>
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
  {
    path: '/admin/masuk',
    element: (
      <Muat>
        <AdminLoginPage />
      </Muat>
    ),
  },
  {
    path: '/admin',
    element: (
      <Muat>
        <AdminLayout />
      </Muat>
    ),
    children: [
      {
        index: true,
        element: (
          <Muat>
            <AdminDenahPage />
          </Muat>
        ),
      },
      {
        path: 'meja/:nomor',
        element: (
          <Muat>
            <AdminDetailMejaPage />
          </Muat>
        ),
      },
      {
        path: 'antrian',
        element: (
          <Muat>
            <AdminAntrianPage />
          </Muat>
        ),
      },
      {
        path: 'menu',
        element: (
          <Muat>
            <AdminMenuPage />
          </Muat>
        ),
      },
    ],
  },
  ...devRoutes,
  { path: '*', element: <NotFoundPage /> },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchIsAdmin, type AuthUser } from './api';
import { AuthContext } from './authContext';
import { RequireAdmin } from './RequireAdmin';

vi.mock('./api', () => ({ fetchIsAdmin: vi.fn() }));

const user = { id: 'pengguna-uji', email: 'uji@example.com' };

function LoginDestination() {
  const { state } = useLocation();
  return <p>{state === 'akses-ditolak' ? 'Akses admin ditolak' : 'Masuk admin'}</p>;
}

function renderAdmin(activeUser: AuthUser | null) {
  const signOut = vi.fn(async () => undefined);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <AuthContext
        value={{ user: activeUser, loading: false, signIn: async () => undefined, signOut }}
      >
        <MemoryRouter initialEntries={['/admin/antrian']}>
          <Routes>
            <Route path="/admin/masuk" element={<LoginDestination />} />
            <Route
              path="/admin/antrian"
              element={
                <RequireAdmin>
                  <p>Antrian kasir</p>
                </RequireAdmin>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext>
    </QueryClientProvider>,
  );
  return signOut;
}

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('RequireAdmin', () => {
  it('mengalihkan tamu ke halaman masuk tanpa memeriksa peran', async () => {
    renderAdmin(null);
    expect(await screen.findByText('Masuk admin')).toBeInTheDocument();
    expect(screen.queryByText('Antrian kasir')).not.toBeInTheDocument();
    expect(fetchIsAdmin).not.toHaveBeenCalled();
  });

  it('menolak non-admin dan mengakhiri sesi yang mencoba masuk', async () => {
    vi.mocked(fetchIsAdmin).mockResolvedValue(false);
    const signOut = renderAdmin(user);
    expect(await screen.findByText('Akses admin ditolak')).toBeInTheDocument();
    expect(screen.queryByText('Antrian kasir')).not.toBeInTheDocument();
    expect(signOut).toHaveBeenCalledOnce();
  });

  it('baru menampilkan antrian setelah database mengonfirmasi akses', async () => {
    vi.mocked(fetchIsAdmin).mockResolvedValue(true);
    const signOut = renderAdmin(user);
    expect(screen.queryByText('Antrian kasir')).not.toBeInTheDocument();
    expect(await screen.findByText('Antrian kasir')).toBeInTheDocument();
    expect(signOut).not.toHaveBeenCalled();
  });
});

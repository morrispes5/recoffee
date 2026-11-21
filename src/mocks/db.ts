import type { ItemTagihan, MetodeBayar, Profil, StatusPesanan, StatusSesi } from '../types/domain';
import { seedMockDb } from './tagihan';

/*
 * "Database" pura-pura untuk M2–M3, disimpan di localStorage agar bertahan setelah refresh.
 * Aturan bisnis di sini meniru function SQL PRD bagian 13 supaya alur UI teruji sama persis.
 * Seluruh folder src/mocks diganti Supabase di M5.
 */

export interface MockSesi {
  id: string;
  nomor_meja: number;
  status: StatusSesi;
  metode_bayar: MetodeBayar | null;
  dibuka_at: string;
}

export interface MockPesanan {
  id: string;
  sesi_id: string;
  pelanggan_id: string;
  status: StatusPesanan;
  catatan: string | null;
  created_at: string;
  items: ItemTagihan[];
}

export interface MockDb {
  sesi: MockSesi[];
  pesanan: MockPesanan[];
  profil: Record<string, Profil>;
  menuHabis: string[];
  offline: boolean;
}

export interface MockUser {
  id: string;
  email: string;
}

const DB_KEY = 'recoffee:mock:db';
const AUTH_KEY = 'recoffee:mock:auth';

export const MOCK_USERS = {
  saya: { id: 'mock-pelanggan-1', email: 'pelanggan.demo@gmail.com' },
  teman: { id: 'mock-pelanggan-2', email: 'teman.demo@gmail.com' },
} as const satisfies Record<string, MockUser>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function bacaDb(): MockDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const data: unknown = JSON.parse(raw);
      if (
        isRecord(data) &&
        Array.isArray(data.sesi) &&
        Array.isArray(data.pesanan) &&
        isRecord(data.profil) &&
        Array.isArray(data.menuHabis)
      ) {
        return data as unknown as MockDb;
      }
    }
  } catch {
    // data rusak: mulai ulang dari seed
  }
  const awal = seedMockDb();
  simpanDb(awal);
  return awal;
}

export function simpanDb(db: MockDb): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // localStorage penuh/nonaktif: abaikan, mock tetap jalan di memori panggilan ini
  }
}

export function ubahDb(fn: (db: MockDb) => void): MockDb {
  const db = bacaDb();
  fn(db);
  simpanDb(db);
  return db;
}

export function resetDb(): void {
  simpanDb(seedMockDb());
}

/** Delay buatan 300 ms agar state loading teruji (M2 tugas 6). */
export async function tundaMock(ms = 300): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
  if (bacaDb().offline) {
    throw new TypeError('Failed to fetch');
  }
}

export function idBaru(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

// ---------- Auth mock ----------

const pendengar = new Set<(user: MockUser | null) => void>();

export function bacaUserMock(): MockUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (isRecord(data) && typeof data.id === 'string' && typeof data.email === 'string') {
      return { id: data.id, email: data.email };
    }
  } catch {
    // abaikan
  }
  return null;
}

export function setUserMock(user: MockUser | null): void {
  try {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    // abaikan
  }
  pendengar.forEach((cb) => cb(user));
}

export function dengarUserMock(cb: (user: MockUser | null) => void): () => void {
  pendengar.add(cb);
  return () => pendengar.delete(cb);
}

export function sesiTerbuka(s: MockSesi): s is MockSesi & { status: 'aktif' | 'minta_bill' } {
  return s.status === 'aktif' || s.status === 'minta_bill';
}

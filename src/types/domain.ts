// Tipe domain RE:coffee (PRD bagian 14.1). Harga selalu integer Rupiah.
export type KategoriMenu = 'kopi' | 'non_kopi' | 'makanan' | 'camilan';
export type StatusSesi = 'aktif' | 'minta_bill' | 'selesai' | 'batal';
export type StatusMeja = 'kosong' | 'aktif' | 'minta_bill';
export type StatusPesanan = 'baru' | 'diproses' | 'diantar';
export type MetodeBayar = 'qris' | 'kasir';

export interface Menu {
  id: string;
  nama: string;
  deskripsi: string | null;
  kategori: KategoriMenu;
  harga: number; // integer rupiah
  tersedia: boolean;
  diarsipkan: boolean;
  urutan: number;
}

export interface CartItem {
  menuId: string;
  nama: string; // hanya untuk tampilan
  hargaTampil: number; // hanya untuk tampilan, bukan dikirim
  qty: number;
}

export interface ItemTagihan {
  nama_menu: string;
  qty: number;
  harga_satuan: number;
}

export interface PesananTagihan {
  id: string;
  status: StatusPesanan;
  catatan: string | null;
  dipesan_oleh: string; // nama pelanggan, tanpa nomor HP
  milik_saya: boolean; // true jika pesanan dibuat user yang sedang login
  created_at: string;
  items: ItemTagihan[];
}

export interface Profil {
  nama: string;
  no_hp: string;
  email: string;
}

export interface Tagihan {
  sesi_id: string;
  nomor_meja: number;
  status: Extract<StatusSesi, 'aktif' | 'minta_bill'>;
  metode_bayar: MetodeBayar | null;
  dibuka_at: string;
  total: number;
  pesanan: PesananTagihan[];
}

export interface StatusMejaRow {
  nomor: number;
  kapasitas: number;
  sesi_id: string | null;
  status: StatusMeja;
  metode_bayar: MetodeBayar | null;
  dibuka_at: string | null;
  minta_bill_at: string | null;
  total: number;
  pesanan_belum_diantar: number;
}

export const LABEL_KATEGORI: Record<KategoriMenu, string> = {
  kopi: 'Kopi',
  non_kopi: 'Non-kopi',
  makanan: 'Makanan',
  camilan: 'Camilan',
};

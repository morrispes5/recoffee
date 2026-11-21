-- Helper: apakah user saat ini admin?
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from admin
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table meja enable row level security;
alter table menu enable row level security;
alter table sesi_meja enable row level security;
alter table pesanan enable row level security;
alter table item_pesanan enable row level security;
alter table pelanggan enable row level security;
alter table admin enable row level security;

-- Meja: publik baca
create policy meja_baca_publik on meja for select using (true);

-- Menu: publik baca yang tidak diarsipkan; admin baca semua dan kelola
create policy menu_baca_publik on menu for select using (not diarsipkan);
create policy menu_baca_admin on menu for select using (is_admin());
create policy menu_tambah_admin on menu for insert with check (is_admin());
create policy menu_ubah_admin on menu for update using (is_admin()) with check (is_admin());
-- Tidak ada policy delete: menu diarsipkan, bukan dihapus.

-- Sesi: hanya admin baca; tulis hanya lewat function
create policy sesi_baca_admin on sesi_meja for select using (is_admin());

-- Pesanan: admin baca dan ubah status
create policy pesanan_baca_admin on pesanan for select using (is_admin());
create policy pesanan_ubah_admin on pesanan for update using (is_admin()) with check (is_admin());

-- Item: admin baca
create policy item_baca_admin on item_pesanan for select using (is_admin());

-- Pelanggan: baca data sendiri; admin baca semua. Tulis hanya lewat simpan_profil()
create policy pelanggan_baca_sendiri on pelanggan for select using (id = auth.uid());
create policy pelanggan_baca_admin on pelanggan for select using (is_admin());

-- Admin: admin baca daftar admin
create policy admin_baca_admin on admin for select using (is_admin());

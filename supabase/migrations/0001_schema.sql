-- Enum
create type kategori_menu as enum ('kopi', 'non_kopi', 'makanan', 'camilan');
create type status_sesi as enum ('aktif', 'minta_bill', 'selesai', 'batal');
create type status_pesanan as enum ('baru', 'diproses', 'diantar');
create type metode_bayar as enum ('qris', 'kasir');

-- Meja
create table meja (
  nomor smallint primary key check (nomor between 1 and 28),
  kapasitas smallint not null default 4 check (kapasitas between 1 and 12)
);

-- Menu
create table menu (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 2 and 60),
  deskripsi text check (deskripsi is null or char_length(deskripsi) <= 160),
  kategori kategori_menu not null,
  harga integer not null check (harga > 0 and harga <= 1000000),
  tersedia boolean not null default true,
  diarsipkan boolean not null default false,
  urutan smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menu_kategori_urutan_idx on menu (kategori, urutan) where not diarsipkan;

-- Sesi meja
create table sesi_meja (
  id uuid primary key default gen_random_uuid(),
  nomor_meja smallint not null references meja (nomor),
  status status_sesi not null default 'aktif',
  metode_bayar metode_bayar,
  total_bayar integer check (total_bayar is null or total_bayar >= 0),
  dibuka_at timestamptz not null default now(),
  minta_bill_at timestamptz,
  ditutup_at timestamptz,
  dikonfirmasi_oleh text,
  constraint sesi_tutup_konsisten check (
    (status in ('aktif', 'minta_bill') and ditutup_at is null)
    or (status in ('selesai', 'batal') and ditutup_at is not null)
  )
);
-- BR-01: satu sesi terbuka per meja
create unique index sesi_meja_satu_terbuka_idx
  on sesi_meja (nomor_meja)
  where status in ('aktif', 'minta_bill');
create index sesi_meja_status_idx on sesi_meja (status);

-- Pelanggan (data diri; id = id akun Supabase Auth)
create table pelanggan (
  id uuid primary key references auth.users (id) on delete restrict,
  email text not null,
  nama text not null check (char_length(btrim(nama)) between 2 and 50),
  no_hp text not null check (no_hp ~ '^(\+62|62|0)8[0-9]{7,12}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pesanan
create table pesanan (
  id uuid primary key default gen_random_uuid(),
  sesi_id uuid not null references sesi_meja (id) on delete restrict,
  pelanggan_id uuid not null references pelanggan (id) on delete restrict,
  status status_pesanan not null default 'baru',
  catatan text check (catatan is null or char_length(catatan) <= 140),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index pesanan_sesi_idx on pesanan (sesi_id);
create index pesanan_pelanggan_idx on pesanan (pelanggan_id);
create index pesanan_antrian_idx on pesanan (created_at) where status in ('baru', 'diproses');

-- Item pesanan
create table item_pesanan (
  id uuid primary key default gen_random_uuid(),
  pesanan_id uuid not null references pesanan (id) on delete restrict,
  menu_id uuid not null references menu (id) on delete restrict,
  nama_menu text not null,
  qty smallint not null check (qty between 1 and 20),
  harga_satuan integer not null check (harga_satuan > 0),
  -- Alternate key: satu menu hanya sekali per pesanan (hasil transformasi M:N, bagian 10.6)
  constraint item_pesanan_unik unique (pesanan_id, menu_id)
);
create index item_pesanan_menu_idx on item_pesanan (menu_id);

-- Admin
create table admin (
  email text primary key check (email = lower(email)),
  nama text,
  created_at timestamptz not null default now()
);

-- Relasi Mengonfirmasi (ADMIN 1 : M SESI_MEJA), boleh kosong selama sesi berjalan
alter table sesi_meja
  add constraint sesi_meja_dikonfirmasi_oleh_fk
  foreign key (dikonfirmasi_oleh) references admin (email) on update cascade;

-- updated_at otomatis
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger menu_updated_at before update on menu
  for each row execute function set_updated_at();
create trigger pesanan_updated_at before update on pesanan
  for each row execute function set_updated_at();
create trigger pelanggan_updated_at before update on pelanggan
  for each row execute function set_updated_at();

-- Status pesanan hanya boleh maju satu langkah
create or replace function cek_transisi_pesanan() returns trigger
language plpgsql as $$
begin
  if new.status <> old.status and not (
    (old.status = 'baru' and new.status = 'diproses') or
    (old.status = 'diproses' and new.status = 'diantar')
  ) then
    raise exception 'TRANSISI_STATUS_TIDAK_VALID';
  end if;
  return new;
end;
$$;

create trigger pesanan_transisi before update of status on pesanan
  for each row execute function cek_transisi_pesanan();

-- Simpan / ubah data diri pelanggan (dipanggil setelah login Google)
create or replace function simpan_profil(p_nama text, p_no_hp text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_nama text := btrim(coalesce(p_nama, ''));
  v_hp text := regexp_replace(coalesce(p_no_hp, ''), '[\s-]', '', 'g');
begin
  if v_uid is null then
    raise exception 'BELUM_LOGIN';
  end if;
  if char_length(v_nama) not between 2 and 50
     or v_hp !~ '^(\+62|62|0)8[0-9]{7,12}$' then
    raise exception 'PROFIL_TIDAK_VALID';
  end if;

  insert into pelanggan (id, email, nama, no_hp)
  values (v_uid, v_email, v_nama, v_hp)
  on conflict (id) do update
    set nama = excluded.nama, no_hp = excluded.no_hp, email = excluded.email;
end;
$$;

-- Kirim pesanan (pelanggan login + data diri). p_items: [{"menu_id": "uuid", "qty": 2}, ...]
create or replace function buat_pesanan(
  p_nomor_meja smallint,
  p_items jsonb,
  p_catatan text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_sesi_id uuid;
  v_status status_sesi;
  v_pesanan_id uuid;
  v_item jsonb;
  v_menu menu%rowtype;
  v_qty integer;
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'BELUM_LOGIN';
  end if;
  if not exists (select 1 from pelanggan where id = v_uid) then
    raise exception 'PROFIL_BELUM_LENGKAP';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 30 then
    raise exception 'ITEM_TIDAK_VALID';
  end if;

  -- Menu yang sama harus digabung di keranjang (qty), bukan dikirim dua baris
  if (select count(distinct value ->> 'menu_id') from jsonb_array_elements(p_items))
     <> jsonb_array_length(p_items) then
    raise exception 'ITEM_TIDAK_VALID';
  end if;

  -- Kunci baris meja: dua HP di meja yang sama mengirim bersamaan tidak membuat dua sesi
  perform 1 from meja where nomor = p_nomor_meja for update;
  if not found then
    raise exception 'MEJA_TIDAK_DITEMUKAN';
  end if;

  select id, status into v_sesi_id, v_status
  from sesi_meja
  where nomor_meja = p_nomor_meja and status in ('aktif', 'minta_bill');

  if v_sesi_id is null then
    insert into sesi_meja (nomor_meja) values (p_nomor_meja) returning id into v_sesi_id;
  elsif v_status = 'minta_bill' then
    raise exception 'TAGIHAN_SEDANG_DIPROSES';
  end if;

  insert into pesanan (sesi_id, pelanggan_id, catatan)
  values (v_sesi_id, v_uid, nullif(btrim(p_catatan), ''))
  returning id into v_pesanan_id;

  for v_item in select value from jsonb_array_elements(p_items) loop
    begin
      v_qty := (v_item ->> 'qty')::integer;
    exception when others then
      raise exception 'QTY_TIDAK_VALID';
    end;
    if v_qty is null or v_qty < 1 or v_qty > 20 then
      raise exception 'QTY_TIDAK_VALID';
    end if;

    select * into v_menu
    from menu
    where id = (v_item ->> 'menu_id')::uuid and tersedia and not diarsipkan;
    if not found then
      raise exception 'MENU_TIDAK_TERSEDIA';
    end if;

    insert into item_pesanan (pesanan_id, menu_id, nama_menu, qty, harga_satuan)
    values (v_pesanan_id, v_menu.id, v_menu.nama, v_qty, v_menu.harga);
  end loop;

  return v_pesanan_id;
end;
$$;

-- Tagihan meja aktif (pelanggan login). Mengembalikan null jika meja kosong.
-- Nama pemesan ditampilkan, nomor HP tidak (NFR-11).
create or replace function get_tagihan_meja(p_nomor_meja smallint) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'sesi_id', s.id,
    'nomor_meja', s.nomor_meja,
    'status', s.status,
    'metode_bayar', s.metode_bayar,
    'dibuka_at', s.dibuka_at,
    'total', coalesce((
      select sum(i.qty * i.harga_satuan)
      from pesanan p join item_pesanan i on i.pesanan_id = p.id
      where p.sesi_id = s.id
    ), 0),
    'pesanan', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id,
        'status', p.status,
        'catatan', p.catatan,
        'dipesan_oleh', (select pl.nama from pelanggan pl where pl.id = p.pelanggan_id),
        'milik_saya', p.pelanggan_id = auth.uid(),
        'created_at', p.created_at,
        'items', (
          select jsonb_agg(jsonb_build_object(
            'nama_menu', i.nama_menu,
            'qty', i.qty,
            'harga_satuan', i.harga_satuan
          ))
          from item_pesanan i where i.pesanan_id = p.id
        )
      ) order by p.created_at)
      from pesanan p where p.sesi_id = s.id
    ), '[]'::jsonb)
  )
  from sesi_meja s
  where s.nomor_meja = p_nomor_meja and s.status in ('aktif', 'minta_bill');
$$;

-- Status sesi terakhir meja (untuk layar "terima kasih" setelah ditutup)
create or replace function get_status_terakhir_meja(p_nomor_meja smallint, p_sesi_id uuid)
returns status_sesi
language sql stable security definer set search_path = public as $$
  select status from sesi_meja where id = p_sesi_id and nomor_meja = p_nomor_meja;
$$;

-- Minta bill (pelanggan). Boleh dipanggil ulang untuk mengganti metode.
create or replace function minta_bill(p_nomor_meja smallint, p_metode metode_bayar) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'BELUM_LOGIN';
  end if;
  if p_metode is null then
    raise exception 'METODE_TIDAK_VALID';
  end if;

  -- BR-13: hanya yang sudah memesan di sesi terbuka meja ini
  if not exists (
    select 1
    from pesanan p join sesi_meja s on s.id = p.sesi_id
    where s.nomor_meja = p_nomor_meja
      and s.status in ('aktif', 'minta_bill')
      and p.pelanggan_id = auth.uid()
  ) then
    raise exception 'BUKAN_PEMESAN_MEJA';
  end if;

  update sesi_meja
  set status = 'minta_bill',
      metode_bayar = p_metode,
      minta_bill_at = coalesce(minta_bill_at, now())
  where nomor_meja = p_nomor_meja and status in ('aktif', 'minta_bill');

  if not found then
    raise exception 'SESI_TIDAK_AKTIF';
  end if;
end;
$$;

-- Konfirmasi bayar (admin)
create or replace function konfirmasi_bayar(p_sesi_id uuid, p_metode metode_bayar default null)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_total integer;
begin
  if not is_admin() then
    raise exception 'BUKAN_ADMIN';
  end if;

  select coalesce(sum(i.qty * i.harga_satuan), 0) into v_total
  from pesanan p join item_pesanan i on i.pesanan_id = p.id
  where p.sesi_id = p_sesi_id;

  update sesi_meja
  set status = 'selesai',
      metode_bayar = coalesce(p_metode, metode_bayar, 'kasir'),
      total_bayar = v_total,
      ditutup_at = now(),
      dikonfirmasi_oleh = lower(auth.jwt() ->> 'email')
  where id = p_sesi_id and status in ('aktif', 'minta_bill');

  if not found then
    raise exception 'SESI_TIDAK_AKTIF';
  end if;
end;
$$;

-- Batalkan sesi (admin)
create or replace function batalkan_sesi(p_sesi_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then
    raise exception 'BUKAN_ADMIN';
  end if;

  update sesi_meja
  set status = 'batal',
      ditutup_at = now(),
      dikonfirmasi_oleh = lower(auth.jwt() ->> 'email')
  where id = p_sesi_id and status in ('aktif', 'minta_bill');

  if not found then
    raise exception 'SESI_TIDAK_AKTIF';
  end if;
end;
$$;

-- View denah meja (RLS tabel dasar tetap berlaku)
create or replace view v_status_meja with (security_invoker = true) as
select
  m.nomor,
  m.kapasitas,
  s.id as sesi_id,
  coalesce(s.status::text, 'kosong') as status,
  s.metode_bayar,
  s.dibuka_at,
  s.minta_bill_at,
  coalesce((
    select sum(i.qty * i.harga_satuan)
    from pesanan p join item_pesanan i on i.pesanan_id = p.id
    where p.sesi_id = s.id
  ), 0) as total,
  coalesce((
    select count(*) from pesanan p
    where p.sesi_id = s.id and p.status <> 'diantar'
  ), 0) as pesanan_belum_diantar
from meja m
left join sesi_meja s
  on s.nomor_meja = m.nomor and s.status in ('aktif', 'minta_bill');

-- Hak eksekusi: cabut default, beri seperlunya.
-- Supabase memberi grant default langsung ke anon & authenticated (bukan hanya lewat public),
-- jadi ketiganya harus dicabut dulu.
revoke execute on function simpan_profil(text, text) from public, anon, authenticated;
revoke execute on function buat_pesanan(smallint, jsonb, text) from public, anon, authenticated;
revoke execute on function get_tagihan_meja(smallint) from public, anon, authenticated;
revoke execute on function get_status_terakhir_meja(smallint, uuid) from public, anon, authenticated;
revoke execute on function minta_bill(smallint, metode_bayar) from public, anon, authenticated;
revoke execute on function konfirmasi_bayar(uuid, metode_bayar) from public, anon, authenticated;
revoke execute on function batalkan_sesi(uuid) from public, anon, authenticated;
revoke execute on function is_admin() from public, anon, authenticated;

-- Fungsi pelanggan: hanya untuk yang sudah login (role authenticated)
grant execute on function simpan_profil(text, text) to authenticated;
grant execute on function buat_pesanan(smallint, jsonb, text) to authenticated;
grant execute on function get_tagihan_meja(smallint) to authenticated;
grant execute on function get_status_terakhir_meja(smallint, uuid) to authenticated;
grant execute on function minta_bill(smallint, metode_bayar) to authenticated;
grant execute on function is_admin() to anon, authenticated;
grant execute on function konfirmasi_bayar(uuid, metode_bayar) to authenticated;
grant execute on function batalkan_sesi(uuid) to authenticated;

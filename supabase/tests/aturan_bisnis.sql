-- Uji aturan bisnis di level database (M6, PRD 19.1). Menyimulasikan tiga akun pelanggan dan satu admin
-- dengan klaim JWT, tanpa perlu login Google. Seluruhnya dibatalkan otomatis: skrip diakhiri
-- `raise exception`, sehingga tidak ada data yang tersisa. Hasil tiap pemeriksaan dibaca di pesan error:
-- baris [OK] lulus, baris [GAGAL] berarti ada aturan yang bocor.
--
-- Jalankan di SQL Editor Supabase setelah migrasi 0001 sampai 0005 dan seed.
-- Prasyarat: 28 meja ada, menu "Es Kopi Susu Aren" dan "Butter Croissant" aktif,
-- dan email admin pada baris terakhir bagian "Admin" cocok dengan tabel admin.

do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  c uuid := gen_random_uuid();
  m1 uuid; m2 uuid;
  sesi uuid; p1 uuid; tg jsonb; n int; harga_awal int;
  hasil text := '';
  admin_email text;
  f text;
begin
  select email into admin_email from admin limit 1;
  select id into m1 from menu where nama = 'Es Kopi Susu Aren' and not diarsipkan;
  select id into m2 from menu where nama = 'Butter Croissant' and not diarsipkan;
  select harga into harga_awal from menu where id = m1;

  insert into auth.users (id, email, aud, role) values
    (a, 'uji.a@contoh.test', 'authenticated', 'authenticated'),
    (b, 'uji.b@contoh.test', 'authenticated', 'authenticated'),
    (c, 'uji.c@contoh.test', 'authenticated', 'authenticated');

  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'email', 'uji.a@contoh.test', 'role', 'authenticated')::text, true);

  -- ===== Data diri (TC-27, TC-28, TC-29) =====
  begin
    perform buat_pesanan(18::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', 1)));
    hasil := hasil || E'\n[GAGAL] TC-27 pesan tanpa data diri diterima';
  exception when others then
    hasil := hasil || E'\n' || case when sqlerrm = 'PROFIL_BELUM_LENGKAP' then '[OK]   ' else '[GAGAL] ' end || 'TC-27 pesan tanpa data diri -> ' || sqlerrm;
  end;

  foreach f in array array[repeat('a', 1), repeat('a', 51)] loop
    begin
      perform simpan_profil(f, '081234567890');
      hasil := hasil || E'\n[GAGAL] TC-29 nama ' || char_length(f) || ' huruf diterima';
    exception when others then
      hasil := hasil || E'\n' || case when sqlerrm = 'PROFIL_TIDAK_VALID' then '[OK]   ' else '[GAGAL] ' end || 'TC-29 nama ' || char_length(f) || ' huruf ditolak -> ' || sqlerrm;
    end;
  end loop;
  foreach f in array array[repeat('a', 2), repeat('a', 50)] loop
    begin
      perform simpan_profil(f, '081234567890');
      hasil := hasil || E'\n[OK]   TC-29 nama ' || char_length(f) || ' huruf diterima';
    exception when others then
      hasil := hasil || E'\n[GAGAL] TC-29 nama ' || char_length(f) || ' huruf ditolak -> ' || sqlerrm;
    end;
  end loop;

  foreach f in array array['081234567890', '6281234567890', '+6281234567890', '0812-3456-7890'] loop
    begin
      perform simpan_profil('Rina', f);
      hasil := hasil || E'\n[OK]   TC-28 nomor HP ' || f || ' diterima';
    exception when others then
      hasil := hasil || E'\n[GAGAL] TC-28 nomor HP ' || f || ' ditolak -> ' || sqlerrm;
    end;
  end loop;
  foreach f in array array['0712345678', '08123', 'abc'] loop
    begin
      perform simpan_profil('Rina', f);
      hasil := hasil || E'\n[GAGAL] TC-28 nomor HP ' || f || ' diterima';
    exception when others then
      hasil := hasil || E'\n' || case when sqlerrm = 'PROFIL_TIDAK_VALID' then '[OK]   ' else '[GAGAL] ' end || 'TC-28 nomor HP ' || f || ' ditolak -> ' || sqlerrm;
    end;
  end loop;
  perform simpan_profil('Rina', '081234567890');

  -- ===== Batas qty 0, 1, 20, 21 (BVA) =====
  foreach n in array array[0, 21] loop
    begin
      perform buat_pesanan(18::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', n)));
      hasil := hasil || E'\n[GAGAL] BVA qty ' || n || ' diterima';
    exception when others then
      hasil := hasil || E'\n' || case when sqlerrm = 'QTY_TIDAK_VALID' then '[OK]   ' else '[GAGAL] ' end || 'BVA qty ' || n || ' ditolak -> ' || sqlerrm;
    end;
  end loop;
  p1 := buat_pesanan(18::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', 1)), 'less sugar');
  hasil := hasil || E'\n[OK]   BVA qty 1 diterima (TC-08, pesanan pertama membuka sesi)';
  perform buat_pesanan(18::smallint, jsonb_build_array(jsonb_build_object('menu_id', m2, 'qty', 20)));
  hasil := hasil || E'\n[OK]   BVA qty 20 diterima (TC-09, pesanan kedua)';

  -- ===== TC-09 / TC-10 / TC-31: satu sesi, dua pelanggan, nomor HP tersembunyi =====
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'email', 'uji.b@contoh.test', 'role', 'authenticated')::text, true);
  perform simpan_profil('Dimas', '081298765432');
  perform buat_pesanan(18::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', 2)));
  tg := get_tagihan_meja(18::smallint);
  hasil := hasil || E'\n' || case when jsonb_array_length(tg -> 'pesanan') = 3 and (tg ->> 'total')::int = 24000 * 3 + 22000 * 20 then '[OK]   ' else '[GAGAL] ' end
    || format('TC-09/10 satu tagihan: %s pesanan, total %s (harapan 3 pesanan, Rp%s)', jsonb_array_length(tg -> 'pesanan'), tg ->> 'total', 24000 * 3 + 22000 * 20);
  hasil := hasil || E'\n' || case when (select count(distinct x ->> 'dipesan_oleh') from jsonb_array_elements(tg -> 'pesanan') x) = 2 then '[OK]   ' else '[GAGAL] ' end
    || 'TC-10 nama pemesan tampil per pesanan: ' || (select string_agg(distinct x ->> 'dipesan_oleh', ', ') from jsonb_array_elements(tg -> 'pesanan') x);
  hasil := hasil || E'\n' || case when tg::text !~ '0812' and tg::text !~ 'no_hp' then '[OK]   ' else '[GAGAL] ' end || 'TC-31 nomor HP tidak ikut terkirim ke pelanggan lain';
  select count(*) into n from sesi_meja where nomor_meja = 18 and status in ('aktif', 'minta_bill');
  hasil := hasil || E'\n' || case when n = 0 then '[OK]   ' else '[GAGAL] ' end || 'BR-01 pelanggan tidak bisa membaca tabel sesi langsung (terlihat ' || n || ' baris)';

  -- ===== TC-30: minta bill oleh yang belum memesan =====
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'email', 'uji.c@contoh.test', 'role', 'authenticated')::text, true);
  perform simpan_profil('Ayu', '081311112222');
  begin
    perform minta_bill(18::smallint, 'qris');
    hasil := hasil || E'\n[GAGAL] TC-30 non-pemesan bisa minta bill';
  exception when others then
    hasil := hasil || E'\n' || case when sqlerrm = 'BUKAN_PEMESAN_MEJA' then '[OK]   ' else '[GAGAL] ' end || 'TC-30 non-pemesan minta bill ditolak -> ' || sqlerrm;
  end;
  begin
    perform konfirmasi_bayar((tg ->> 'sesi_id')::uuid, 'qris');
    hasil := hasil || E'\n[GAGAL] pelanggan bisa konfirmasi bayar';
  exception when others then
    hasil := hasil || E'\n' || case when sqlerrm = 'BUKAN_ADMIN' then '[OK]   ' else '[GAGAL] ' end || 'pelanggan memanggil konfirmasi_bayar ditolak -> ' || sqlerrm;
  end;
  update pesanan set status = 'diproses' where id = p1;
  get diagnostics n = row_count;
  hasil := hasil || E'\n' || case when n = 0 then '[OK]   ' else '[GAGAL] ' end || 'pelanggan tidak bisa mengubah status pesanan langsung (' || n || ' baris)';

  -- ===== TC-12: pesan setelah minta bill =====
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'email', 'uji.a@contoh.test', 'role', 'authenticated')::text, true);
  perform minta_bill(18::smallint, 'qris');
  begin
    perform buat_pesanan(18::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', 1)));
    hasil := hasil || E'\n[GAGAL] TC-12 pesan setelah minta bill diterima';
  exception when others then
    hasil := hasil || E'\n' || case when sqlerrm = 'TAGIHAN_SEDANG_DIPROSES' then '[OK]   ' else '[GAGAL] ' end || 'TC-12 pesan setelah minta bill ditolak -> ' || sqlerrm;
  end;

  -- ===== Admin: TC-16, TC-17 =====
  perform set_config('request.jwt.claims', json_build_object('sub', gen_random_uuid(), 'email', admin_email, 'role', 'authenticated')::text, true);
  hasil := hasil || E'\n' || case when (select status from v_status_meja where nomor = 18) = 'minta_bill' then '[OK]   ' else '[GAGAL] ' end || 'TC-11 meja 18 berstatus minta_bill di denah admin';
  begin
    update pesanan set status = 'diantar' where id = p1;
    hasil := hasil || E'\n[GAGAL] TC-16 lompat baru -> diantar diterima';
  exception when others then
    hasil := hasil || E'\n' || case when sqlerrm = 'TRANSISI_STATUS_TIDAK_VALID' then '[OK]   ' else '[GAGAL] ' end || 'TC-16 lompat baru -> diantar ditolak -> ' || sqlerrm;
  end;
  update pesanan set status = 'diproses' where id = p1;
  update pesanan set status = 'diantar' where id = p1;
  hasil := hasil || E'\n' || case when (select status from pesanan where id = p1) = 'diantar' then '[OK]   ' else '[GAGAL] ' end || 'TC-16 baru -> diproses -> diantar berhasil';

  perform konfirmasi_bayar((tg ->> 'sesi_id')::uuid, null);
  select status::text into f from sesi_meja where id = (tg ->> 'sesi_id')::uuid;
  hasil := hasil || E'\n' || case when f = 'selesai' then '[OK]   ' else '[GAGAL] ' end || 'TC-17 konfirmasi bayar menutup sesi (status ' || f || ')';
  hasil := hasil || E'\n' || case when (select status from v_status_meja where nomor = 18) = 'kosong' then '[OK]   ' else '[GAGAL] ' end || 'TC-17 meja 18 kosong lagi';
  hasil := hasil || E'\n' || case when (select total_bayar from sesi_meja where nomor_meja = 18 order by dibuka_at desc limit 1) = 24000 * 3 + 22000 * 20 then '[OK]   ' else '[GAGAL] ' end || 'TC-17 total_bayar dibekukan = Rp' || (24000 * 3 + 22000 * 20);

  -- ===== TC-18: konfirmasi tanpa minta bill =====
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'email', 'uji.a@contoh.test', 'role', 'authenticated')::text, true);
  perform buat_pesanan(19::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', 1)));
  perform set_config('request.jwt.claims', json_build_object('sub', gen_random_uuid(), 'email', admin_email, 'role', 'authenticated')::text, true);
  perform konfirmasi_bayar((select id from sesi_meja where nomor_meja = 19 and status = 'aktif'), null);
  hasil := hasil || E'\n' || case when (select metode_bayar::text from sesi_meja where nomor_meja = 19) = 'kasir' then '[OK]   ' else '[GAGAL] ' end || 'TC-18 konfirmasi tanpa minta bill, metode tersimpan kasir';

  -- ===== TC-19: batalkan sesi =====
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'email', 'uji.a@contoh.test', 'role', 'authenticated')::text, true);
  perform buat_pesanan(20::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', 1)));
  perform set_config('request.jwt.claims', json_build_object('sub', gen_random_uuid(), 'email', admin_email, 'role', 'authenticated')::text, true);
  perform batalkan_sesi((select id from sesi_meja where nomor_meja = 20 and status = 'aktif'));
  hasil := hasil || E'\n' || case when (select status::text from sesi_meja where nomor_meja = 20) = 'batal'
    and (select count(*) from pesanan p join sesi_meja s on s.id = p.sesi_id where s.nomor_meja = 20) = 1
    and (select status from v_status_meja where nomor = 20) = 'kosong' then '[OK]   ' else '[GAGAL] ' end || 'TC-19 sesi batal, pesanan tetap tercatat, meja kosong';

  -- ===== TC-23: harga lama tidak berubah; TC-22: arsip =====
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'email', 'uji.a@contoh.test', 'role', 'authenticated')::text, true);
  perform buat_pesanan(22::smallint, jsonb_build_array(jsonb_build_object('menu_id', m1, 'qty', 2), jsonb_build_object('menu_id', m2, 'qty', 1)));
  perform set_config('request.jwt.claims', json_build_object('sub', gen_random_uuid(), 'email', admin_email, 'role', 'authenticated')::text, true);
  update menu set harga = harga_awal + 5000 where id = m1;
  update menu set diarsipkan = true where id = m2;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'email', 'uji.a@contoh.test', 'role', 'authenticated')::text, true);
  tg := get_tagihan_meja(22::smallint);
  hasil := hasil || E'\n' || case when (tg ->> 'total')::int = harga_awal * 2 + 22000 then '[OK]   ' else '[GAGAL] ' end
    || format('TC-23 harga menu naik Rp5.000, tagihan lama tetap Rp%s', tg ->> 'total');
  hasil := hasil || E'\n' || case when tg::text like '%Butter Croissant%' then '[OK]   ' else '[GAGAL] ' end || 'TC-22 menu diarsipkan masih tampil di tagihan lama (nama snapshot)';
  execute 'reset role';
  execute 'set local role anon';
  select count(*) into n from menu where id = m2;
  hasil := hasil || E'\n' || case when n = 0 then '[OK]   ' else '[GAGAL] ' end || 'TC-22 menu diarsipkan tidak terbaca pengunjung (' || n || ' baris)';
  execute 'reset role';

  -- ===== TC-14: akun non-admin =====
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'email', 'uji.a@contoh.test', 'role', 'authenticated')::text, true);
  hasil := hasil || E'\n' || case when is_admin() = false then '[OK]   ' else '[GAGAL] ' end || 'TC-14 is_admin() = false untuk email non-admin';
  update menu set harga = 1 where id = m1;
  get diagnostics n = row_count;
  hasil := hasil || E'\n' || case when n = 0 then '[OK]   ' else '[GAGAL] ' end || 'TC-14 non-admin tidak bisa mengubah menu (' || n || ' baris)';

  -- ===== TC-20 / TC-21: validasi menu di database =====
  perform set_config('request.jwt.claims', json_build_object('sub', gen_random_uuid(), 'email', admin_email, 'role', 'authenticated')::text, true);
  insert into menu (nama, kategori, harga) values ('Menu Uji Valid', 'kopi', 18000);
  hasil := hasil || E'\n[OK]   TC-20 admin menambah menu harga 18000';
  foreach n in array array[0, 1000001] loop
    begin
      insert into menu (nama, kategori, harga) values ('Menu Uji Salah', 'kopi', n);
      hasil := hasil || E'\n[GAGAL] TC-21 harga ' || n || ' diterima';
    exception when check_violation then
      hasil := hasil || E'\n[OK]   TC-21 harga ' || n || ' ditolak (check constraint)';
    end;
  end loop;

  raise exception E'HASIL_UJI (dibatalkan otomatis, tidak ada data tersisa):%', hasil;
end $$;

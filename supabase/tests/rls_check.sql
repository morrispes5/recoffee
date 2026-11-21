begin;
set local role anon;

-- 1) Anon tidak boleh insert langsung ke pesanan
do $$
begin
  begin
    insert into pesanan (sesi_id, pelanggan_id) values (gen_random_uuid(), gen_random_uuid());
    raise exception 'GAGAL: anon bisa insert pesanan';
  exception when insufficient_privilege then
    raise notice 'OK: anon ditolak insert pesanan';
  end;
end $$;

-- 2) Anon tidak melihat sesi maupun data pelanggan
do $$
declare n_sesi int; n_pel int;
begin
  select count(*) into n_sesi from sesi_meja;
  select count(*) into n_pel from pelanggan;
  if n_sesi = 0 and n_pel = 0 then raise notice 'OK: anon tidak melihat sesi/pelanggan';
  else raise exception 'GAGAL: anon melihat % sesi, % pelanggan', n_sesi, n_pel; end if;
end $$;

-- 3) Anon tidak bisa memanggil fungsi pelanggan maupun admin
do $$
declare
  f text;
  daftar text[] := array[
    'select buat_pesanan(1::smallint, ''[]''::jsonb)',
    'select get_tagihan_meja(1::smallint)',
    'select minta_bill(1::smallint, ''kasir''::metode_bayar)',
    'select simpan_profil(''Tes'', ''081234567890'')',
    'select konfirmasi_bayar(gen_random_uuid(), ''kasir''::metode_bayar)',
    'select batalkan_sesi(gen_random_uuid())'
  ];
begin
  foreach f in array daftar loop
    begin
      execute f;
      raise exception 'GAGAL: anon bisa menjalankan %', f;
    exception when insufficient_privilege then
      raise notice 'OK: anon ditolak -> %', f;
    end;
  end loop;
end $$;

-- 4) Anon tetap bisa membaca menu dan meja (halaman menu tanpa login)
do $$
declare n_menu int; n_meja int;
begin
  select count(*) into n_menu from menu;
  select count(*) into n_meja from meja;
  if n_menu > 0 and n_meja = 28 then raise notice 'OK: anon bisa baca menu dan 28 meja';
  else raise exception 'GAGAL: menu %, meja %', n_menu, n_meja; end if;
end $$;

rollback;

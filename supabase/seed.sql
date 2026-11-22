insert into meja (nomor) select generate_series(1, 28);

-- Menu: tidak ada di sini lagi. Menu kafe kekinian (22 item) dimasukkan oleh migrasi
-- 0005_menu_kafe_gen_z.sql, jadi jalankan 0001 sampai 0005 lebih dulu, baru file ini.

-- Admin (email Google, huruf kecil)
insert into admin (email, nama) values
  ('morrispes5@gmail.com', 'Kasir 1');

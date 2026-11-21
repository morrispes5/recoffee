insert into meja (nomor) select generate_series(1, 28);

insert into menu (nama, deskripsi, kategori, harga, urutan) values
  ('Kopi Tubruk', 'Kopi hitam diseduh langsung, ampasnya ikut menemani.', 'kopi', 15000, 1),
  ('Kopi Susu Gula Aren', 'Espresso, susu segar, gula aren cair.', 'kopi', 22000, 2),
  ('Es Kopi Susu', 'Versi dingin yang paling sering dipesan.', 'kopi', 20000, 3),
  ('Americano', 'Espresso dan air panas.', 'kopi', 18000, 4),
  ('Kopi Jahe', 'Kopi hitam dengan jahe bakar.', 'kopi', 17000, 5),
  ('Teh Tarik', 'Teh susu yang ditarik sampai berbusa.', 'non_kopi', 16000, 1),
  ('Es Teh Manis', 'Teh tubruk, gula batu, es.', 'non_kopi', 8000, 2),
  ('Cokelat Panas', 'Cokelat bubuk dan susu.', 'non_kopi', 20000, 3),
  ('Roti Bakar Srikaya', 'Roti tawar tebal, srikaya, mentega.', 'makanan', 18000, 1),
  ('Indomie Telur', 'Mi rebus atau goreng dengan telur.', 'makanan', 15000, 2),
  ('Pisang Goreng', 'Lima potong, taburan gula halus.', 'camilan', 14000, 1),
  ('Kerupuk Kaleng', 'Ambil sendiri dari kaleng, bayar per bungkus.', 'camilan', 3000, 2);

-- Admin (email Google, huruf kecil)
insert into admin (email, nama) values
  ('morrispes5@gmail.com', 'Kasir 1');

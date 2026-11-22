-- Revisi menu atas permintaan pemilik proyek (22 Nov 2026): tema kafe kekinian untuk Gen Z,
-- berdasarkan riset menu kafe anak muda Indonesia (varian latte aren/vanila/karamel/pandan,
-- matcha, cokelat, boba, teh susu, croissant, sandwich, croffle, cookies, muffin, brownies).
-- Nama dibuat generik, tidak meniru nama produk merek tertentu. Harga dalam kisaran
-- Rp15.000 sampai Rp35.000, mengikuti kedai kopi kekinian kelas menengah.
--
-- Dijalankan sekali. Menu lama diarsipkan, bukan dihapus, agar riwayat tagihan tetap utuh (BR-09).
-- Tidak mengubah tabel, relasi, maupun aturan; kategori tetap kopi, non_kopi, makanan, camilan.

update menu
set diarsipkan = true
where not diarsipkan
  and nama in (
    'Kopi Tubruk', 'Kopi Susu Gula Aren', 'Es Kopi Susu', 'Americano', 'Kopi Jahe',
    'Teh Tarik', 'Es Teh Manis', 'Cokelat Panas',
    'Roti Bakar Srikaya', 'Indomie Telur', 'Pisang Goreng', 'Kerupuk Kaleng'
  );

insert into menu (nama, deskripsi, kategori, harga, urutan)
select v.nama, v.deskripsi, v.kategori::kategori_menu, v.harga, v.urutan
from (values
  -- Kopi
  ('Es Kopi Susu Aren', 'Espresso, susu segar, dan gula aren. Manis yang pas dan gampang disukai.', 'kopi', 24000, 1),
  ('Caffe Latte', 'Espresso dengan susu steam yang lembut. Pilihan aman buat semua.', 'kopi', 24000, 2),
  ('Americano', 'Espresso dan air, tegas dan ringan. Enak panas maupun dingin.', 'kopi', 20000, 3),
  ('Cappuccino', 'Espresso, susu, dan busa susu yang tebal. Seimbang dan creamy.', 'kopi', 24000, 4),
  ('Vanilla Latte', 'Latte dengan sirup vanila. Wangi dan manisnya lembut.', 'kopi', 26000, 5),
  ('Caramel Macchiato', 'Susu, espresso, dan saus karamel di atasnya. Manis dan wangi.', 'kopi', 28000, 6),
  ('Pandan Kelapa Latte', 'Latte dengan sirup pandan dan kelapa. Wangi, gurih manis, khas lokal.', 'kopi', 28000, 7),
  ('Lemon Americano', 'Americano dengan perasan lemon. Segar dan asam, cocok buat siang.', 'kopi', 26000, 8),
  -- Non-kopi
  ('Matcha Latte', 'Matcha dan susu segar. Pahit lembut, tanpa kopi.', 'non_kopi', 28000, 1),
  ('Dutch Chocolate', 'Cokelat pekat dengan susu. Manis, tebal, dan hangat di lidah.', 'non_kopi', 28000, 2),
  ('Brown Sugar Boba Milk', 'Susu dingin, sirup gula merah, dan boba yang kenyal.', 'non_kopi', 27000, 3),
  ('Taro Latte', 'Susu dengan taro ungu yang manis dan wangi.', 'non_kopi', 27000, 4),
  ('Thai Milk Tea', 'Teh Thailand dengan susu. Manis, pekat, dan segar kalau dingin.', 'non_kopi', 24000, 5),
  ('Iced Lemon Tea', 'Teh hitam dingin dengan perasan lemon. Ringan dan menyegarkan.', 'non_kopi', 18000, 6),
  -- Makanan
  ('Butter Croissant', 'Croissant renyah berlapis mentega. Paling enak selagi hangat.', 'makanan', 22000, 1),
  ('Cheese Croissant', 'Croissant dengan isian keju yang meleleh.', 'makanan', 26000, 2),
  ('Egg Mayo Sandwich', 'Roti lembut dengan telur mayo dan selada.', 'makanan', 32000, 3),
  ('Croffle Cokelat', 'Croissant yang dipanggang seperti waffle, disiram saus cokelat.', 'makanan', 35000, 4),
  -- Camilan
  ('Choco Chip Cookies', 'Cookies lembut dengan potongan cokelat.', 'camilan', 15000, 1),
  ('Fudgy Brownies', 'Brownies cokelat yang padat dan lembap.', 'camilan', 20000, 2),
  ('Blueberry Muffin', 'Muffin lembut dengan blueberry di dalamnya.', 'camilan', 22000, 3),
  ('Kentang Goreng', 'Kentang goreng renyah dengan saus sambal dan mayo.', 'camilan', 20000, 4)
) as v(nama, deskripsi, kategori, harga, urutan)
where not exists (
  select 1 from menu m where m.nama = v.nama and not m.diarsipkan
);

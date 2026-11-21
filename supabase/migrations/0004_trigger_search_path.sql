-- Hardening dari Supabase advisor (lint 0011): kunci search_path fungsi trigger.
-- Tidak mengubah tabel, relasi, maupun aturan bisnis.
alter function set_updated_at() set search_path = public;
alter function cek_transisi_pesanan() set search_path = public;

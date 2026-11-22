// Membuat 28 QR code meja (PRD 20.2).
// Pakai: node scripts/generate-qr.mjs https://domain-produksi.vercel.app
// Hasil: public/qr-meja/meja-01.svg ... meja-28.svg dan public/qr-meja/cetak.html (siap cetak).
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const JUMLAH_MEJA = 28;

const argumen = process.argv[2];
if (!argumen) {
  console.error('Berikan alamat dasar aplikasi.');
  console.error('Contoh: node scripts/generate-qr.mjs https://recoffee.vercel.app');
  process.exit(1);
}

let base;
try {
  const url = new URL(argumen);
  const lokal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !lokal) {
    throw new Error('Alamat produksi harus memakai https.');
  }
  base = url.origin;
} catch (error) {
  console.error(`Alamat tidak valid: ${error.message}`);
  process.exit(1);
}

const keluar = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'qr-meja');
await mkdir(keluar, { recursive: true });

const kartu = [];
for (let nomor = 1; nomor <= JUMLAH_MEJA; nomor += 1) {
  const dua = String(nomor).padStart(2, '0');
  const tujuan = `${base}/meja/${nomor}`;
  const svg = await QRCode.toString(tujuan, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'M',
  });
  await writeFile(join(keluar, `meja-${dua}.svg`), svg);
  kartu.push(`    <figure>
      ${svg.trim()}
      <figcaption><strong>RE:coffee</strong> — Meja ${nomor}<small>Scan, pilih menu, pesan dari meja</small></figcaption>
    </figure>`);
}

const html = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QR meja RE:coffee</title>
    <style>
      body { margin: 0; padding: 12mm; font-family: system-ui, sans-serif; color: #2b201b; }
      h1 { margin: 0 0 4mm; font-size: 14pt; }
      p.catatan { margin: 0 0 8mm; font-size: 10pt; color: #76695f; }
      main { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6mm; }
      figure { margin: 0; padding: 3mm; border: 0.3mm solid #8f8379; border-radius: 2mm; text-align: center; break-inside: avoid; }
      figure svg { width: 100%; height: auto; display: block; }
      figcaption { margin-top: 1mm; font-size: 10pt; }
      figcaption small { display: block; margin-top: 0.5mm; font-size: 7pt; color: #76695f; }
      @media print { p.catatan { display: none; } body { padding: 8mm; } }
    </style>
  </head>
  <body>
    <h1>QR meja RE:coffee</h1>
    <p class="catatan">Alamat: ${base}. Cetak halaman ini (Ctrl+P), minimal meja 1, 18, dan 27 untuk demo.</p>
    <main>
${kartu.join('\n')}
    </main>
  </body>
</html>
`;
await writeFile(join(keluar, 'cetak.html'), html);

console.log(`${JUMLAH_MEJA} QR dibuat di public/qr-meja/ untuk ${base}`);
console.log('Buka public/qr-meja/cetak.html lalu cetak.');

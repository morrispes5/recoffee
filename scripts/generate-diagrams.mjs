#!/usr/bin/env node
/**
 * Membuat diagram ERD (notasi Chen) dan LRS RE:coffee dari satu sumber data (PRD bagian 10).
 * Keluaran di docs/mppl/diagram/: erd-chen.drawio, erd-chen.svg, lrs.drawio, lrs.svg.
 * File .drawio bisa dibuka dan diedit di app.diagrams.net; .svg dipakai di laporan.
 *
 * Pemakaian: node scripts/generate-diagrams.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KELUARAN = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'mppl', 'diagram');
mkdirSync(KELUARAN, { recursive: true });

const WARNA = {
  tinta: '#2B201B',
  garis: '#E4E2DE',
  tegel: '#F4F4F2',
  blirik: '#2F6B57',
  ampas: '#76695F',
};
const FONT = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lebarTeks = (s, px = 7.4) => Math.ceil(s.length * px);

/* ------------------------------------------------------------------ */
/* ERD notasi Chen                                                     */
/* ------------------------------------------------------------------ */
const node = new Map();
const edge = []; // { a, b, total, card } antara entitas dan relasi
const lineAttr = []; // { owner, attr }

const entitas = (id, x, y) => node.set(id, { id, type: 'entity', x, y, w: 150, h: 54, label: id });
const relasi = (id, x, y) => node.set(id, { id, type: 'relation', x, y, w: 144, h: 84, label: id });

const S = 250; // jarak antar baris
entitas('MEJA', 0, 0);
relasi('Memiliki', 0, S);
entitas('SESI_MEJA', 0, S * 2);
relasi('Mengonfirmasi', 400, S * 2);
entitas('ADMIN', 800, S * 2);
relasi('Mencakup', 0, S * 3);
entitas('PESANAN', 0, S * 4);
relasi('Membuat', -400, S * 4);
entitas('PELANGGAN', -800, S * 4);
relasi('Berisi', 400, S * 4);
entitas('MENU', 800, S * 4);

// total = partisipasi total (garis ganda). card = kardinalitas di sisi entitas.
edge.push({ a: 'MEJA', b: 'Memiliki', total: false, card: '1' });
edge.push({ a: 'SESI_MEJA', b: 'Memiliki', total: true, card: 'M' });
edge.push({ a: 'ADMIN', b: 'Mengonfirmasi', total: false, card: '1' });
edge.push({ a: 'SESI_MEJA', b: 'Mengonfirmasi', total: false, card: 'M' });
edge.push({ a: 'SESI_MEJA', b: 'Mencakup', total: true, card: '1' });
edge.push({ a: 'PESANAN', b: 'Mencakup', total: true, card: 'M' });
edge.push({ a: 'PELANGGAN', b: 'Membuat', total: false, card: '1' });
edge.push({ a: 'PESANAN', b: 'Membuat', total: true, card: 'M' });
edge.push({ a: 'PESANAN', b: 'Berisi', total: true, card: 'M' });
edge.push({ a: 'MENU', b: 'Berisi', total: false, card: 'N' });

const K = (label) => ({ label, key: true });
const T = (label) => ({ label, derived: true });
const A = (label) => ({ label });
const ATRIBUT = {
  MEJA: [K('nomor'), A('kapasitas'), T('status_meja')],
  SESI_MEJA: [
    K('id'),
    A('status'),
    A('metode_bayar'),
    A('total_bayar'),
    A('dibuka_at'),
    A('minta_bill_at'),
    A('ditutup_at'),
    T('total_tagihan'),
  ],
  ADMIN: [K('email'), A('nama'), A('created_at')],
  PESANAN: [
    K('id'),
    A('status'),
    A('catatan'),
    A('created_at'),
    A('updated_at'),
    T('subtotal_pesanan'),
  ],
  PELANGGAN: [K('id'), A('email'), A('nama'), A('no_hp'), A('created_at'), A('updated_at')],
  MENU: [
    K('id'),
    A('nama'),
    A('deskripsi'),
    A('kategori'),
    A('harga'),
    A('tersedia'),
    A('diarsipkan'),
    A('urutan'),
    A('created_at'),
    A('updated_at'),
  ],
  Berisi: [A('qty'), A('harga_satuan'), A('nama_menu'), T('subtotal_item')],
};

const norm = (d) => ((d % 360) + 360) % 360;
const sudut = (dx, dy) => norm((Math.atan2(dy, dx) * 180) / Math.PI);
const tumpang = (p, q, pad = 10) =>
  Math.abs(p.x - q.x) < (p.w + q.w) / 2 + pad && Math.abs(p.y - q.y) < (p.h + q.h) / 2 + pad;

function pasangAtribut(ownerId, daftar) {
  const o = node.get(ownerId);
  const terblokir = edge
    .filter((e) => e.a === ownerId || e.b === ownerId)
    .map((e) => {
      const lain = node.get(e.a === ownerId ? e.b : e.a);
      return sudut(lain.x - o.x, lain.y - o.y);
    })
    .sort((p, q) => p - q);

  // Bagi lingkaran menjadi celah di antara arah relasi, lalu sebar atribut sesuai lebar celah.
  const celah = terblokir.map((s, i) => {
    const berikut = terblokir[(i + 1) % terblokir.length];
    const lebar = norm(berikut - s) || 360;
    return { mulai: s, lebar };
  });
  const total = celah.reduce((n, c) => n + c.lebar, 0);
  const jatah = celah.map((c) => ({
    ...c,
    n: Math.floor((c.lebar / total) * daftar.length),
    sisa: ((c.lebar / total) * daftar.length) % 1,
  }));
  let kurang = daftar.length - jatah.reduce((n, c) => n + c.n, 0);
  for (const c of [...jatah].sort((p, q) => q.sisa - p.sisa)) {
    if (kurang <= 0) break;
    c.n += 1;
    kurang -= 1;
  }

  let i = 0;
  for (const c of jatah) {
    const margin = Math.min(26, c.lebar / 5);
    for (let j = 0; j < c.n; j++) {
      const a = daftar[i++];
      const derajat = c.mulai + margin + ((j + 0.5) * (c.lebar - 2 * margin)) / c.n;
      const rad = (derajat * Math.PI) / 180;
      const w = Math.max(104, lebarTeks(a.label) + 30);
      const baru = {
        id: `${ownerId}.${a.label}`,
        type: 'attr',
        w,
        h: 40,
        label: a.label,
        key: a.key,
        derived: a.derived,
      };
      let r = o.type === 'relation' ? 140 : 150;
      do {
        baru.x = o.x + Math.cos(rad) * r * 1.25;
        baru.y = o.y + Math.sin(rad) * r;
        r += 10;
      } while ([...node.values()].some((n) => tumpang(baru, n)) && r < 700);
      node.set(baru.id, baru);
      lineAttr.push({ owner: ownerId, attr: baru.id });
    }
  }
}

for (const id of ['SESI_MEJA', 'MENU', 'PESANAN', 'PELANGGAN', 'MEJA', 'ADMIN', 'Berisi']) {
  pasangAtribut(id, ATRIBUT[id]);
}

// Titik potong garis pusat-ke-pusat dengan tepi bentuk, untuk menaruh angka kardinalitas.
function tepi(n, tujuan, jarak) {
  const dx = tujuan.x - n.x;
  const dy = tujuan.y - n.y;
  const panjang = Math.hypot(dx, dy) || 1;
  const ux = dx / panjang;
  const uy = dy / panjang;
  const t = Math.min(n.w / 2 / (Math.abs(ux) || 1e-6), n.h / 2 / (Math.abs(uy) || 1e-6));
  return { x: n.x + ux * (t + jarak) - uy * 13, y: n.y + uy * (t + jarak) + ux * 13 };
}

function erdSvg() {
  const semua = [...node.values()];
  const minX = Math.min(...semua.map((n) => n.x - n.w / 2)) - 70;
  const minY = Math.min(...semua.map((n) => n.y - n.h / 2)) - 70;
  const maxX = Math.max(...semua.map((n) => n.x + n.w / 2)) + 70;
  const maxY = Math.max(...semua.map((n) => n.y + n.h / 2)) + 70;
  const legendaTinggi = 150;
  const W = maxX - minX;
  const H = maxY - minY + legendaTinggi;
  const gx = (x) => (x - minX).toFixed(1);
  const gy = (y) => (y - minY).toFixed(1);
  const o = [];
  o.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${W.toFixed(0)}" height="${H.toFixed(0)}" font-family="${FONT}" font-size="13">`,
  );
  o.push(`<title>ERD RE:coffee (notasi Chen)</title>`);
  o.push(`<rect width="100%" height="100%" fill="#FFFFFF"/>`);

  for (const l of lineAttr) {
    const a = node.get(l.owner);
    const b = node.get(l.attr);
    o.push(
      `<line x1="${gx(a.x)}" y1="${gy(a.y)}" x2="${gx(b.x)}" y2="${gy(b.y)}" stroke="${WARNA.tinta}" stroke-width="1.2"/>`,
    );
  }
  for (const e of edge) {
    const a = node.get(e.a);
    const b = node.get(e.b);
    const p = `x1="${gx(a.x)}" y1="${gy(a.y)}" x2="${gx(b.x)}" y2="${gy(b.y)}"`;
    if (e.total) {
      o.push(`<line ${p} stroke="${WARNA.tinta}" stroke-width="7"/>`);
      o.push(`<line ${p} stroke="#FFFFFF" stroke-width="3"/>`);
    } else {
      o.push(`<line ${p} stroke="${WARNA.tinta}" stroke-width="1.6"/>`);
    }
  }
  for (const n of semua) {
    if (n.type === 'entity') {
      o.push(
        `<rect x="${gx(n.x - n.w / 2)}" y="${gy(n.y - n.h / 2)}" width="${n.w}" height="${n.h}" fill="#FFFFFF" stroke="${WARNA.tinta}" stroke-width="2"/>`,
      );
      o.push(
        `<text x="${gx(n.x)}" y="${gy(n.y)}" text-anchor="middle" dominant-baseline="central" font-weight="700" font-size="15">${esc(n.label)}</text>`,
      );
    } else if (n.type === 'relation') {
      const pts = [
        [n.x, n.y - n.h / 2],
        [n.x + n.w / 2, n.y],
        [n.x, n.y + n.h / 2],
        [n.x - n.w / 2, n.y],
      ];
      o.push(
        `<polygon points="${pts.map(([x, y]) => `${gx(x)},${gy(y)}`).join(' ')}" fill="${WARNA.tegel}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
      );
      o.push(
        `<text x="${gx(n.x)}" y="${gy(n.y)}" text-anchor="middle" dominant-baseline="central" font-weight="600">${esc(n.label)}</text>`,
      );
    } else {
      o.push(
        `<ellipse cx="${gx(n.x)}" cy="${gy(n.y)}" rx="${n.w / 2}" ry="${n.h / 2}" fill="#FFFFFF" stroke="${WARNA.tinta}" stroke-width="1.4"${n.derived ? ' stroke-dasharray="6 4"' : ''}/>`,
      );
      o.push(
        `<text x="${gx(n.x)}" y="${gy(n.y)}" text-anchor="middle" dominant-baseline="central"${n.key ? ' text-decoration="underline" font-weight="700"' : ''}>${esc(n.label)}</text>`,
      );
    }
  }
  for (const e of edge) {
    const ent = node.get(e.a);
    const rel = node.get(e.b);
    const p = tepi(ent, rel, 16);
    o.push(
      `<text x="${gx(p.x)}" y="${gy(p.y)}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="16" fill="${WARNA.blirik}">${e.card}</text>`,
    );
  }

  // Legenda
  const ly = maxY - minY - 10;
  const lx = 40;
  o.push(`<text x="${lx}" y="${ly}" font-weight="700" font-size="14">Keterangan</text>`);
  const baris = (i, gambar, teks) => {
    const x = lx + (i % 4) * 300;
    const y = ly + 34 + Math.floor(i / 4) * 44;
    o.push(gambar(x, y));
    o.push(`<text x="${x + 62}" y="${y}" dominant-baseline="central">${esc(teks)}</text>`);
  };
  baris(
    0,
    (x, y) =>
      `<rect x="${x}" y="${y - 12}" width="48" height="24" fill="#fff" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    'Entitas',
  );
  baris(
    1,
    (x, y) =>
      `<polygon points="${x + 24},${y - 14} ${x + 48},${y} ${x + 24},${y + 14} ${x},${y}" fill="${WARNA.tegel}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    'Relasi (kata kerja)',
  );
  baris(
    2,
    (x, y) =>
      `<ellipse cx="${x + 24}" cy="${y}" rx="24" ry="12" fill="#fff" stroke="${WARNA.tinta}" stroke-width="1.4"/>`,
    'Atribut',
  );
  baris(
    3,
    (x, y) =>
      `<ellipse cx="${x + 24}" cy="${y}" rx="24" ry="12" fill="#fff" stroke="${WARNA.tinta}" stroke-width="1.4"/><line x1="${x + 12}" y1="${y + 4}" x2="${x + 36}" y2="${y + 4}" stroke="${WARNA.tinta}"/>`,
    'Atribut kunci (digarisbawahi)',
  );
  baris(
    4,
    (x, y) =>
      `<ellipse cx="${x + 24}" cy="${y}" rx="24" ry="12" fill="#fff" stroke="${WARNA.tinta}" stroke-width="1.4" stroke-dasharray="5 3"/>`,
    'Atribut turunan (tidak disimpan)',
  );
  baris(
    5,
    (x, y) =>
      `<line x1="${x}" y1="${y}" x2="${x + 48}" y2="${y}" stroke="${WARNA.tinta}" stroke-width="7"/><line x1="${x}" y1="${y}" x2="${x + 48}" y2="${y}" stroke="#fff" stroke-width="3"/>`,
    'Partisipasi total (garis ganda)',
  );
  baris(
    6,
    (x, y) =>
      `<line x1="${x}" y1="${y}" x2="${x + 48}" y2="${y}" stroke="${WARNA.tinta}" stroke-width="1.6"/>`,
    'Partisipasi parsial (garis tunggal)',
  );
  baris(
    7,
    (x, y) =>
      `<text x="${x + 24}" y="${y}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="16" fill="${WARNA.blirik}">1 / M / N</text>`,
    'Kardinalitas',
  );
  o.push('</svg>');
  return o.join('\n');
}

/* ------------------------------------------------------------------ */
/* draw.io (ERD)                                                        */
/* ------------------------------------------------------------------ */
function erdDrawio() {
  const semua = [...node.values()];
  const minX = Math.min(...semua.map((n) => n.x - n.w / 2)) - 70;
  const minY = Math.min(...semua.map((n) => n.y - n.h / 2)) - 70;
  const cells = [];
  let seq = 2;
  const idDari = new Map();
  const id = (kunci) => {
    if (!idDari.has(kunci)) idDari.set(kunci, `n${seq++}`);
    return idDari.get(kunci);
  };

  for (const n of semua) {
    const x = (n.x - n.w / 2 - minX).toFixed(0);
    const y = (n.y - n.h / 2 - minY).toFixed(0);
    let gaya;
    if (n.type === 'entity')
      gaya = `rounded=0;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=${WARNA.tinta};fillColor=#FFFFFF;fontStyle=1;fontSize=14;`;
    else if (n.type === 'relation')
      gaya = `rhombus;whiteSpace=wrap;html=1;strokeWidth=2;strokeColor=${WARNA.tinta};fillColor=${WARNA.tegel};fontStyle=1;`;
    else
      gaya = `ellipse;whiteSpace=wrap;html=1;strokeColor=${WARNA.tinta};fillColor=#FFFFFF;${n.key ? 'fontStyle=5;' : ''}${n.derived ? 'dashed=1;' : ''}`;
    cells.push(
      `<mxCell id="${id(n.id)}" value="${esc(n.label)}" style="${gaya}" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${n.w}" height="${n.h}" as="geometry"/></mxCell>`,
    );
  }
  for (const l of lineAttr) {
    cells.push(
      `<mxCell id="n${seq++}" style="endArrow=none;html=1;strokeColor=${WARNA.tinta};" edge="1" parent="1" source="${id(l.owner)}" target="${id(l.attr)}"><mxGeometry relative="1" as="geometry"/></mxCell>`,
    );
  }
  for (const e of edge) {
    const gaya = e.total
      ? `shape=link;html=1;endArrow=none;startArrow=none;width=6;strokeColor=${WARNA.tinta};`
      : `endArrow=none;html=1;strokeWidth=1.6;strokeColor=${WARNA.tinta};`;
    cells.push(
      `<mxCell id="n${seq++}" style="${gaya}" edge="1" parent="1" source="${id(e.a)}" target="${id(e.b)}"><mxGeometry relative="1" as="geometry"/></mxCell>`,
    );
    const p = tepi(node.get(e.a), node.get(e.b), 16);
    cells.push(
      `<mxCell id="n${seq++}" value="${e.card}" style="text;html=1;align=center;verticalAlign=middle;fontStyle=1;fontSize=16;fontColor=${WARNA.blirik};" vertex="1" parent="1"><mxGeometry x="${(p.x - minX - 12).toFixed(0)}" y="${(p.y - minY - 11).toFixed(0)}" width="24" height="22" as="geometry"/></mxCell>`,
    );
  }
  return bungkusDrawio('ERD RE:coffee (Chen)', cells);
}

function bungkusDrawio(nama, cells) {
  return `<mxfile host="app.diagrams.net"><diagram id="${nama.replace(/\W+/g, '-').toLowerCase()}" name="${esc(nama)}"><mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="1200" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>\n`;
}

/* ------------------------------------------------------------------ */
/* LRS                                                                  */
/* ------------------------------------------------------------------ */
const P = (nama) => ({ nama, tanda: '*' });
const F = (nama) => ({ nama, tanda: '**' });
const L = (nama) => ({ nama, tanda: '' });
const REKAM = [
  { id: 'MEJA', x: 40, y: 40, kolom: [P('nomor'), L('kapasitas')] },
  {
    id: 'SESI_MEJA',
    x: 500,
    y: 40,
    kolom: [
      P('id'),
      F('nomor_meja'),
      F('dikonfirmasi_oleh'),
      L('status'),
      L('metode_bayar'),
      L('total_bayar'),
      L('dibuka_at'),
      L('minta_bill_at'),
      L('ditutup_at'),
    ],
  },
  { id: 'ADMIN', x: 960, y: 40, kolom: [P('email'), L('nama'), L('created_at')] },
  {
    id: 'PELANGGAN',
    x: 40,
    y: 430,
    kolom: [P('id'), L('email'), L('nama'), L('no_hp'), L('created_at'), L('updated_at')],
  },
  {
    id: 'PESANAN',
    x: 500,
    y: 430,
    kolom: [
      P('id'),
      F('sesi_id'),
      F('pelanggan_id'),
      L('status'),
      L('catatan'),
      L('created_at'),
      L('updated_at'),
    ],
  },
  {
    id: 'MENU',
    x: 40,
    y: 750,
    kolom: [
      P('id'),
      L('nama'),
      L('deskripsi'),
      L('kategori'),
      L('harga'),
      L('tersedia'),
      L('diarsipkan'),
      L('urutan'),
      L('created_at'),
      L('updated_at'),
    ],
  },
  {
    id: 'ITEM_PESANAN',
    x: 500,
    y: 750,
    catatan: 'UNIQUE (pesanan_id, menu_id)',
    kolom: [P('id'), F('pesanan_id'), F('menu_id'), L('nama_menu'), L('qty'), L('harga_satuan')],
  },
];
const LW = 250;
const BARIS = 26;
const tinggi = (r) => BARIS * (r.kolom.length + 1);

// Hubungan 1:M (sisi 1 lebih dulu). Garis lurus pada y/x yang beririsan.
const HUBUNGAN = [
  { satu: 'MEJA', banyak: 'SESI_MEJA', y: 79 },
  { satu: 'ADMIN', banyak: 'SESI_MEJA', y: 79 },
  { satu: 'PELANGGAN', banyak: 'PESANAN', y: 470 },
  { satu: 'MENU', banyak: 'ITEM_PESANAN', y: 790 },
  { satu: 'SESI_MEJA', banyak: 'PESANAN', x: 625 },
  { satu: 'PESANAN', banyak: 'ITEM_PESANAN', x: 625 },
];
const rek = (id) => REKAM.find((r) => r.id === id);

function garisLrs(h) {
  const a = rek(h.satu);
  const b = rek(h.banyak);
  if (h.y !== undefined) {
    const kiriAwal = a.x < b.x;
    const x1 = kiriAwal ? a.x + LW : a.x;
    const x2 = kiriAwal ? b.x : b.x + LW;
    return {
      x1,
      y1: h.y,
      x2,
      y2: h.y,
      satu: { x: x1 + (kiriAwal ? 16 : -16), y: h.y - 12 },
      banyak: { x: x2 + (kiriAwal ? -16 : 16), y: h.y - 12 },
    };
  }
  const x = h.x;
  return {
    x1: x,
    y1: a.y + tinggi(a),
    x2: x,
    y2: b.y,
    satu: { x: x + 14, y: a.y + tinggi(a) + 14 },
    banyak: { x: x + 14, y: b.y - 14 },
  };
}

function lrsSvg() {
  const lebar = 960 + LW + 40;
  const tinggiTotal = 750 + tinggi(rek('MENU')) + 150;
  const o = [];
  o.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lebar} ${tinggiTotal}" width="${lebar}" height="${tinggiTotal}" font-family="${FONT}" font-size="13">`,
  );
  o.push(`<title>LRS RE:coffee</title><rect width="100%" height="100%" fill="#FFFFFF"/>`);
  for (const h of HUBUNGAN) {
    const g = garisLrs(h);
    o.push(
      `<line x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}" stroke="${WARNA.tinta}" stroke-width="1.8"/>`,
    );
    o.push(
      `<text x="${g.satu.x}" y="${g.satu.y}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="15" fill="${WARNA.blirik}">1</text>`,
    );
    o.push(
      `<text x="${g.banyak.x}" y="${g.banyak.y}" text-anchor="middle" dominant-baseline="central" font-weight="800" font-size="15" fill="${WARNA.blirik}">M</text>`,
    );
  }
  for (const r of REKAM) {
    const t = tinggi(r);
    o.push(
      `<rect x="${r.x}" y="${r.y}" width="${LW}" height="${t}" fill="#FFFFFF" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    );
    o.push(
      `<rect x="${r.x}" y="${r.y}" width="${LW}" height="${BARIS}" fill="${WARNA.tegel}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    );
    o.push(
      `<text x="${r.x + 12}" y="${r.y + BARIS / 2}" dominant-baseline="central" font-weight="800" font-size="14">${r.id}</text>`,
    );
    r.kolom.forEach((k, i) => {
      const y = r.y + BARIS * (i + 1) + BARIS / 2;
      o.push(
        `<text x="${r.x + 12}" y="${y}" dominant-baseline="central"${k.tanda === '*' ? ' font-weight="700"' : ''}>${esc(k.nama)}</text>`,
      );
      if (k.tanda)
        o.push(
          `<text x="${r.x + LW - 12}" y="${y}" text-anchor="end" dominant-baseline="central" font-weight="800" fill="${WARNA.blirik}">${k.tanda}</text>`,
        );
    });
    if (r.catatan)
      o.push(
        `<text x="${r.x}" y="${r.y + t + 18}" font-size="12" fill="${WARNA.ampas}">${esc(r.catatan)}</text>`,
      );
  }
  const ly = 750 + tinggi(rek('MENU')) + 40;
  o.push(`<text x="40" y="${ly}" font-weight="700" font-size="14">Keterangan</text>`);
  o.push(
    `<text x="40" y="${ly + 28}">* = primary key     ** = foreign key     1 / M = kardinalitas (sisi 1 ke sisi M)</text>`,
  );
  o.push(
    `<text x="40" y="${ly + 52}">7 record: 6 entitas ERD + ITEM_PESANAN (hasil transformasi relasi M:N Berisi). Atribut turunan tidak menjadi field.</text>`,
  );
  o.push('</svg>');
  return o.join('\n');
}

function lrsDrawio() {
  const cells = [];
  let seq = 2;
  const idRek = new Map();
  for (const r of REKAM) {
    const id = `r${seq++}`;
    idRek.set(r.id, id);
    const t = tinggi(r);
    cells.push(
      `<mxCell id="${id}" value="${r.id}" style="swimlane;fontStyle=1;fontSize=14;startSize=${BARIS};horizontal=1;strokeColor=${WARNA.tinta};strokeWidth=2;fillColor=${WARNA.tegel};swimlaneFillColor=#FFFFFF;" vertex="1" parent="1"><mxGeometry x="${r.x}" y="${r.y}" width="${LW}" height="${t}" as="geometry"/></mxCell>`,
    );
    r.kolom.forEach((k, i) => {
      const nama = k.tanda ? `${k.nama}  ${k.tanda}` : k.nama;
      cells.push(
        `<mxCell id="f${seq++}" value="${esc(nama)}" style="text;html=1;align=left;verticalAlign=middle;spacingLeft=10;${k.tanda === '*' ? 'fontStyle=1;' : ''}" vertex="1" parent="${id}"><mxGeometry y="${BARIS * (i + 1)}" width="${LW}" height="${BARIS}" as="geometry"/></mxCell>`,
      );
    });
    if (r.catatan) {
      cells.push(
        `<mxCell id="c${seq++}" value="${esc(r.catatan)}" style="text;html=1;align=left;fontSize=12;fontColor=${WARNA.ampas};" vertex="1" parent="1"><mxGeometry x="${r.x}" y="${r.y + t + 4}" width="${LW}" height="20" as="geometry"/></mxCell>`,
      );
    }
  }
  for (const h of HUBUNGAN) {
    const g = garisLrs(h);
    cells.push(
      `<mxCell id="e${seq++}" value="" style="endArrow=none;html=1;strokeWidth=1.8;strokeColor=${WARNA.tinta};" edge="1" parent="1"><mxGeometry relative="1" as="geometry"><mxPoint x="${g.x1}" y="${g.y1}" as="sourcePoint"/><mxPoint x="${g.x2}" y="${g.y2}" as="targetPoint"/></mxGeometry></mxCell>`,
    );
    for (const [teks, p] of [
      ['1', g.satu],
      ['M', g.banyak],
    ]) {
      cells.push(
        `<mxCell id="t${seq++}" value="${teks}" style="text;html=1;align=center;verticalAlign=middle;fontStyle=1;fontSize=15;fontColor=${WARNA.blirik};" vertex="1" parent="1"><mxGeometry x="${p.x - 12}" y="${p.y - 11}" width="24" height="22" as="geometry"/></mxCell>`,
      );
    }
  }
  return bungkusDrawio('LRS RE:coffee', cells);
}

// Diekspor agar nama field LRS bisa dicocokkan dengan skema database (lihat docs/mppl/05-erd-lrs.md).
export { REKAM };

writeFileSync(join(KELUARAN, 'erd-chen.svg'), erdSvg());
writeFileSync(join(KELUARAN, 'erd-chen.drawio'), erdDrawio());
writeFileSync(join(KELUARAN, 'lrs.svg'), lrsSvg());
writeFileSync(join(KELUARAN, 'lrs.drawio'), lrsDrawio());
console.log('Diagram tersimpan di', KELUARAN);

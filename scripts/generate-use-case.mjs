#!/usr/bin/env node
/**
 * Membuat diagram use case RE:coffee (PRD bagian 9) dari satu sumber data.
 * Keluaran di docs/mppl/diagram/: use-case.svg dan use-case.drawio.
 * File .drawio bisa dibuka dan diedit di app.diagrams.net; .svg dipakai di laporan.
 *
 * Pemakaian: node scripts/generate-use-case.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KELUARAN = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'mppl', 'diagram');
mkdirSync(KELUARAN, { recursive: true });

const WARNA = {
  tinta: '#2B201B',
  tegel: '#F4F4F2',
  blirik: '#2F6B57',
  ampas: '#76695F',
};
const FONT = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const LEBAR = 1240;
const TINGGI = 800;
const BATAS = { x: 200, y: 20, w: 840, h: 750 };

const EW = 230; // lebar elips use case
const EH = 60; // tinggi elips use case

/** Use case: { id, cx, cy, baris[], w? } */
const uc = (id, cx, cy, baris, w = EW, h = EH) => ({ id, cx, cy, baris, w, h });

const U = {
  uc01: uc('UC-01', 360, 100, ['UC-01 Melihat menu']),
  uc02: uc('UC-02', 360, 200, ['UC-02 Mengelola keranjang']),
  uc03: uc('UC-03', 360, 300, ['UC-03 Mengirim pesanan']),
  uc04: uc('UC-04', 360, 400, ['UC-04 Melihat tagihan meja']),
  uc05: uc('UC-05', 360, 500, ['UC-05 Minta bill dan', 'pilih metode bayar']),
  uc12: uc('UC-12', 360, 650, ['UC-12 Masuk dengan Google dan', 'melengkapi data diri']),
  sesi: uc('Sesi', 640, 300, ['Membuat atau', 'memakai sesi meja'], 170),
  uc06: uc('UC-06', 890, 100, ['UC-06 Login dengan Google']),
  uc07: uc('UC-07', 890, 200, ['UC-07 Memantau denah meja']),
  uc09: uc('UC-09', 890, 300, ['UC-09 Membatalkan sesi meja']),
  uc10: uc('UC-10', 890, 400, ['UC-10 Mengelola antrian pesanan']),
  uc11: uc('UC-11', 890, 500, ['UC-11 Mengelola menu']),
  uc08: uc('UC-08', 890, 600, ['UC-08 Mengonfirmasi pembayaran']),
  metode: uc('Metode', 890, 710, ['Mengganti metode bayar'], EW, 56),
};

const AKTOR = {
  pelanggan: { nama: 'Pelanggan', x: 100, y: 390 },
  admin: { nama: 'Admin / Kasir', x: 1140, y: 390 },
};

const kiri = (u) => ({ x: u.cx - u.w / 2, y: u.cy });
const kanan = (u) => ({ x: u.cx + u.w / 2, y: u.cy });

/** Asosiasi aktor ke use case. */
const ASOSIASI = [
  ...['uc01', 'uc02', 'uc03', 'uc04', 'uc05', 'uc12'].map((k) => ({
    aktor: 'pelanggan',
    ke: k,
    sisi: 'kiri',
  })),
  ...['uc06', 'uc07', 'uc09', 'uc10', 'uc11', 'uc08'].map((k) => ({
    aktor: 'admin',
    ke: k,
    sisi: 'kanan',
  })),
];

const BUS_PELANGGAN = 515;
const BUS_ADMIN = 745;

/** Garis <<include>> dan <<extend>> (poligaris berpanah). */
const garis = [];
// Pelanggan: UC-03 -> sesi (lurus), UC-03/04/05 -> UC-12 (lewat bus di kanan kolom).
garis.push({
  jenis: 'include',
  titik: [kanan(U.uc03), { x: kiri(U.sesi).x, y: U.uc03.cy }],
  label: { teks: '<<include>>', x: 480, y: 290 },
});
garis.push({
  jenis: 'include',
  titik: [
    kanan(U.uc03),
    { x: BUS_PELANGGAN, y: U.uc03.cy },
    { x: BUS_PELANGGAN, y: U.uc12.cy },
    kanan(U.uc12),
  ],
  label: { teks: '<<include>>', x: 524, y: 575 },
  sambungan: [{ x: BUS_PELANGGAN, y: U.uc03.cy }],
});
for (const k of ['uc04', 'uc05']) {
  garis.push({
    jenis: 'cabang',
    titik: [kanan(U[k]), { x: BUS_PELANGGAN, y: U[k].cy }],
    sambungan: [{ x: BUS_PELANGGAN, y: U[k].cy }],
  });
}
// Admin: UC-07..UC-11 -> UC-06 lewat bus di kiri kolom.
garis.push({
  jenis: 'include',
  titik: [
    kiri(U.uc08),
    { x: BUS_ADMIN, y: U.uc08.cy },
    { x: BUS_ADMIN, y: U.uc06.cy },
    kiri(U.uc06),
  ],
  label: { teks: '<<include>>', x: 752, y: 156 },
  sambungan: [{ x: BUS_ADMIN, y: U.uc08.cy }],
});
for (const k of ['uc07', 'uc09', 'uc10', 'uc11']) {
  garis.push({
    jenis: 'cabang',
    titik: [kiri(U[k]), { x: BUS_ADMIN, y: U[k].cy }],
    sambungan: [{ x: BUS_ADMIN, y: U[k].cy }],
  });
}
// Perluasan: "Mengganti metode bayar" memperluas UC-08.
garis.push({
  jenis: 'extend',
  titik: [
    { x: U.metode.cx, y: U.metode.cy - U.metode.h / 2 },
    { x: U.uc08.cx, y: U.uc08.cy + U.uc08.h / 2 },
  ],
  label: { teks: '<<extend>>', x: 900, y: 664 },
});

/* ------------------------------------------------------------------ */
/* SVG                                                                 */
/* ------------------------------------------------------------------ */
function aktorSvg(a) {
  const { x, y } = a;
  return [
    `<circle cx="${x}" cy="${y - 40}" r="14" fill="#fff" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    `<line x1="${x}" y1="${y - 26}" x2="${x}" y2="${y + 14}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    `<line x1="${x - 24}" y1="${y - 14}" x2="${x + 24}" y2="${y - 14}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    `<line x1="${x}" y1="${y + 14}" x2="${x - 20}" y2="${y + 50}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    `<line x1="${x}" y1="${y + 14}" x2="${x + 20}" y2="${y + 50}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    `<text x="${x}" y="${y + 76}" text-anchor="middle" font-weight="700" font-size="15">${esc(a.nama)}</text>`,
  ].join('\n');
}

function useCaseSvg() {
  const o = [];
  o.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LEBAR} ${TINGGI}" width="${LEBAR}" height="${TINGGI}" font-family="${FONT}" font-size="13" fill="${WARNA.tinta}">`,
  );
  o.push(
    '<defs><marker id="panah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="' +
      WARNA.tinta +
      '" stroke-width="1.6"/></marker></defs>',
  );
  o.push(`<rect width="${LEBAR}" height="${TINGGI}" fill="#fff"/>`);
  o.push(
    `<rect x="${BATAS.x}" y="${BATAS.y}" width="${BATAS.w}" height="${BATAS.h}" rx="10" fill="none" stroke="${WARNA.tinta}" stroke-width="2"/>`,
  );
  o.push(
    `<text x="${BATAS.x + 20}" y="${BATAS.y + 28}" font-weight="800" font-size="16">Sistem RE:coffee</text>`,
  );

  // Asosiasi aktor.
  for (const s of ASOSIASI) {
    const a = AKTOR[s.aktor];
    const u = U[s.ke];
    const t = s.sisi === 'kiri' ? kiri(u) : kanan(u);
    const sx = s.sisi === 'kiri' ? a.x + 24 : a.x - 24;
    o.push(
      `<line x1="${sx}" y1="${a.y - 14}" x2="${t.x}" y2="${t.y}" stroke="${WARNA.ampas}" stroke-width="1.4"/>`,
    );
  }

  // Garis include / extend.
  for (const g of garis) {
    const pts = g.titik.map((p) => `${p.x},${p.y}`).join(' ');
    const putus = g.jenis === 'cabang' ? '' : ' stroke-dasharray="7 5"';
    const panah = g.jenis === 'cabang' ? '' : ' marker-end="url(#panah)"';
    o.push(
      `<polyline points="${pts}" fill="none" stroke="${WARNA.tinta}" stroke-width="1.6"${putus}${panah}/>`,
    );
    for (const p of g.sambungan ?? []) {
      o.push(`<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${WARNA.tinta}"/>`);
    }
    if (g.label) {
      o.push(
        `<text x="${g.label.x}" y="${g.label.y}" font-size="11" font-style="italic" fill="${WARNA.blirik}" font-weight="700">${esc(g.label.teks)}</text>`,
      );
    }
  }

  // Elips use case (digambar setelah garis agar tepinya rapi).
  for (const u of Object.values(U)) {
    o.push(
      `<ellipse cx="${u.cx}" cy="${u.cy}" rx="${u.w / 2}" ry="${u.h / 2}" fill="${WARNA.tegel}" stroke="${WARNA.tinta}" stroke-width="2"/>`,
    );
    const n = u.baris.length;
    u.baris.forEach((b, i) => {
      const y = u.cy + (i - (n - 1) / 2) * 17;
      o.push(
        `<text x="${u.cx}" y="${y}" text-anchor="middle" dominant-baseline="central">${esc(b)}</text>`,
      );
    });
  }

  o.push(aktorSvg(AKTOR.pelanggan));
  o.push(aktorSvg(AKTOR.admin));

  o.push(
    `<text x="40" y="${TINGGI - 16}" font-size="12" fill="${WARNA.ampas}">Garis putus-putus berpanah = hubungan include atau extend (panah menuju use case yang dipakai atau diperluas). Garis lurus dari aktor = asosiasi.</text>`,
  );
  o.push('</svg>');
  return o.join('\n');
}

/* ------------------------------------------------------------------ */
/* draw.io                                                             */
/* ------------------------------------------------------------------ */
function useCaseDrawio() {
  const cells = [];
  let seq = 2;
  const id = new Map();

  cells.push(
    `<mxCell id="b${seq++}" value="Sistem RE:coffee" style="rounded=1;arcSize=2;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${WARNA.tinta};strokeWidth=2;verticalAlign=top;align=left;spacingLeft=20;spacingTop=8;fontStyle=1;fontSize=16;" vertex="1" parent="1"><mxGeometry x="${BATAS.x}" y="${BATAS.y}" width="${BATAS.w}" height="${BATAS.h}" as="geometry"/></mxCell>`,
  );
  for (const [kunci, u] of Object.entries(U)) {
    const cid = `u${seq++}`;
    id.set(kunci, cid);
    cells.push(
      `<mxCell id="${cid}" value="${esc(u.baris.join(' '))}" style="ellipse;whiteSpace=wrap;html=1;fillColor=${WARNA.tegel};strokeColor=${WARNA.tinta};strokeWidth=2;" vertex="1" parent="1"><mxGeometry x="${u.cx - u.w / 2}" y="${u.cy - u.h / 2}" width="${u.w}" height="${u.h}" as="geometry"/></mxCell>`,
    );
  }
  for (const [kunci, a] of Object.entries(AKTOR)) {
    const cid = `a${seq++}`;
    id.set(kunci, cid);
    cells.push(
      `<mxCell id="${cid}" value="${esc(a.nama)}" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;strokeColor=${WARNA.tinta};strokeWidth=2;fontStyle=1;fontSize=14;" vertex="1" parent="1"><mxGeometry x="${a.x - 20}" y="${a.y - 56}" width="40" height="80" as="geometry"/></mxCell>`,
    );
  }
  for (const s of ASOSIASI) {
    cells.push(
      `<mxCell id="e${seq++}" style="endArrow=none;html=1;strokeColor=${WARNA.ampas};" edge="1" parent="1" source="${id.get(s.aktor)}" target="${id.get(s.ke)}"><mxGeometry relative="1" as="geometry"/></mxCell>`,
    );
  }
  const include = (dari, ke, jenis) =>
    cells.push(
      `<mxCell id="e${seq++}" value="&lt;&lt;${jenis}&gt;&gt;" style="endArrow=open;dashed=1;html=1;strokeColor=${WARNA.tinta};fontColor=${WARNA.blirik};fontStyle=3;" edge="1" parent="1" source="${id.get(dari)}" target="${id.get(ke)}"><mxGeometry relative="1" as="geometry"/></mxCell>`,
    );
  include('uc03', 'sesi', 'include');
  include('uc03', 'uc12', 'include');
  include('uc04', 'uc12', 'include');
  include('uc05', 'uc12', 'include');
  for (const k of ['uc07', 'uc08', 'uc09', 'uc10', 'uc11']) include(k, 'uc06', 'include');
  include('metode', 'uc08', 'extend');

  return `<mxfile host="app.diagrams.net"><diagram id="use-case-recoffee" name="Use case RE:coffee"><mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1300" pageHeight="850" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>\n`;
}

writeFileSync(join(KELUARAN, 'use-case.svg'), useCaseSvg());
writeFileSync(join(KELUARAN, 'use-case.drawio'), useCaseDrawio());
console.log('Diagram use case tersimpan di', KELUARAN);

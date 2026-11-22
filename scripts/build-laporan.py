"""Rakit laporan M8 dari docs/laporan/bab/*.md menjadi HTML siap tempel ke Google Docs.

Sintaks Markdown yang didukung (sengaja sederhana):
  # BAB I PENDAHULUAN        judul bab, halaman baru, rata tengah, dua baris (BAB I / PENDAHULUAN)
  #! KATA PENGANTAR          judul tanpa nomor bab (halaman depan), halaman baru
  ## 1.1 Judul / ### 1.1.1   subbab
  paragraf biasa             rata kiri kanan, indentasi baris pertama
  - butir / 1. butir         daftar
  | a | b |                  tabel; baris "Tabel: keterangan" tepat di atasnya memberi nomor Tabel x.y
  ![keterangan](gambar.png){lebar_cm}   gambar dengan nomor Gambar x.y di bawahnya
  <<< ... >>>                HTML mentah (sampul)
  [[DAFTAR_GAMBAR]] [[DAFTAR_TABEL]]    diisi otomatis
  \\newpage                  pindah halaman
  **tebal**, *miring*, `kode`

Pemakaian: python scripts/build-laporan.py
Keluaran: <scratchpad atau OUT_DIR>/laporan-semua.html dan laporan-<nama-file>.html per berkas bab.
"""

import base64
import html
import io
import os
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BAB = ROOT / "docs" / "laporan" / "bab"
GAMBAR_DIRS = [ROOT / "docs" / "laporan" / "gambar", ROOT / "docs" / "mppl" / "gambar", ROOT / "docs" / "mppl" / "bukti"]
OUT = Path(os.environ.get("OUT_DIR", ROOT / "docs" / "laporan" / "build"))

FONT = "font-family:'Times New Roman',serif;font-weight:normal;font-style:normal;"
P = FONT + "font-size:12pt;line-height:1.5;text-align:justify;text-indent:1.25cm;margin:0 0 6pt 0;"
P_NOINDENT = FONT + "font-size:12pt;line-height:1.5;text-align:justify;margin:0 0 6pt 0;"
LI = FONT + "font-size:12pt;line-height:1.5;text-align:justify;margin:0;"
H1 = FONT + "font-size:14pt;font-weight:bold;text-align:center;line-height:1.5;margin:0 0 18pt 0;"
H2 = FONT + "font-size:12pt;font-weight:bold;line-height:1.5;margin:12pt 0 6pt 0;"
H3 = FONT + "font-size:12pt;font-weight:bold;line-height:1.5;margin:10pt 0 4pt 0;"
CAP = FONT + "font-size:11pt;text-align:center;line-height:1.15;margin:4pt 0 12pt 0;"
CAP_T = FONT + "font-size:11pt;text-align:center;line-height:1.15;margin:12pt 0 4pt 0;"
TD = FONT + "font-size:10.5pt;line-height:1.15;border:1px solid #000;padding:3pt 5pt;vertical-align:top;"
TH = TD + "font-weight:bold;background:#D9D9D9;text-align:center;"
BREAK = '<hr style="page-break-before:always;display:none;">'
LEBAR_TEKS_PT = 396  # A4 dengan margin kiri 4 cm dan kanan 3 cm
LEBAR_MAKS_CM = 14


def inline(t: str) -> str:
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)", r"<i>\1</i>", t)
    t = re.sub(r"`(.+?)`", r"<span style=\"font-family:'Courier New',monospace;font-size:10.5pt\">\1</span>", t)
    return t


def cari_gambar(nama: str) -> Path:
    for d in GAMBAR_DIRS:
        p = d / nama
        if p.exists():
            return p
    raise SystemExit(f"Gambar tidak ditemukan: {nama}")


def data_uri(path: Path, lebar_cm: float) -> tuple[str, int, int]:
    im = Image.open(path)
    if im.mode not in ("RGB", "L"):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.convert("RGBA").split()[3])
        im = bg
    maks = 1600
    if im.width > maks:
        im = im.resize((maks, round(im.height * maks / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    if path.suffix.lower() in (".jpg", ".jpeg"):
        im.save(buf, "JPEG", quality=85)
        mime = "image/jpeg"
    else:
        im.save(buf, "PNG", optimize=True)
        mime = "image/png"
    px_w = round(min(lebar_cm, LEBAR_MAKS_CM) / 2.54 * 96)
    px_h = round(px_w * im.height / im.width)
    maks_h = round(20 / 2.54 * 96)  # tinggi maksimal 20 cm
    if px_h > maks_h:
        px_w = round(px_w * maks_h / px_h)
        px_h = maks_h
    return f"data:{mime};base64,{base64.b64encode(buf.getvalue()).decode()}", px_w, px_h


class Builder:
    def __init__(self) -> None:
        self.bab = 0
        self.no_gambar = 0
        self.no_tabel = 0
        self.daftar_gambar: list[str] = []
        self.daftar_tabel: list[str] = []
        self.tanpa_gambar = "--tanpa-gambar" in sys.argv

    def label(self, jenis: str) -> str:
        if jenis == "g":
            self.no_gambar += 1
            return f"{self.bab}.{self.no_gambar}" if self.bab else f"{self.no_gambar}"
        self.no_tabel += 1
        return f"{self.bab}.{self.no_tabel}" if self.bab else f"{self.no_tabel}"

    def tabel(self, rows: list[str], caption: str | None) -> str:
        out = []
        if caption:
            no = self.label("t")
            self.daftar_tabel.append(f"Tabel {no} {caption}")
            out.append(f'<p style="{CAP_T}"><b>Tabel {no}</b> {inline(caption)}</p>')
        cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
        head, body = cells[0], [c for c in cells[2:]]
        n = len(head)
        bobot = []
        for k in range(n):
            panjang = [len(re.sub(r"[*`]", "", r[k])) for r in [head, *body] if k < len(r)]
            bobot.append(min(max(max(panjang), 4), 60) ** 0.8)
        lebar = [round(LEBAR_TEKS_PT * b / sum(bobot)) for b in bobot]
        cols = "".join(f'<col width="{round(w * 4 / 3)}">' for w in lebar)
        out.append(f'<table width="{round(LEBAR_TEKS_PT * 4 / 3)}" style="border-collapse:collapse;width:{LEBAR_TEKS_PT}pt;margin:0 0 10pt 0"><colgroup>{cols}</colgroup>')
        out.append("<tr>" + "".join(f'<td style="{TH}width:{lebar[k]}pt">{inline(c)}</td>' for k, c in enumerate(head)) + "</tr>")
        for r in body:
            out.append("<tr>" + "".join(f'<td style="{TD}width:{lebar[k]}pt">{inline(c)}</td>' for k, c in enumerate(r)) + "</tr>")
        out.append("</table>")
        return "\n".join(out)

    def gambar(self, caption: str, nama: str, lebar: float) -> str:
        no = self.label("g")
        self.daftar_gambar.append(f"Gambar {no} {caption}")
        if self.tanpa_gambar:
            img = f'<p style="{CAP}">[gambar {html.escape(nama)}]</p>'
        else:
            uri, w, h = data_uri(cari_gambar(nama), lebar)
            img = f'<p style="text-align:center;margin:6pt 0 0 0"><img src="{uri}" width="{w}" height="{h}"></p>'
        return img + f'<p style="{CAP}"><b>Gambar {no}</b> {inline(caption)}</p>'

    def render(self, teks: str) -> str:
        lines = teks.replace("\r\n", "\n").split("\n")
        out: list[str] = []
        i = 0
        para: list[str] = []
        caption_tabel: str | None = None

        def flush() -> None:
            if para:
                out.append(f'<p style="{P}">{inline(" ".join(para))}</p>')
                para.clear()

        while i < len(lines):
            line = lines[i]
            s = line.strip()
            if s == "<<<":
                flush()
                j = lines.index(">>>", i + 1)
                raw = "\n".join(lines[i + 1 : j])
                for m in re.finditer(r"\{\{img:([^:}]+):([\d.]+)\}\}", raw):
                    uri, w, h = data_uri(cari_gambar(m.group(1)), float(m.group(2)))
                    raw = raw.replace(m.group(0), f'<img src="{uri}" width="{w}" height="{h}">')
                out.append(raw)
                i = j + 1
                continue
            if not s:
                flush()
                i += 1
                continue
            if s == "\\newpage":
                flush()
                out.append(BREAK)
                i += 1
                continue
            if s.startswith("#! "):
                flush()
                if s[3:] == "LAMPIRAN":
                    self.bab = "L"
                    self.no_gambar = self.no_tabel = 0
                out.append(BREAK)
                out.append(f'<h1 style="{H1}">{inline(s[3:])}</h1>')
                i += 1
                continue
            if s.startswith("# "):
                flush()
                m = re.match(r"# BAB ([IVX]+) (.+)", s)
                self.bab = ["I", "II", "III", "IV", "V", "VI", "VII"].index(m.group(1)) + 1
                self.no_gambar = self.no_tabel = 0
                out.append(BREAK)
                out.append(f'<h1 style="{H1}">BAB {m.group(1)} {inline(m.group(2))}</h1>')
                i += 1
                continue
            if s.startswith("### "):
                flush()
                out.append(f'<h3 style="{H3}">{inline(s[4:])}</h3>')
                i += 1
                continue
            if s.startswith("## "):
                flush()
                out.append(f'<h2 style="{H2}">{inline(s[3:])}</h2>')
                i += 1
                continue
            if s.startswith("Tabel: "):
                flush()
                caption_tabel = s[7:]
                i += 1
                continue
            if s.startswith("|"):
                flush()
                rows = []
                while i < len(lines) and lines[i].strip().startswith("|"):
                    rows.append(lines[i])
                    i += 1
                out.append(self.tabel(rows, caption_tabel))
                caption_tabel = None
                continue
            m = re.match(r"!\[(.+?)\]\((.+?)\)(\{([\d.]+)\})?$", s)
            if m:
                flush()
                out.append(self.gambar(m.group(1), m.group(2), float(m.group(4) or 14)))
                i += 1
                continue
            if re.match(r"(- |\d+\. )", s):
                flush()
                ordered = bool(re.match(r"\d+\. ", s))
                tag = "ol" if ordered else "ul"
                items = []
                while i < len(lines) and re.match(r"\s*(- |\d+\. )", lines[i]):
                    items.append(re.sub(r"^\s*(- |\d+\. )", "", lines[i]))
                    i += 1
                    while i < len(lines) and lines[i].startswith("   ") and lines[i].strip() and not re.match(r"\s*(- |\d+\. )", lines[i]):
                        items[-1] += " " + lines[i].strip()
                        i += 1
                out.append(f'<{tag} style="margin:0 0 6pt 0">' + "".join(f'<li style="{LI}">{inline(t)}</li>' for t in items) + f"</{tag}>")
                continue
            if s.startswith("[[") and s.endswith("]]"):
                flush()
                out.append(s)
                i += 1
                continue
            if s.startswith("> "):
                flush()
                out.append(f'<p style="{P_NOINDENT}"><i>{inline(s[2:])}</i></p>')
                i += 1
                continue
            para.append(s)
            i += 1
        flush()
        return "\n".join(out)


def daftar(items: list[str]) -> str:
    return "\n".join(f'<p style="{P_NOINDENT}">{html.escape(t)}</p>' for t in items)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    b = Builder()
    bagian = []
    for f in sorted(BAB.glob("*.md")):
        bagian.append((f.stem, b.render(f.read_text(encoding="utf-8"))))
    hasil = []
    for nama, h in bagian:
        h = h.replace("[[DAFTAR_GAMBAR]]", daftar(b.daftar_gambar)).replace("[[DAFTAR_TABEL]]", daftar(b.daftar_tabel))
        (OUT / f"laporan-{nama}.html").write_text(h, encoding="utf-8")
        hasil.append(h)
    (OUT / "laporan-semua.html").write_text("\n".join(hasil), encoding="utf-8")
    teks = re.sub(r"<[^>]+>", " ", "\n".join(hasil))
    teks = re.sub(r"data:image[^\"]+", "", teks)
    print(f"gambar {len(b.daftar_gambar)}, tabel {len(b.daftar_tabel)}, perkiraan karakter teks {len(re.sub(r'\s+', ' ', teks))}")
    for f in sorted(OUT.glob("laporan-*.html")):
        print(f"{f.name}  {f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()

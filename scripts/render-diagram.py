"""Render diagram laporan (Mermaid .mmd dan .svg) menjadi PNG lewat Google Chrome headless.

Pemakaian:
  python scripts/render-diagram.py                  # semua docs/laporan/diagram/*.mmd dan docs/mppl/diagram/*.svg
  python scripts/render-diagram.py wbs gantt        # hanya nama tertentu (tanpa ekstensi)

Keluaran: docs/laporan/gambar/<nama>.png, sudah dipangkas tepi putihnya.
Mermaid dimuat dari cdn.jsdelivr.net, jadi butuh internet.
"""

import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
SRC_MMD = ROOT / "docs" / "laporan" / "diagram"
SRC_SVG = ROOT / "docs" / "mppl" / "diagram"
OUT = ROOT / "docs" / "laporan" / "gambar"
BROWSER = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

HTML_MMD = """<!doctype html><html><head><meta charset="utf-8">
<style>body{{margin:0;background:#fff;font-family:Arial,sans-serif}} #d{{padding:24px;display:inline-block;{lebar}}}</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script></head>
<body><div id="d"><pre class="mermaid">{src}</pre></div>
<script>mermaid.initialize({{startOnLoad:true, theme:'base', securityLevel:'loose',
 themeVariables:{{fontFamily:'Arial', fontSize:'16px', primaryColor:'#F4F4F2', primaryBorderColor:'#2B201B',
 primaryTextColor:'#2B201B', lineColor:'#2B201B', secondaryColor:'#E8F0EC', tertiaryColor:'#FFFFFF'}},
 flowchart:{{htmlLabels:true, curve:'basis', useMaxWidth:false}}, gantt:{{barHeight:24, barGap:6, fontSize:14, sectionFontSize:15, leftPadding:260, useMaxWidth:true, topPadding:40}},
 sequence:{{mirrorActors:false, useMaxWidth:false}}}});</script></body></html>"""

HTML_SVG = """<!doctype html><html><head><meta charset="utf-8">
<style>body{{margin:0;background:#fff}} img{{display:block;margin:24px}}</style></head>
<body><img src="{src}"></body></html>"""


def shot(html: str, out: Path, width: int, height: int) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "page.html"
        page.write_text(html, encoding="utf-8")
        raw = Path(tmp) / "raw.png"
        subprocess.run(
            [BROWSER, "--headless=new", f"--user-data-dir={Path(tmp) / 'prof'}", "--no-first-run", "--disable-gpu", "--hide-scrollbars", f"--window-size={width},{height}",
             "--force-device-scale-factor=2", "--virtual-time-budget=15000", "--default-background-color=FFFFFFFF",
             f"--screenshot={raw}", page.as_uri()],
            check=True, capture_output=True, timeout=120,
        )
        im = Image.open(raw).convert("RGB")
    bg = Image.new("RGB", im.size, (255, 255, 255))
    box = ImageChops.difference(im, bg).getbbox()
    if box is None:
        raise SystemExit(f"{out.name}: gambar kosong, render gagal")
    l, t, r, b = box
    pad = 16
    im = im.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, im.width), min(b + pad, im.height)))
    if im.width >= width * 2 - 4 or im.height >= height * 2 - 4:
        print(f"PERINGATAN {out.name}: menyentuh tepi jendela, perbesar ukuran")
    im.save(out, optimize=True)
    print(f"{out.relative_to(ROOT)}  {im.width}x{im.height}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    for f in sorted(SRC_MMD.glob("*.mmd")):
        if only and f.stem not in only:
            continue
        src = f.read_text(encoding="utf-8").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        teks = f.read_text(encoding="utf-8")
        lebar = ""
        if teks.startswith("%% lebar:"):
            lebar = f"width:{int(teks.split()[2])}px"
        shot(HTML_MMD.format(src=src, lebar=lebar), OUT / f"{f.stem}.png", 2200, 2600)
    for f in sorted([*SRC_SVG.glob("*.svg"), *SRC_MMD.glob("*.svg")]):
        if only and f.stem not in only:
            continue
        shot(HTML_SVG.format(src=f.as_uri()), OUT / f"{f.stem}.png", 2000, 1700)


if __name__ == "__main__":
    main()

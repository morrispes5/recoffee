"""Diagram use case untuk laporan M8: tiga aktor (Pelanggan, Kasir, Manajer kafe).

Kasir dan Manajer adalah spesialisasi aktor Admin (generalisasi UML), karena di aplikasi keduanya memakai peran admin
yang sama (email terdaftar di tabel `admin`). Admin mewarisi UC-06 Login ke keduanya.

Pemakaian: python scripts/generate-use-case-laporan.py
Keluaran: docs/laporan/diagram/use-case-3-aktor.svg (dirender ke PNG oleh scripts/render-diagram.py)
"""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "docs" / "laporan" / "diagram" / "use-case-3-aktor.svg"
W, H = 1480, 900
INK = "#2B201B"
FONT = "Arial, sans-serif"
EW, EH = 230, 62

UC = {  # id: (cx, cy, baris)
    "uc01": (395, 110, ["UC-01 Melihat menu"]),
    "uc02": (395, 215, ["UC-02 Mengelola keranjang"]),
    "uc03": (395, 320, ["UC-03 Mengirim pesanan"]),
    "uc04": (395, 425, ["UC-04 Melihat tagihan meja"]),
    "uc05": (395, 530, ["UC-05 Minta bill dan", "pilih metode bayar"]),
    "sesi": (705, 175, ["Membuat atau", "memakai sesi meja"]),
    "uc12": (720, 600, ["UC-12 Masuk dengan Google", "dan melengkapi data diri"]),
    "metode": (705, 450, ["Mengganti", "metode bayar"]),
    "uc06": (985, 110, ["UC-06 Login dengan Google"]),
    "uc07": (985, 220, ["UC-07 Memantau denah meja"]),
    "uc10": (985, 325, ["UC-10 Mengelola antrian", "pesanan"]),
    "uc08": (985, 430, ["UC-08 Mengonfirmasi", "pembayaran"]),
    "uc09": (985, 535, ["UC-09 Membatalkan sesi meja"]),
    "uc11": (985, 690, ["UC-11 Mengelola menu"]),
    "uc13": (985, 795, ["UC-13 Melihat ringkasan", "penjualan hari ini"]),
}
SMALL = {"sesi", "metode"}

AKTOR = {
    "Pelanggan": (110, 330),
    "Admin": (1370, 110),
    "Kasir": (1260, 395),
    "Manajer kafe": (1390, 720),
}

ASOSIASI = [("Pelanggan", k) for k in ("uc01", "uc02", "uc03", "uc04", "uc05")]
ASOSIASI += [("Admin", "uc06")]
ASOSIASI += [("Kasir", k) for k in ("uc07", "uc10", "uc08", "uc09")]
ASOSIASI += [("Manajer kafe", k) for k in ("uc11", "uc13")]

# (dari, ke, label)
PANAH = [
    ("uc03", "sesi", "«include»"),
    ("uc03", "uc12", "«include»"),
    ("uc04", "uc12", "«include»"),
    ("uc05", "uc12", "«include»"),
    ("metode", "uc08", "«extend»"),
]


def ellipse_w(k: str) -> int:
    return 180 if k in SMALL else EW


def edge(k: str, tx: float, ty: float) -> tuple[float, float]:
    """Titik di tepi elips k ke arah (tx, ty)."""
    cx, cy, _ = UC[k]
    a, b = ellipse_w(k) / 2, EH / 2
    dx, dy = tx - cx, ty - cy
    import math

    t = 1 / math.sqrt((dx * dx) / (a * a) + (dy * dy) / (b * b))
    return cx + dx * t, cy + dy * t


def actor(nama: str, x: float, y: float) -> str:
    return (
        f'<g stroke="{INK}" stroke-width="2.2" fill="none">'
        f'<circle cx="{x}" cy="{y - 42}" r="13" fill="#fff"/>'
        f'<line x1="{x}" y1="{y - 29}" x2="{x}" y2="{y + 8}"/>'
        f'<line x1="{x - 22}" y1="{y - 16}" x2="{x + 22}" y2="{y - 16}"/>'
        f'<line x1="{x}" y1="{y + 8}" x2="{x - 18}" y2="{y + 38}"/>'
        f'<line x1="{x}" y1="{y + 8}" x2="{x + 18}" y2="{y + 38}"/></g>'
        f'<text x="{x}" y="{y + 62}" text-anchor="middle" font-family="{FONT}" font-size="17" '
        f'font-weight="bold" fill="{INK}">{nama}</text>'
    )


def main() -> None:
    s = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
        "<defs>",
        f'<marker id="buka" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">'
        f'<path d="M0,0 L10,6 L0,12" fill="none" stroke="{INK}" stroke-width="1.6"/></marker>',
        f'<marker id="segitiga" markerWidth="18" markerHeight="18" refX="16" refY="9" orient="auto">'
        f'<path d="M0,0 L16,9 L0,18 Z" fill="#fff" stroke="{INK}" stroke-width="1.6"/></marker>',
        "</defs>",
        f'<rect width="{W}" height="{H}" fill="#fff"/>',
        f'<rect x="255" y="40" width="895" height="830" fill="none" stroke="{INK}" stroke-width="2"/>',
        f'<text x="702" y="68" text-anchor="middle" font-family="{FONT}" font-size="19" font-weight="bold" '
        f'fill="{INK}">Sistem RE:coffee</text>',
    ]
    for a, k in ASOSIASI:
        ax, ay = AKTOR[a]
        ex, ey = edge(k, ax, ay - 10)
        s.append(f'<line x1="{ax}" y1="{ay - 10}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{INK}" stroke-width="1.6"/>')
    for gen in ("Kasir", "Manajer kafe"):
        gx, gy = AKTOR[gen]
        px, py = AKTOR["Admin"]
        s.append(
            f'<line x1="{gx}" y1="{gy - 60}" x2="{px}" y2="{py + 75}" stroke="{INK}" stroke-width="1.6" '
            f'marker-end="url(#segitiga)"/>'
        )
    for a, b, label in PANAH:
        bx, by, _ = UC[b]
        ax0, ay0, _ = UC[a]
        x1, y1 = edge(a, bx, by)
        x2, y2 = edge(b, ax0, ay0)
        s.append(
            f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{INK}" stroke-width="1.5" '
            f'stroke-dasharray="7 5" marker-end="url(#buka)"/>'
        )
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        s.append(
            f'<text x="{mx:.1f}" y="{my - 6:.1f}" text-anchor="middle" font-family="{FONT}" font-size="13" '
            f'font-style="italic" fill="{INK}" stroke="#fff" stroke-width="4" paint-order="stroke">{label}</text>'
        )
    for k, (cx, cy, baris) in UC.items():
        w = ellipse_w(k)
        fill = "#F4F4F2" if k in SMALL else "#E8F0EC"
        s.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{w / 2}" ry="{EH / 2}" fill="{fill}" stroke="{INK}" stroke-width="1.6"/>')
        y0 = cy - (len(baris) - 1) * 9 + 5
        for i, t in enumerate(baris):
            s.append(
                f'<text x="{cx}" y="{y0 + i * 18}" text-anchor="middle" font-family="{FONT}" font-size="14.5" '
                f'fill="{INK}">{t}</text>'
            )
    for nama, (x, y) in AKTOR.items():
        s.append(actor(nama, x, y))
    s.append(
        f'<text x="1240" y="185" text-anchor="middle" font-family="{FONT}" font-size="12.5" fill="#76695F">'
        f"generalisasi: Kasir dan</text>"
        f'<text x="1240" y="201" text-anchor="middle" font-family="{FONT}" font-size="12.5" fill="#76695F">'
        f"Manajer mewarisi Admin</text>"
    )
    s.append("</svg>")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(s), encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()

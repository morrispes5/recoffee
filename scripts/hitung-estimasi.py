"""Hitung estimasi PERT, jadwal 5 minggu, dan anggaran SDM untuk laporan MPPL RE:coffee (M8).

Skenario laporan: satu project manager diberi waktu 5 minggu (19 Okt sampai 22 Nov 2026, Senin sampai Sabtu,
6 jam per hari kerja). Semua peran dijalankan satu orang, jadi paket kerja dijadwalkan berurutan.
Tarif per jam adalah asumsi simulasi.

Pemakaian: python scripts/hitung-estimasi.py  (mencetak tabel Markdown untuk BAB III)
"""

from datetime import date, timedelta
from math import erf, sqrt

JAM_PER_HARI = 6
MULAI = date(2026, 10, 19)  # Senin, minggu 1

TARIF = {  # Rupiah per jam (asumsi)
    "Project Manager": 50_000,
    "System Analyst": 45_000,
    "UI/UX Designer": 40_000,
    "Programmer": 60_000,
    "Tester": 35_000,
}

# kode, paket kerja, peran, optimistic, most likely, pessimistic (hari kerja), pendahulu
WBS = [
    ("1.1", "Kick-off dan identifikasi kebutuhan klien", "Project Manager", 0.5, 1, 2, "-"),
    ("1.2", "Project charter dan analisis stakeholder", "Project Manager", 0.5, 1, 2, "1.1"),
    ("1.3", "Ruang lingkup, WBS, dan estimasi pekerjaan", "Project Manager", 0.5, 1, 1.5, "1.2"),
    ("1.4", "Jadwal, anggaran, dan manajemen risiko", "Project Manager", 0.5, 1, 2, "1.3"),
    ("2.1", "Analisis kebutuhan dan analisis data", "System Analyst", 1, 2, 3, "1.4"),
    ("2.2", "Pemodelan proses: use case, activity, sequence, user flow", "System Analyst", 1, 2, 4, "2.1"),
    ("2.3", "Perancangan basis data: ERD, LRS, kamus data", "System Analyst", 1, 1.5, 3, "2.1"),
    ("2.4", "Design system dan mockup antarmuka", "UI/UX Designer", 1, 2, 3, "2.2"),
    ("3.1", "Setup proyek dan database Supabase (RLS, function)", "Programmer", 1.5, 2, 4, "2.3"),
    ("3.2", "Frontend pelanggan", "Programmer", 2, 3, 5, "2.4, 3.1"),
    ("3.3", "Frontend kasir dan manajer", "Programmer", 2, 3, 5, "2.4, 3.1"),
    ("3.4", "Integrasi dan deployment Vercel", "Programmer", 1, 2, 3, "3.2, 3.3"),
    ("4.1", "Unit test dan black box testing", "Tester", 1, 2, 3, "3.4"),
    ("4.2", "User acceptance test (UAT)", "Tester", 0.5, 1, 2, "4.1"),
    ("4.3", "Perbaikan bug, QR meja, dan rilis", "Programmer", 0.5, 1, 2, "4.2"),
    ("4.4", "Laporan akhir, demo, dan serah terima", "Project Manager", 1, 2, 3, "4.3"),
]


def rp(n: float) -> str:
    return "Rp" + f"{round(n):,}".replace(",", ".")


def koma(x: float, d: int = 2) -> str:
    return f"{x:.{d}f}".replace(".", ",")


def hari_ke_tanggal(h: float) -> date:
    """Hari kerja ke-h (0 = awal Senin minggu 1) ke tanggal kalender, Senin sampai Sabtu."""
    penuh = int(h)
    minggu, sisa = divmod(penuh, 6)
    return MULAI + timedelta(days=minggu * 7 + sisa)


def main() -> None:
    rows = []
    t = 0.0
    total_e = total_var = 0.0
    for kode, nama, peran, o, m, p, pend in WBS:
        e = (o + 4 * m + p) / 6
        sd = (p - o) / 6
        mulai, selesai = t, t + e
        t = selesai
        total_e += e
        total_var += sd * sd
        rows.append((kode, nama, peran, o, m, p, e, sd, pend, mulai, selesai))

    print("## Tabel PERT\n")
    print("| Kode | Paket kerja | Peran | O | M | P | TE | SD |")
    print("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for kode, nama, peran, o, m, p, e, sd, *_ in rows:
        print(f"| {kode} | {nama} | {peran} | {koma(o,1)} | {koma(m,1)} | {koma(p,1)} | {koma(e)} | {koma(sd)} |")
    sd_total = sqrt(total_var)
    print(f"| | **Total** | | | | | **{koma(total_e)}** | |")
    print(f"\nTotal TE = {koma(total_e)} hari; varian = {koma(total_var,3)}; SD proyek = {koma(sd_total)} hari")
    for target in (30,):
        z = (target - total_e) / sd_total
        prob = 0.5 * (1 + erf(z / sqrt(2)))
        print(f"Target {target} hari: z = {koma(z)}; peluang selesai = {koma(prob*100,1)}%")

    print("\n## Jadwal (hari kerja Senin sampai Sabtu)\n")
    print("| Kode | Paket kerja | Pendahulu | Mulai (hari ke-) | Selesai (hari ke-) | Tanggal mulai | Tanggal selesai | Minggu |")
    print("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for kode, nama, peran, o, m, p, e, sd, pend, mulai, selesai in rows:
        tm = hari_ke_tanggal(mulai)
        ts = hari_ke_tanggal(max(selesai - 0.001, mulai))
        mg = f"{int(mulai)//6+1}" if int(mulai)//6 == int(max(selesai-0.001,0))//6 else f"{int(mulai)//6+1} sampai {int(max(selesai-0.001,0))//6+1}"
        print(f"| {kode} | {nama} | {pend} | {koma(mulai)} | {koma(selesai)} | {tm:%d/%m} | {ts:%d/%m} | {mg} |")

    print("\n## Mermaid gantt (tanggal)\n")
    for kode, nama, peran, o, m, p, e, sd, pend, mulai, selesai in rows:
        tm = hari_ke_tanggal(mulai)
        ts = hari_ke_tanggal(max(selesai - 0.001, mulai))
        durasi = (ts - tm).days + 1
        print(f"  {kode} {nama} :t{kode.replace('.','')}, {tm.isoformat()}, {durasi}d")

    print("\n## Biaya SDM\n")
    per_peran: dict[str, float] = {}
    for kode, nama, peran, o, m, p, e, *_ in rows:
        per_peran[peran] = per_peran.get(peran, 0) + e
    print("| Peran | Hari (TE) | Jam | Tarif per jam | Subtotal |")
    print("| --- | --- | --- | --- | --- |")
    total_sdm = 0
    total_jam = 0
    for peran in TARIF:
        hari = per_peran.get(peran, 0)
        jam = round(hari * JAM_PER_HARI)
        sub = jam * TARIF[peran]
        total_sdm += sub
        total_jam += jam
        print(f"| {peran} | {koma(hari)} | {jam} | {rp(TARIF[peran])} | {rp(sub)} |")
    print(f"| **Total** | | **{total_jam}** | | **{rp(total_sdm)}** |")

    print("\n## Biaya per paket kerja\n")
    print("| Kode | Paket kerja | Jam | Biaya |")
    print("| --- | --- | --- | --- |")
    for kode, nama, peran, o, m, p, e, *_ in rows:
        jam = e * JAM_PER_HARI
        print(f"| {kode} | {nama} | {koma(jam,1)} | {rp(jam * TARIF[peran])} |")
    print(f"\nTotal SDM = {rp(total_sdm)}")


if __name__ == "__main__":
    main()

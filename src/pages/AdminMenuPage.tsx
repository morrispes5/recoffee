import { MenuTable } from '../features/admin-menu/MenuTable';

/** `/admin/menu` Kelola menu (PRD 16.9). */
export default function AdminMenuPage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-display-l">Kelola menu</h1>
        <p className="mt-2 text-ampas">
          Menu tidak bisa dihapus permanen, hanya diarsipkan, agar riwayat tagihan tetap utuh.
        </p>
      </div>
      <MenuTable />
    </section>
  );
}

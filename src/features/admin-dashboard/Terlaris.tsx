import { ChartBar } from '@phosphor-icons/react';
import { formatRupiah } from '../../lib/format';
import type { MenuTerlaris } from './api';

/** Lima menu terlaris hari ini sebagai batang horizontal (lebar relatif terhadap teratas). */
export function Terlaris({ data }: { data: MenuTerlaris[] }) {
  if (data.length === 0) {
    return (
      <p className="flex items-center gap-3 rounded-ui bg-tegel px-4 py-4 text-body-s text-ampas">
        <ChartBar size={20} aria-hidden="true" />
        Belum ada pesanan hari ini.
      </p>
    );
  }
  const maks = data[0]?.qty ?? 1;
  return (
    <ol className="flex flex-col gap-4">
      {data.map((m, i) => (
        <li key={m.nama_menu} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-body-s">
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="text-ampas tabular-nums">{i + 1}.</span>
              <span className="truncate font-semibold">{m.nama_menu}</span>
            </span>
            <span className="shrink-0 text-ampas tabular-nums">
              {m.qty} porsi, {formatRupiah(m.omzet)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-tegel" aria-hidden="true">
            <div
              className="h-full origin-left animate-tumbuh rounded-full bg-blirik"
              style={{
                width: `${Math.max(6, (m.qty / maks) * 100)}%`,
                animationDelay: `${i * 80}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

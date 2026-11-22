import type { JSX } from 'react';
import type { KategoriMenu } from '../../../types/domain';
import { Croissant } from './Croissant';
import { Daun } from './Daun';
import { GelasEs } from './GelasEs';
import type { IconProps } from './IconBase';
import { Kue } from './Kue';

const IKON = {
  kopi: GelasEs,
  non_kopi: Daun,
  makanan: Croissant,
  camilan: Kue,
} as const satisfies Record<KategoriMenu, (props: IconProps) => JSX.Element>;

/** Ikon kategori menu (PRD 15.6, direvisi 22 Nov 2026 untuk tema kafe kekinian). */
export function IkonKategori({ kategori, ...props }: IconProps & { kategori: KategoriMenu }) {
  const Ikon = IKON[kategori];
  return <Ikon {...props} />;
}

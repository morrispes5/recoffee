import type { JSX } from 'react';
import type { KategoriMenu } from '../../../types/domain';
import { GelasBlirik } from './GelasBlirik';
import type { IconProps } from './IconBase';
import { KalengKerupuk } from './KalengKerupuk';
import { PiringRoti } from './PiringRoti';
import { Teko } from './Teko';

const IKON = {
  kopi: GelasBlirik,
  non_kopi: Teko,
  makanan: PiringRoti,
  camilan: KalengKerupuk,
} as const satisfies Record<KategoriMenu, (props: IconProps) => JSX.Element>;

/** Ikon kategori menu (PRD 15.6). */
export function IkonKategori({ kategori, ...props }: IconProps & { kategori: KategoriMenu }) {
  const Ikon = IKON[kategori];
  return <Ikon {...props} />;
}

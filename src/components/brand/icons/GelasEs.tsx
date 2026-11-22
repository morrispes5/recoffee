import { IconBase, type IconProps } from './IconBase';

/** Gelas kopi es dengan tutup kubah, sedotan, dan dua es batu: ikon kategori kopi. */
export function GelasEs(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 8.5l1 11a1.8 1.8 0 0 0 1.8 1.6h4.4a1.8 1.8 0 0 0 1.8-1.6l1-11" />
      <path d="M5.5 8.5h13" />
      <path d="M6.5 8.5C6.5 6 9 4.5 12 4.5s5.5 1.5 5.5 4" />
      <path d="M13 4.5L14.5 2h2.5" />
      <path d="M9.6 12.5h2.2v2.2H9.6zM12.4 15.6h2.2v2.2h-2.2z" />
    </IconBase>
  );
}

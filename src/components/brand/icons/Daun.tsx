import { IconBase, type IconProps } from './IconBase';

/** Daun dengan tulang daun: ikon kategori non-kopi (matcha, teh). */
export function Daun(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 19C4.5 10.5 9.5 5 19.5 4.5 20 14.5 14.5 19.5 5 19z" />
      <path d="M5 19c3.5-5 7.5-9 11-11.5" />
      <path d="M5 19l-1.5 2" />
    </IconBase>
  );
}

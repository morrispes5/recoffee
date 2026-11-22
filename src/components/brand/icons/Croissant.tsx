import { IconBase, type IconProps } from './IconBase';

/** Croissant berlekuk: ikon kategori makanan. */
export function Croissant(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3.5 15.5C3.5 10.5 7.5 6.5 12 6.5s8.5 4 8.5 9l-3 2-3-2.5-2.5 2.5-2.5-2.5-3 2.5z" />
      <path d="M8.2 8.2l1.3 6.3M15.8 8.2l-1.3 6.3M12 6.5v7.5" />
    </IconBase>
  );
}

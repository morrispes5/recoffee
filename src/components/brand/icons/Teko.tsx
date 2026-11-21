import { IconBase, type IconProps } from './IconBase';

/** Teko teh: pegangan tutup, tutup, badan, cerat, dan gagang. */
export function Teko(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4.5v1" />
      <path d="M9.5 8.5a2.5 2.5 0 0 1 5 0" />
      <path d="M6.5 8.5h11" />
      <path d="M7 8.5l.6 8.2a2.5 2.5 0 0 0 2.5 2.3h3.8a2.5 2.5 0 0 0 2.5-2.3l.6-8.2" />
      <path d="M7.3 12.5C5.5 12.5 4.5 11.4 3.5 9.5" />
      <path d="M16.8 10.5h.7a2.5 2.5 0 0 1 0 5h-1" />
    </IconBase>
  );
}

import { IconBase, type IconProps } from './IconBase';

/** Tiga garis uap bergelombang di atas minuman panas. */
export function Uap(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 20c-1.25-1.5 1.25-3 0-4.5s1.25-3 0-4.5" />
      <path d="M12 20c-1.25-1.75 1.25-3.5 0-5.25S13.25 11.25 12 9.5 13.25 6 12 4.25" />
      <path d="M16 20c-1.25-1.5 1.25-3 0-4.5s1.25-3 0-4.5" />
    </IconBase>
  );
}

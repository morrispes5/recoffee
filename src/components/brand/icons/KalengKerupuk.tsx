import { IconBase, type IconProps } from './IconBase';

/** Kaleng kerupuk warung: tutup, badan kotak, jendela bulat berisi kerupuk. */
export function KalengKerupuk(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5V7H5V4.5z" />
      <path d="M6 7v12a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7" />
      <circle cx="12" cy="13.5" r="3.5" />
      <path d="M10 13.75c.67-.67 1.33-.67 2 0s1.33.67 2 0" />
    </IconBase>
  );
}

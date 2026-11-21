import { IconBase, type IconProps } from './IconBase';

/** Roti bakar setangkup di atas piring. */
export function PiringRoti(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7.5 15V10a2.75 2.75 0 0 1 1.25-5.2h6.5A2.75 2.75 0 0 1 16.5 10v5" />
      <path d="M10 9.25h4" />
      <path d="M3 17h18l-1.4 2.1a2 2 0 0 1-1.66.9H6.06a2 2 0 0 1-1.66-.9L3 17z" />
    </IconBase>
  );
}

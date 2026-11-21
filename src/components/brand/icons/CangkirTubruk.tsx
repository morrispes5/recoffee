import { IconBase, type IconProps } from './IconBase';

/** Cangkir kopi tubruk di atas lepek, dengan ampas di permukaan. */
export function CangkirTubruk(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5.5 9h11v3.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9z" />
      <path d="M16.5 10.5h1a2.25 2.25 0 0 1 0 4.5h-1.6" />
      <path d="M3.5 20.5h15" />
      <path d="M8.75 11.75h.01M11.25 12.75h.01M13.5 11.5h.01" strokeWidth={2} />
    </IconBase>
  );
}

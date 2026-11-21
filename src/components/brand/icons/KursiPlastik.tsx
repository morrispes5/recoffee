import { IconBase, type IconProps } from './IconBase';

/** Kursi plastik warung: sandaran berlubang, dudukan, empat kaki. */
export function KursiPlastik(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7.5 3.5h9a1 1 0 0 1 1 1V9a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4.5a1 1 0 0 1 1-1z" />
      <path d="M10 6.5h4" />
      <path d="M8 9.5V12M16 9.5V12" />
      <path d="M5 12h14" />
      <path d="M6.5 12l-1 8.5M17.5 12l1 8.5M9 12l.5 5.5M15 12l-.5 5.5" />
    </IconBase>
  );
}

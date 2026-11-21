import { IconBase, type IconProps } from './IconBase';

/** Gelas enamel blirik: bibir gelas, badan, gagang, dan bintik khas. */
export function GelasBlirik(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 5.5h12" />
      <path d="M5.25 5.5v12.75a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2V5.5" />
      <path d="M15.75 9h1.25a2.5 2.5 0 0 1 0 5h-1.25" />
      <path d="M8.25 9.5h.01M12 11.25h.01M9 14.75h.01M12.75 16.5h.01" strokeWidth={2} />
    </IconBase>
  );
}

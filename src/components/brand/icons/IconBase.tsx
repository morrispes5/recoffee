import type { ReactNode, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Ukuran sisi dalam px. Default 24. */
  size?: number;
  /** Isi untuk aria-label. Tanpa title, ikon dianggap dekoratif (aria-hidden). */
  title?: string;
}

/**
 * Kerangka ikon brand (PRD 15.6): viewBox 24×24, stroke 1.5, ujung bulat, tanpa fill, currentColor.
 * Semua path ditulis tangan, bukan hasil AI generator.
 */
export function IconBase({
  size = 24,
  title,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

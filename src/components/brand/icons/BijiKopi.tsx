import { IconBase, type IconProps } from './IconBase';

export interface BijiKopiProps extends IconProps {
  /** true = biji diisi warna (untuk logo), garis tengah memakai warna latar. */
  filled?: boolean;
  /** Warna garis tengah saat filled. Default putih. */
  creaseColor?: string;
}

/** Biji kopi: elips miring dengan garis tengah berbentuk S. */
export function BijiKopi({ filled = false, creaseColor = '#ffffff', ...props }: BijiKopiProps) {
  return (
    <IconBase {...props}>
      <ellipse
        cx="12"
        cy="12"
        rx="5.75"
        ry="8.25"
        transform="rotate(35 12 12)"
        fill={filled ? 'currentColor' : 'none'}
      />
      <path
        d="M8.6 16.8c2.2-.4 2.6-2.4 3.4-4.8s1.2-4.4 3.4-4.8"
        stroke={filled ? creaseColor : 'currentColor'}
      />
    </IconBase>
  );
}

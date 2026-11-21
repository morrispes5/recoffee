import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Wajib: tombol ikon tidak punya teks, jadi label dibacakan screen reader. */
  label: string;
  variant?: 'primary' | 'aksen' | 'secondary';
  children: ReactNode;
}

const VARIANT = {
  primary: 'bg-blirik text-putih hover:bg-blirik/90 disabled:bg-garis disabled:text-ampas',
  aksen:
    'border border-blirik bg-putih text-blirik hover:bg-blirik hover:text-putih disabled:border-garis disabled:text-garis disabled:hover:bg-putih',
  secondary:
    'border border-garis bg-putih text-tubruk hover:bg-tegel disabled:text-garis disabled:hover:bg-putih',
} as const;

/** Tombol ikon 44 × 44 px untuk + / − di menu dan keranjang (PRD 15.8). */
export function IconButton({
  label,
  variant = 'secondary',
  className,
  children,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-ui transition-colors duration-150 disabled:cursor-not-allowed',
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

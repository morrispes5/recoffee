import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-blirik text-putih hover:bg-blirik/90 active:bg-blirik disabled:bg-garis disabled:text-ampas',
  secondary:
    'border border-garis bg-putih text-tubruk hover:bg-tegel disabled:text-ampas disabled:hover:bg-putih',
  ghost: 'text-tubruk hover:bg-tegel disabled:text-ampas disabled:hover:bg-transparent',
  danger:
    'border border-garis bg-putih text-kaleng hover:bg-tegel disabled:text-ampas disabled:hover:bg-putih',
};

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-ui px-4 py-2 text-body font-semibold transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100';

/** Kelas tombol, juga dipakai untuk <Link> yang tampil seperti tombol. */
export function buttonClass(variant: ButtonVariant = 'primary', fullWidth = false): string {
  return cn(BASE, VARIANT[variant], fullWidth && 'w-full');
}

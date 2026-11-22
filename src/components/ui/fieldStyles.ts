export const controlClass =
  'w-full rounded-ui border bg-putih px-3 text-body text-tubruk placeholder:text-ampas transition-colors duration-150 hover:border-ampas disabled:cursor-not-allowed disabled:bg-tegel disabled:text-ampas disabled:hover:border-batas';

export function controlState(error: string | undefined): string {
  return error ? 'border-kaleng hover:border-kaleng' : 'border-batas';
}

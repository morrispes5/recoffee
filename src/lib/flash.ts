/** Pesan sekali tampil yang dibawa lewat `navigate(to, { state: { pesan } })`. */
export function pesanDariState(state: unknown): string | null {
  if (typeof state === 'object' && state !== null && 'pesan' in state) {
    const { pesan } = state;
    if (typeof pesan === 'string') return pesan;
  }
  return null;
}

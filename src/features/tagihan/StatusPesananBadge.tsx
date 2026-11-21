import { Badge, type BadgeTone } from '../../components/ui';
import type { StatusPesanan } from '../../types/domain';

const LABEL: Record<StatusPesanan, { teks: string; tone: BadgeTone }> = {
  baru: { teks: 'Baru', tone: 'garis' },
  diproses: { teks: 'Diproses', tone: 'netral' },
  diantar: { teks: 'Diantar', tone: 'blirik' },
};

export function StatusPesananBadge({ status }: { status: StatusPesanan }) {
  const { teks, tone } = LABEL[status];
  return <Badge tone={tone}>{teks}</Badge>;
}

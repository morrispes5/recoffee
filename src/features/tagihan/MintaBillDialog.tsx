import { QrCode, Storefront } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button, Dialog, InlineMessage } from '../../components/ui';
import { toUserMessage } from '../../lib/errors';
import { formatRupiah } from '../../lib/format';
import type { MetodeBayar } from '../../types/domain';
import { useMintaBill } from './hooks';

/** Dialog pilih cara bayar: QRIS atau kasir (FR-08). */
export function MintaBillDialog({
  open,
  onClose,
  nomorMeja,
  total,
  onBerhasil,
}: {
  open: boolean;
  onClose: () => void;
  nomorMeja: number;
  total: number;
  onBerhasil: () => void;
}) {
  const minta = useMintaBill(nomorMeja);
  const [dipilih, setDipilih] = useState<MetodeBayar | null>(null);

  function pilih(metode: MetodeBayar) {
    setDipilih(metode);
    minta.mutate(metode, {
      onSuccess: () => {
        onClose();
        onBerhasil();
      },
    });
  }

  function tutup() {
    if (minta.isPending) return;
    minta.reset();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={tutup}
      title="Pilih cara bayar"
      description={`Total tagihan meja ${nomorMeja}: ${formatRupiah(total)}.`}
    >
      <div className="flex flex-col gap-3">
        <Button
          fullWidth
          onClick={() => pilih('qris')}
          loading={minta.isPending && dipilih === 'qris'}
          disabled={minta.isPending}
          icon={<QrCode size={20} aria-hidden="true" />}
        >
          Bayar pakai QRIS
        </Button>
        <Button
          fullWidth
          variant="secondary"
          onClick={() => pilih('kasir')}
          loading={minta.isPending && dipilih === 'kasir'}
          disabled={minta.isPending}
          icon={<Storefront size={20} aria-hidden="true" />}
        >
          Bayar di kasir
        </Button>
        {minta.isError ? (
          <InlineMessage tone="error">{toUserMessage(minta.error)}</InlineMessage>
        ) : null}
        <Button variant="ghost" onClick={tutup} disabled={minta.isPending}>
          Batal
        </Button>
      </div>
    </Dialog>
  );
}

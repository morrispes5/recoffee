import { useLocation } from 'react-router';
import { InlineMessage } from '../components/ui';
import { DenahMeja } from '../features/admin-meja/DenahMeja';
import { pesanDariState } from '../lib/flash';

/** `/admin` Denah meja + ringkasan (PRD 16.6). */
export default function AdminDenahPage() {
  const pesan = pesanDariState(useLocation().state);
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-display-l">Denah meja</h1>
      {pesan ? (
        <InlineMessage tone="sukses" className="max-w-xl">
          {pesan}
        </InlineMessage>
      ) : null}
      <DenahMeja />
    </section>
  );
}

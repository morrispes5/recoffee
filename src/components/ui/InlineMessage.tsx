import { CheckCircle, Info, WarningCircle } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type MessageTone = 'info' | 'sukses' | 'error';

const ICON = {
  info: <Info size={20} className="text-ampas" aria-hidden="true" />,
  sukses: <CheckCircle size={20} className="text-blirik" aria-hidden="true" />,
  error: <WarningCircle size={20} className="text-kaleng" aria-hidden="true" />,
} as const;

/** Pesan inline di dekat aksi (bukan alert()). Error diumumkan screen reader. */
export function InlineMessage({
  tone = 'info',
  children,
  action,
  className,
}: {
  tone?: MessageTone;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-ui border px-4 py-3 text-body-s text-tubruk',
        tone === 'error' ? 'border-kaleng/40' : 'border-garis',
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{ICON[tone]}</span>
      <div className="min-w-0 flex-1">{children}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

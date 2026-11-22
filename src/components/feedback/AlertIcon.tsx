import { m } from 'motion/react';
import type { ReactNode } from 'react';
import type { AlertTone } from '../../lib/alertStore';
import { CangkirTubruk, Uap } from '../brand/icons';

const BULATAN: Record<AlertTone, string> = {
  success: 'bg-blirik text-putih',
  error: 'bg-kaleng text-putih',
  warning: 'bg-lampu text-tubruk',
  info: 'bg-tegel text-tubruk',
};

const RIAK: Record<AlertTone, string> = {
  success: 'border-blirik',
  error: 'border-kaleng',
  warning: 'border-lampu',
  info: 'border-ampas',
};

function Tanda({ tone }: { tone: AlertTone }): ReactNode {
  switch (tone) {
    case 'success':
      return (
        <m.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
        />
      );
    case 'error':
      return <path d="M7 7l10 10M17 7L7 17" />;
    case 'warning':
      return <path d="M12 6.5v7M12 17.5h.01" />;
    case 'info':
      return <path d="M12 11v6M12 7.5h.01" />;
  }
}

/** Ikon alert beranimasi: centang tergambar, X bergetar, tanda seru bergoyang. */
export function AlertIcon({ tone, icon }: { tone: AlertTone; icon?: 'cup' }) {
  if (icon === 'cup') return <CupIcon />;

  const gerak =
    tone === 'error'
      ? { x: [0, -7, 7, -5, 5, 0] }
      : tone === 'warning'
        ? { rotate: [0, -10, 10, -6, 6, 0] }
        : {};

  return (
    <div className="relative mx-auto grid size-16 place-items-center">
      <m.span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full border-2 ${RIAK[tone]}`}
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.7, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
      />
      <m.span
        className={`grid size-16 place-items-center rounded-full ${BULATAN[tone]}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1, ...gerak }}
        transition={{
          scale: { type: 'spring', stiffness: 420, damping: 16, delay: 0.05 },
          x: { delay: 0.35, duration: 0.5 },
          rotate: { delay: 0.35, duration: 0.55 },
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-9"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <Tanda tone={tone} />
        </svg>
      </m.span>
    </div>
  );
}

/** Cangkir beruap untuk "pesanan terkirim": uap naik terus selama alert terbuka. */
function CupIcon() {
  return (
    <div className="relative mx-auto flex size-20 flex-col items-center justify-end text-tubruk">
      <m.span
        aria-hidden="true"
        className="absolute top-0 text-ampas"
        animate={{ y: [4, -6], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
      >
        <Uap size={30} strokeWidth={1.25} />
      </m.span>
      <m.span
        initial={{ scale: 0.4, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 14 }}
      >
        <CangkirTubruk size={56} strokeWidth={1.25} />
      </m.span>
    </div>
  );
}

import type { ReactNode } from 'react';

/** Kerangka field: label di atas, kontrol, lalu hint atau error di bawah (PRD 15.8). */
export function Field({
  id,
  label,
  hint,
  error,
  counter,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  counter?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-s font-semibold text-tubruk">
        {label}
      </label>
      {children}
      {error || hint || counter ? (
        <div className="flex items-start justify-between gap-3 text-body-s">
          {error ? (
            <p id={`${id}-pesan`} className="text-kaleng">
              {error}
            </p>
          ) : hint ? (
            <p id={`${id}-pesan`} className="text-ampas">
              {hint}
            </p>
          ) : (
            <span />
          )}
          {counter ? (
            <span className="shrink-0 text-ampas tabular-nums" aria-hidden="true">
              {counter}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

import { cn } from '../../lib/cn';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Label yang dibacakan. Tampil di samping switch kecuali hideLabel. */
  label: string;
  hideLabel?: boolean;
  /** Teks status di samping switch, mis. "Tersedia" / "Habis", agar tidak hanya warna. */
  stateText?: { on: string; off: string };
  disabled?: boolean;
}

/** Switch aksesibel (role="switch"), target sentuh 44 px. */
export function Switch({
  checked,
  onChange,
  label,
  hideLabel = false,
  stateText,
  disabled = false,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-11 items-center gap-3 rounded-ui text-body-s text-tubruk disabled:cursor-not-allowed disabled:text-ampas"
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-150',
          checked ? 'border-blirik bg-blirik' : 'border-garis bg-tegel',
          'group-disabled:opacity-60',
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 size-[1.125rem] rounded-full bg-putih transition-transform duration-150',
            checked ? 'translate-x-4' : 'translate-x-0 border border-garis',
          )}
        />
      </span>
      {hideLabel ? null : <span className="font-medium">{label}</span>}
      {stateText ? (
        <span className={hideLabel ? 'text-tubruk' : 'text-ampas'}>
          {checked ? stateText.on : stateText.off}
        </span>
      ) : null}
    </button>
  );
}

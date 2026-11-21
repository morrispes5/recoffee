import { CaretDown } from '@phosphor-icons/react';
import { useId, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Field } from './Field';
import { controlClass, controlState } from './fieldStyles';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
}

/** Select native agar ramah mobile dan keyboard. */
export function Select({ label, options, hint, error, className, ...rest }: SelectProps) {
  const id = useId();
  const adaPesan = Boolean(error || hint);
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={adaPesan ? `${id}-pesan` : undefined}
          className={cn(
            controlClass,
            'min-h-11 appearance-none py-2 pr-10',
            controlState(error),
            className,
          )}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <CaretDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ampas"
        />
      </div>
    </Field>
  );
}

import { useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Field } from './Field';
import { controlClass, controlState } from './fieldStyles';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
}

/** Textarea dengan penghitung karakter otomatis bila maxLength diisi. */
export function TextArea({
  label,
  hint,
  error,
  maxLength,
  value,
  className,
  rows = 3,
  ...rest
}: TextAreaProps) {
  const id = useId();
  const panjang = typeof value === 'string' ? value.length : 0;
  const adaPesan = Boolean(error || hint);
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      counter={maxLength ? `${panjang}/${maxLength}` : undefined}
    >
      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={adaPesan ? `${id}-pesan` : undefined}
        className={cn(controlClass, 'resize-none py-2.5', controlState(error), className)}
        {...rest}
      />
    </Field>
  );
}

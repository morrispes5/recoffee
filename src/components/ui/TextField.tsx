import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Field } from './Field';
import { controlClass, controlState } from './fieldStyles';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, className, ...rest }: TextFieldProps) {
  const id = useId();
  const adaPesan = Boolean(error || hint);
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={adaPesan ? `${id}-pesan` : undefined}
        className={cn(controlClass, 'min-h-11 py-2', controlState(error), className)}
        {...rest}
      />
    </Field>
  );
}

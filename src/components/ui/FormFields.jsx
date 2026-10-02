'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

// Shared form inputs (CLAUDE.md §1.3). Each one renders its label, an optional "(optional)" mark,
// the error message and the aria wiring (htmlFor, aria-invalid, aria-describedby).
// Other props (name, value, onChange, placeholder, disabled, autoComplete…) go to the control.

const CONTROL =
  'w-full rounded-[var(--radius-control)] border bg-surface text-[15px] text-ink transition placeholder:text-[#8A8F99] focus:border-navy disabled:cursor-not-allowed disabled:bg-selected disabled:text-muted';

function controlClasses(error, className) {
  return cn(CONTROL, error ? 'border-danger' : 'border-input', className);
}

/** Ids that link a control with its error text. */
function useFieldIds(id) {
  const generated = useId();
  const controlId = id ?? generated;
  return { controlId, errorId: `${controlId}-error` };
}

/** aria attributes shared by every control. */
function ariaProps({ error, errorId, optional }) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    'aria-required': optional ? undefined : true,
  };
}

function FieldLabel({ htmlFor, label, optional }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-bold">
      {label}
      {optional && <span className="font-medium text-muted"> (optional)</span>}
    </label>
  );
}

function FieldError({ id, error }) {
  if (!error) return null;
  return (
    <span id={id} className="text-[13px] font-semibold text-danger">
      {error}
    </span>
  );
}

function Field({ className, children }) {
  return <div className={cn('flex flex-col gap-1.5 lg:gap-2', className)}>{children}</div>;
}

export function Input({ id, label, optional = false, error, className, type = 'text', ...props }) {
  const { controlId, errorId } = useFieldIds(id);
  return (
    <Field className={className}>
      <FieldLabel htmlFor={controlId} label={label} optional={optional} />
      <input
        id={controlId}
        type={type}
        className={controlClasses(error, 'h-12 px-3.5')}
        {...ariaProps({ error, errorId, optional })}
        {...props}
      />
      <FieldError id={errorId} error={error} />
    </Field>
  );
}

/** `options`: [{ value, label }]. */
export function Select({ id, label, optional = false, error, options, className, ...props }) {
  const { controlId, errorId } = useFieldIds(id);
  return (
    <Field className={className}>
      <FieldLabel htmlFor={controlId} label={label} optional={optional} />
      <select
        id={controlId}
        className={controlClasses(error, 'h-12 px-3')}
        {...ariaProps({ error, errorId, optional })}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} error={error} />
    </Field>
  );
}

export function Textarea({ id, label, optional = false, error, className, rows = 4, ...props }) {
  const { controlId, errorId } = useFieldIds(id);
  return (
    <Field className={className}>
      <FieldLabel htmlFor={controlId} label={label} optional={optional} />
      <textarea
        id={controlId}
        rows={rows}
        className={controlClasses(error, 'resize-y px-3.5 py-3 leading-6')}
        {...ariaProps({ error, errorId, optional })}
        {...props}
      />
      <FieldError id={errorId} error={error} />
    </Field>
  );
}

/** Checkbox with its label on the right ("I agree to the terms"). `label` may contain links. */
export function Checkbox({ id, label, error, className, ...props }) {
  const { controlId, errorId } = useFieldIds(id);
  return (
    <Field className={className}>
      <div className="flex min-h-11 items-start gap-3 py-0.5">
        <input
          id={controlId}
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-navy"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <label htmlFor={controlId} className="cursor-pointer text-sm leading-[22px] text-body">
          {label}
        </label>
      </div>
      <FieldError id={errorId} error={error} />
    </Field>
  );
}

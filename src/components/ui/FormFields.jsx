'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

// Shared form inputs (CLAUDE.md §1.3). Each one renders its label, an optional "(optional)" mark,
// the error message and the aria wiring (htmlFor, aria-invalid, aria-describedby).
// Other props (name, value, onChange, placeholder, disabled, autoComplete…) go to the control.

// Design kit "Form fields": 1.5px sand border on paper, pine border + soft ring on focus, red tint on error.
const CONTROL =
  'w-full rounded-[var(--radius-control)] border-[1.5px] text-base font-medium text-ink transition placeholder:font-normal placeholder:text-[#8a8f87] focus:border-pine focus:shadow-[0_0_0_4px_rgba(43,82,67,.15)] focus:outline-none disabled:cursor-not-allowed disabled:bg-selected disabled:text-muted';

function controlClasses(error, className) {
  return cn(CONTROL, error ? 'border-danger bg-danger-bg' : 'border-input bg-surface', className);
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
    <label htmlFor={htmlFor} className="text-sm font-semibold">
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

/** `icon` (optional): a small decorative SVG shown inside the field on the left (design: login email). */
export function Input({ id, label, optional = false, error, className, type = 'text', icon, ...props }) {
  const { controlId, errorId } = useFieldIds(id);
  const input = (
    <input
      id={controlId}
      type={type}
      className={controlClasses(error, cn('h-[50px] px-3.5', icon && 'pl-11'))}
      {...ariaProps({ error, errorId, optional })}
      {...props}
    />
  );
  return (
    <Field className={className}>
      <FieldLabel htmlFor={controlId} label={label} optional={optional} />
      {icon ? (
        <span className="relative flex">
          <span aria-hidden="true" className="pointer-events-none absolute top-[15px] left-3.5 text-moss">
            {icon}
          </span>
          {input}
        </span>
      ) : (
        input
      )}
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
        className={controlClasses(error, 'h-[50px] px-3')}
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
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-pine"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <label htmlFor={controlId} className="cursor-pointer text-[15px] leading-[22px] text-ink">
          {label}
        </label>
      </div>
      <FieldError id={errorId} error={error} />
    </Field>
  );
}

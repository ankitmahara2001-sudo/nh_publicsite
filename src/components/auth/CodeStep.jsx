'use client';

import { OTP_LENGTH } from '@/domain/constants';
import { otpVerifySchema } from '@/domain/schemas/auth';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { ArrowIcon } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import { clientApi } from '@/lib/api';
import { validateForm } from '@/lib/formErrors';
import { StepHeading } from './StepHeading';
import { useCountdown } from './useCountdown';

/** 28 -> "0:28" (design: "Resend in 0:28"). */
const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * The 6 code boxes (design: Login OTP). One real input sits invisibly on top of the boxes, so typing,
 * pasting and one-time-code autofill work as with a plain field; the boxes only display its value.
 */
function CodeBoxes({ inputRef, value, onChange, error }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        Enter the {OTP_LENGTH}-digit code
      </label>
      <div className="group relative">
        <div aria-hidden="true" className="grid grid-cols-6 gap-2">
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <span
              key={index}
              className={cn(
                'flex h-14 min-w-0 items-center justify-center rounded-xl border-[1.5px] bg-surface font-display text-[20px] text-ink transition',
                error
                  ? 'border-danger bg-danger-bg'
                  : index < value.length
                    ? 'border-pine'
                    : index === value.length
                      ? 'border-input group-focus-within:border-2 group-focus-within:border-gold'
                      : 'border-input',
              )}
            >
              {value[index] ?? ''}
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          id={id}
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-required
          className="absolute inset-0 h-full w-full cursor-text text-base text-transparent caret-transparent opacity-0"
        />
      </div>
      {error && (
        <span id={errorId} className="text-[13px] font-semibold text-danger">
          {error}
        </span>
      )}
    </div>
  );
}

/** Resend button with a live countdown; screen readers hear only the start and the end. */
function ResendButton({ secondsLeft, sending, onResend }) {
  const waiting = secondsLeft > 0;
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="text-muted">
        Didn&apos;t get it?{' '}
        <button
          type="button"
          onClick={onResend}
          disabled={waiting || sending}
          className="inline-flex min-h-11 items-center font-bold text-gold-text underline underline-offset-4 disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
        >
          {sending ? 'Sending…' : waiting ? `Resend in ${clock(secondsLeft)}` : 'Resend code'}
        </button>
      </span>
      <span aria-live="polite" className="sr-only">
        {waiting ? 'You can request a new code after a short wait.' : 'You can now request a new code.'}
      </span>
    </div>
  );
}

/**
 * Step 2: 6-digit code → POST /auth/otp/verify. `onVerified(customer)` moves on;
 * `onChangeEmail()` goes back to step 1.
 */
export function CodeStep({ email, resendAfterSeconds, notice, onVerified, onChangeEmail }) {
  const inputRef = useRef(null);
  const [code, setCode] = useState('');
  const [fieldError, setFieldError] = useState();
  const [message, setMessage] = useState(notice ? { tone: 'info', text: notice } : null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const countdown = useCountdown(resendAfterSeconds);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);
    const { data, errors } = validateForm(otpVerifySchema, { email, code });
    if (errors) return setFieldError(errors.code);

    setVerifying(true);
    try {
      const { data: customer } = await clientApi.post('/auth/otp/verify', data);
      onVerified(customer);
    } catch (error) {
      setMessage({ tone: 'error', text: error.message });
      setCode('');
      inputRef.current?.focus();
      setVerifying(false);
    }
  }

  async function handleResend() {
    setMessage(null);
    setResending(true);
    try {
      const { data: result } = await clientApi.post('/auth/otp/request', { email });
      countdown.start(result.resendAfterSeconds);
      setCode('');
      setMessage({ tone: 'success', text: `We sent a new code to ${email}.` });
      inputRef.current?.focus();
    } catch (error) {
      if (error.code === 'OTP_COOLDOWN') countdown.start(Number(error.fields.retryAfterSeconds) || 0);
      setMessage({ tone: 'error', text: error.message });
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <StepHeading title="Check your email" aside="ek code bheja hai —">
        Sent to <strong className="font-bold break-all text-ink">{email}</strong> ·{' '}
        <button
          type="button"
          onClick={onChangeEmail}
          className="font-bold text-gold-text underline underline-offset-4 hover:text-[#7a3410]"
        >
          Use a different email
        </button>
      </StepHeading>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CodeBoxes
          inputRef={inputRef}
          value={code}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH));
            setFieldError(undefined);
          }}
          error={fieldError}
        />
        <ResendButton secondsLeft={countdown.secondsLeft} sending={resending} onResend={handleResend} />
        <FormMessage tone={message?.tone}>{message?.text}</FormMessage>
        <Button
          type="submit"
          variant="accent"
          size="lg"
          block
          disabled={verifying}
          className="shadow-[0_12px_26px_-14px_rgba(140,70,10,.8)]"
        >
          {verifying ? 'Verifying…' : 'Verify and continue'}
          {!verifying && <ArrowIcon />}
        </Button>
      </form>
    </>
  );
}

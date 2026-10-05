'use client';

import { OTP_LENGTH } from '@/domain/constants';
import { otpVerifySchema } from '@/domain/schemas/auth';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormFields';
import { FormMessage } from '@/components/ui/FormMessage';
import { clientApi } from '@/lib/api';
import { validateForm } from '@/lib/formErrors';
import { StepHeading } from './StepHeading';
import { useCountdown } from './useCountdown';

/** Resend button with a live countdown; screen readers hear only the start and the end. */
function ResendButton({ secondsLeft, sending, onResend }) {
  const waiting = secondsLeft > 0;
  return (
    <div className="flex flex-col items-center gap-1 text-sm">
      <button
        type="button"
        onClick={onResend}
        disabled={waiting || sending}
        className="flex min-h-11 items-center px-2 font-bold text-navy underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
      >
        {sending ? 'Sending…' : waiting ? `Resend code in ${secondsLeft} s` : 'Resend code'}
      </button>
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
      <StepHeading title="Check your email">
        Enter the {OTP_LENGTH}-digit code sent to{' '}
        <strong className="font-bold break-all text-ink">{email}</strong>.
      </StepHeading>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          ref={inputRef}
          label="Login code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          placeholder="••••••"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH));
            setFieldError(undefined);
          }}
          error={fieldError}
          className="[&_input]:text-center [&_input]:text-xl [&_input]:font-bold [&_input]:tracking-[8px]"
        />
        <FormMessage tone={message?.tone}>{message?.text}</FormMessage>
        <Button type="submit" size="lg" block disabled={verifying}>
          {verifying ? 'Verifying…' : 'Verify and continue'}
        </Button>
      </form>
      <div className="mt-4 flex flex-col items-center gap-1 border-t border-line pt-4">
        <ResendButton secondsLeft={countdown.secondsLeft} sending={resending} onResend={handleResend} />
        <button
          type="button"
          onClick={onChangeEmail}
          className="flex min-h-11 items-center px-2 text-sm font-semibold text-muted underline-offset-4 hover:text-navy hover:underline"
        >
          Use a different email
        </button>
      </div>
    </>
  );
}

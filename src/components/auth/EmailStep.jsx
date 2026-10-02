'use client';

import { otpRequestSchema } from '@nh/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormFields';
import { FormMessage } from '@/components/ui/FormMessage';
import { clientApi } from '@/lib/api';
import { validateForm } from '@/lib/formErrors';
import { StepHeading } from './StepHeading';

/**
 * Step 1: email → POST /auth/otp/request. `onSent(email, resendAfterSeconds, notice?)` moves on.
 * If a code was sent moments ago (cooldown), that code is still valid, so we move on too.
 */
export function EmailStep({ initialEmail = '', focusOnMount, onSent }) {
  const [email, setEmail] = useState(initialEmail);
  const [fieldError, setFieldError] = useState();
  const [apiError, setApiError] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError(null);
    const { data, errors } = validateForm(otpRequestSchema, { email });
    if (errors) return setFieldError(errors.email);

    setSending(true);
    try {
      const { data: result } = await clientApi.post('/auth/otp/request', data);
      onSent(data.email, result.resendAfterSeconds);
    } catch (error) {
      if (error.code === 'OTP_COOLDOWN') {
        onSent(
          data.email,
          Number(error.fields.retryAfterSeconds) || 0,
          'We sent you a code a moment ago. Please use that code.',
        );
      } else {
        setFieldError(error.fields?.email);
        setApiError(error.message);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <StepHeading title="Log in or sign up" focusOnMount={focusOnMount}>
        Enter your email and we’ll send you a 6-digit code. No password needed.
      </StepHeading>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFieldError(undefined);
          }}
          error={fieldError}
        />
        <FormMessage>{apiError}</FormMessage>
        <Button type="submit" size="lg" block disabled={sending}>
          {sending ? 'Sending…' : 'Send code'}
        </Button>
      </form>
    </>
  );
}

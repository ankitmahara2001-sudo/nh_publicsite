'use client';

import { customerProfileSchema } from '@nh/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormFields';
import { FormMessage } from '@/components/ui/FormMessage';
import { clientApi } from '@/lib/api';
import { validateForm } from '@/lib/formErrors';

/**
 * Name + mobile number form (PATCH /me). Used on the profile page and as the last login step.
 * `email` shows the account email read-only; `onSaved(customer)` runs after a successful save.
 */
export function ProfileForm({ initial, email, submitLabel = 'Save changes', successMessage, onSaved }) {
  const [values, setValues] = useState({ name: initial?.name ?? '', phone: initial?.phone ?? '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);
    const { data, errors: invalid } = validateForm(customerProfileSchema, values);
    if (invalid) return setErrors(invalid);

    setSaving(true);
    try {
      const { data: customer } = await clientApi.patch('/me', data);
      if (successMessage) setMessage({ tone: 'success', text: successMessage });
      onSaved?.(customer);
    } catch (error) {
      setErrors(error.fields ?? {});
      setMessage({ tone: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-5">
      {email && <Input label="Email" type="email" value={email} readOnly disabled />}
      <Input
        label="Full name"
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={update('name')}
        error={errors.name}
      />
      <Input
        label="Mobile number"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="98765 43210"
        value={values.phone}
        onChange={update('phone')}
        error={errors.phone}
      />
      <FormMessage tone={message?.tone}>{message?.text}</FormMessage>
      <Button type="submit" size="lg" block disabled={saving}>
        {saving ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}

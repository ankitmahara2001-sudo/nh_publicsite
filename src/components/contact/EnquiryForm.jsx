'use client';

import { enquiryCreateSchema } from '@nh/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/FormFields';
import { ApiError, clientApi } from '@/lib/api';
import { fillTemplate } from '@/lib/text';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  travelMonth: '',
  destination: '',
  travellers: '2 people',
  message: '',
};

const TRAVELLER_OPTIONS = ['1 person', '2 people', '3 – 4 people', '5 or more'].map((value) => ({
  value,
  label: value,
}));

/** zod issues -> { field: first message }. */
function fieldErrors(error) {
  const errors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

/**
 * "Send us a message" enquiry form (design/Contact + MobileContact). Validated with the shared
 * zod schema before sending; API field errors are shown under the matching inputs.
 */
export function EnquiryForm({ destinations, title, note, successMessage }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [sending, setSending] = useState(false);

  const destinationOptions = [
    { value: '', label: 'Not sure yet' },
    ...destinations.map((name) => ({ value: name, label: name })),
  ];

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: update,
    error: errors[name],
    disabled: sending,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSentTo('');
    setFormError('');
    const parsed = enquiryCreateSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await clientApi.post('/enquiries', parsed.data);
      setSentTo(parsed.data.name.split(/\s+/)[0]);
      setValues(EMPTY_FORM);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length > 0) setErrors(error.fields);
      else setFormError(error.message || 'We could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      aria-labelledby="enquiry-title"
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-3.5 rounded-[var(--radius-card)] border border-line bg-surface p-5 lg:flex-1 lg:gap-5 lg:rounded-[var(--radius-panel)] lg:p-9"
    >
      <h2 id="enquiry-title" className="text-xl font-extrabold lg:text-[26px]">
        {title}
      </h2>

      <div aria-live="polite">
        {sentTo && (
          <p className="rounded-[var(--radius-control)] bg-success-bg px-3.5 py-3 text-sm font-semibold text-success-text lg:rounded-xl lg:px-[18px] lg:py-4 lg:text-[15px]">
            {fillTemplate(successMessage, { name: sentTo })}
          </p>
        )}
      </div>
      {formError && (
        <p
          role="alert"
          className="rounded-[var(--radius-control)] bg-[#fbecea] px-3.5 py-3 text-sm font-semibold text-danger"
        >
          {formError}
        </p>
      )}

      <div className="grid gap-3.5 md:grid-cols-2 lg:gap-[18px]">
        <Input label="Full name" placeholder="Your name" autoComplete="name" {...fieldProps('name')} />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...fieldProps('email')}
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="98765 43210"
          autoComplete="tel"
          {...fieldProps('phone')}
        />
        <Input label="Travel month" optional placeholder="e.g. October 2026" {...fieldProps('travelMonth')} />
        <Select label="Destination" optional options={destinationOptions} {...fieldProps('destination')} />
        <Select label="Travellers" optional options={TRAVELLER_OPTIONS} {...fieldProps('travellers')} />
      </div>
      <Textarea
        label="Message"
        optional
        placeholder="Dates, budget, anything we should know"
        {...fieldProps('message')}
      />

      <div className="flex flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">
        {note && <p className="text-center text-[13px] text-muted lg:text-left">{note}</p>}
        <Button type="submit" size="lg" disabled={sending} className="w-full lg:w-auto lg:px-[30px]">
          {sending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

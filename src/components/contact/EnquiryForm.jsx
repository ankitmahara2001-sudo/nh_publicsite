'use client';

import { enquiryCreateSchema } from '@/domain/schemas/content';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/FormFields';
import { ApiError, clientApi } from '@/lib/api';
import { ENQUIRY_FORM_ID, sendEnquiryToSheet } from '@/lib/enquiry';

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

const SUCCESS_TEXT = 'Thank you! We’ll reach out soon — happy trails!';
const FAILURE_TEXT = 'Couldn’t send — please email info@northernharrier.in';

/**
 * The Google Sheet row for a validated enquiry. The keys become the Sheet's column headers;
 * optional fields the visitor left empty are sent as '' (zod turns them into null).
 * `packageName` comes from ?package= (set by the "Send an enquiry" links on package pages).
 */
function sheetRow(data) {
  return {
    name: data.name,
    mobile: data.phone,
    email: data.email,
    destination: data.destination ?? '',
    travelMonth: data.travelMonth ?? '',
    travellers: data.travellers ?? '',
    message: data.message ?? '',
    page: window.location.href,
    packageName: new URLSearchParams(window.location.search).get('package') ?? '',
    source: 'website',
  };
}

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
 * "Send us a message" enquiry form (design/Contact + MobileContact). Validated with the enquiry
 * zod schema (src/domain) before sending; API field errors are shown under the matching inputs.
 * A valid enquiry is saved in the API (POST /enquiries) and in the Google Sheet; it counts as sent
 * when at least one of the two saved it.
 */
export function EnquiryForm({ destinations, title, note }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
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
    setSent(false);
    setFormError('');
    const parsed = enquiryCreateSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSending(true);

    let savedInApi = false;
    try {
      await clientApi.post('/enquiries', parsed.data);
      savedInApi = true;
    } catch (error) {
      // The API rejected a field: show it under the input, as before, and send nothing to the Sheet.
      if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
        setErrors(error.fields);
        setSending(false);
        return;
      }
      console.error('Enquiry API failed', error);
    }

    let savedInSheet = false;
    try {
      await sendEnquiryToSheet(sheetRow(parsed.data));
      savedInSheet = true;
    } catch (error) {
      console.error('Enquiry sheet failed', error);
    }

    if (savedInApi || savedInSheet) {
      setSent(true);
      setValues(EMPTY_FORM);
    } else {
      setFormError(FAILURE_TEXT);
    }
    setSending(false);
  };

  return (
    <form
      id={ENQUIRY_FORM_ID}
      aria-labelledby="enquiry-title"
      noValidate
      onSubmit={handleSubmit}
      className="flex scroll-mt-6 flex-col gap-3.5 rounded-[var(--radius-card)] border border-line bg-surface p-5 lg:flex-1 lg:gap-5 lg:rounded-[var(--radius-panel)] lg:p-9"
    >
      <h2 id="enquiry-title" className="text-[24px] leading-tight lg:text-[30px]">
        {title}
      </h2>

      <div aria-live="polite">
        {sent && (
          <p className="rounded-[var(--radius-control)] bg-success-bg px-3.5 py-3 text-sm font-semibold text-success-text lg:rounded-xl lg:px-[18px] lg:py-4 lg:text-[15px]">
            {SUCCESS_TEXT}
          </p>
        )}
      </div>
      {formError && (
        <p
          role="alert"
          className="rounded-[var(--radius-control)] bg-danger-bg px-3.5 py-3 text-sm font-semibold text-danger"
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
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={sending}
          className="w-full lg:w-auto lg:px-[30px]"
        >
          {sending ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

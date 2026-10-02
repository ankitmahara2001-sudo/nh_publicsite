'use client';

import { useState } from 'react';
import { ProfileForm } from '@/components/account/ProfileForm';
import { CodeStep } from './CodeStep';
import { EmailStep } from './EmailStep';
import { StepHeading } from './StepHeading';

/** Full page load so the (client-fetched) header account menu picks up the new session. */
const goTo = (path) => window.location.assign(path);

/**
 * Email → code → (first login only) profile. `nextPath` is already sanitised by the page.
 * `initialCustomer` is set when a logged-in visitor still has to complete their profile.
 */
export function LoginFlow({ nextPath, initialCustomer = null }) {
  const [step, setStep] = useState(initialCustomer ? 'profile' : 'email');
  const [email, setEmail] = useState('');
  const [codeInfo, setCodeInfo] = useState({ resendAfterSeconds: 0, notice: null });
  const [customer, setCustomer] = useState(initialCustomer);
  // Focus the step heading only after the visitor moved between steps, not on first load.
  const [hasMoved, setHasMoved] = useState(false);

  function handleSent(sentEmail, resendAfterSeconds, notice = null) {
    setEmail(sentEmail);
    setCodeInfo({ resendAfterSeconds, notice });
    setHasMoved(true);
    setStep('code');
  }

  function handleVerified(verified) {
    if (verified.profileComplete) return goTo(nextPath);
    setCustomer(verified);
    return setStep('profile');
  }

  if (step === 'code') {
    return (
      <CodeStep
        email={email}
        resendAfterSeconds={codeInfo.resendAfterSeconds}
        notice={codeInfo.notice}
        onVerified={handleVerified}
        onChangeEmail={() => setStep('email')}
      />
    );
  }

  if (step === 'profile') {
    return (
      <>
        <StepHeading title="Complete your profile" focusOnMount={hasMoved}>
          Just your name and mobile number, so we can reach you about your trips.
        </StepHeading>
        <ProfileForm
          initial={customer}
          email={customer.email}
          submitLabel="Save and continue"
          onSaved={() => goTo(nextPath)}
        />
      </>
    );
  }

  return <EmailStep initialEmail={email} focusOnMount={hasMoved} onSent={handleSent} />;
}

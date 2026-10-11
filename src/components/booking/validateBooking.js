// Checks for booking step 2 before moving on. The API validates again (createBookingSchema);
// these only give quicker feedback. Error keys match the API's ("travellers.0.age").

const MAX_AGE = 120;
const PHONE_PATTERN = /^\+?[0-9 ]{10,15}$/;

/** @returns {Record<string, string>} field → message; empty when everything is filled in. */
export function validateTravellerDetails({ travellers, leadPhone }) {
  const errors = {};
  travellers.forEach((traveller, index) => {
    if (!traveller.fullName.trim()) errors[`travellers.${index}.fullName`] = 'Enter the full name.';
    const age = Number(traveller.age);
    if (traveller.age === '' || !Number.isInteger(age) || age < 0 || age > MAX_AGE) {
      errors[`travellers.${index}.age`] = 'Enter an age.';
    }
    if (!traveller.gender) errors[`travellers.${index}.gender`] = 'Choose one.';
  });
  if (!PHONE_PATTERN.test(leadPhone.trim())) errors.leadPhone = 'Enter a valid phone number.';
  return errors;
}

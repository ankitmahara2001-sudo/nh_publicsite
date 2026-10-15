// Enquiries are saved twice: in the API (POST /enquiries) and in a Google Sheet through a Google
// Apps Script web app. The script URL is public (it is called from the browser).
export const ENQUIRY_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzGqVb-5RRTI2MlcDupJopuEHaBhXoK-_0ki4F637FAs1FeObwPataBpUelt58k9DAf/exec';

/** Id of the enquiry form on /contact; every "Enquire now" button links to it. */
export const ENQUIRY_FORM_ID = 'enquiry';

/**
 * Link to the enquiry form. `packageTitle` (optional) is passed along so the Sheet row records
 * which package the visitor asked about.
 */
export function enquiryHref(packageTitle) {
  const query = packageTitle ? `?${new URLSearchParams({ package: packageTitle })}` : '';
  return `/contact${query}#${ENQUIRY_FORM_ID}`;
}

/**
 * Sends one enquiry row to the Google Sheet. The keys of `fields` become the Sheet's column headers.
 * Sent as URLSearchParams with no Content-Type header and no JSON on purpose: that keeps it a
 * "simple" request, so the browser does not send a CORS preflight (Apps Script rejects those).
 * The script answers {"ok":true} once the row is saved; anything else (including the HTML error page
 * Apps Script serves with status 200 when the script throws) is treated as a failure.
 */
export async function sendEnquiryToSheet(fields) {
  const response = await fetch(ENQUIRY_SCRIPT_URL, { method: 'POST', body: new URLSearchParams(fields) });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) throw new Error(`Enquiry sheet did not save the row (${response.status})`);
}

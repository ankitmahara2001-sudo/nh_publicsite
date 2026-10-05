/** tel: link for a phone number written with spaces, e.g. "+91 98765 43210". */
export const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

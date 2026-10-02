/** tel: link for a phone number written with spaces, e.g. "+91 98765 43210". */
export const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

/** WhatsApp chat link for a phone number. */
export const whatsappHref = (phone) => `https://wa.me/${String(phone).replace(/\D/g, '')}`;

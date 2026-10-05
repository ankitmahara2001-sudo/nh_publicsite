// Enum values and display labels used by the website. Values match the API (PostgreSQL ENUM columns).

export const PRICE_TYPE_LABELS = {
  per_person: 'Per person',
  per_couple: 'Per couple',
  per_group: 'Group / family',
};

export const TRIP_TYPES = [
  'pilgrimage',
  'trekking',
  'honeymoon',
  'family',
  'adventure',
  'wildlife',
  'weekend',
];

export const TRIP_TYPE_LABELS = {
  pilgrimage: 'Pilgrimage',
  trekking: 'Trekking',
  honeymoon: 'Honeymoon',
  family: 'Family',
  adventure: 'Adventure',
  wildlife: 'Wildlife',
  weekend: 'Weekend',
};

export const REGIONS = ['garhwal', 'kumaon'];

export const REGION_LABELS = {
  garhwal: 'Garhwal',
  kumaon: 'Kumaon',
};

export const GALLERY_CATEGORIES = ['temples', 'treks', 'snow', 'lakes_rivers', 'travellers'];

export const GALLERY_CATEGORY_LABELS = {
  temples: 'Temples',
  treks: 'Treks',
  snow: 'Snow',
  lakes_rivers: 'Lakes & rivers',
  travellers: 'Our travellers',
};

export const BLOG_CATEGORIES = ['guides', 'planning', 'treks', 'couples', 'food'];

export const BLOG_CATEGORY_LABELS = {
  guides: 'Guides',
  planning: 'Planning',
  treks: 'Treks',
  couples: 'Couples',
  food: 'Food',
};

export const BOOKING_STATUS_LABELS = {
  pending: 'Pending payment',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS = {
  unpaid: 'Unpaid',
  advance_paid: 'Advance paid',
  fully_paid: 'Fully paid',
  refunded: 'Refunded',
};

export const PAYMENT_TYPE_LABELS = {
  advance: 'Booking amount',
  balance: 'Balance payment',
  refund: 'Refund',
};

export const PAYMENT_METHOD_LABELS = {
  razorpay: 'Razorpay',
  cash: 'Cash',
  upi: 'UPI',
  bank_transfer: 'Bank transfer',
  other: 'Other',
};

export const GENDERS = ['female', 'male', 'other'];

export const GENDER_LABELS = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

export const POLICY_SLUGS = ['cancellation', 'privacy', 'terms'];

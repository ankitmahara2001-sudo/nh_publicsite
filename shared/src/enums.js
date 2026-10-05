// Every enum used by the database, the API and both front ends.
// Values are stored as-is in PostgreSQL ENUM columns; labels are for display only.

export const PRICE_TYPES = ['per_person', 'per_couple', 'per_group'];

export const PRICE_TYPE_LABELS = {
  per_person: 'Per person',
  per_couple: 'Per couple',
  per_group: 'Group / family',
};

export const AVAILABILITY_TYPES = ['all_season', 'fixed_date'];

export const AVAILABILITY_TYPE_LABELS = {
  all_season: 'All season (any date)',
  fixed_date: 'Fixed departures',
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

export const INCLUSION_TYPES = ['included', 'excluded'];

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

export const BLOG_STATUSES = ['draft', 'published'];

export const DISCOUNT_TYPES = ['percent', 'flat'];

export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export const BOOKING_STATUS_LABELS = {
  pending: 'Pending payment',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUSES = ['unpaid', 'advance_paid', 'fully_paid', 'refunded'];

export const PAYMENT_STATUS_LABELS = {
  unpaid: 'Unpaid',
  advance_paid: 'Advance paid',
  fully_paid: 'Fully paid',
  refunded: 'Refunded',
};

export const PAYMENT_TYPES = ['advance', 'balance', 'refund'];

export const PAYMENT_TYPE_LABELS = {
  advance: 'Booking amount',
  balance: 'Balance payment',
  refund: 'Refund',
};

export const PAYMENT_METHODS = ['razorpay', 'cash', 'upi', 'bank_transfer', 'other'];

/** Methods an admin can pick when recording an offline (balance) payment. */
export const OFFLINE_PAYMENT_METHODS = ['cash', 'upi', 'bank_transfer', 'other'];

export const PAYMENT_METHOD_LABELS = {
  razorpay: 'Razorpay',
  cash: 'Cash',
  upi: 'UPI',
  bank_transfer: 'Bank transfer',
  other: 'Other',
};

export const PAYMENT_RECORD_STATUSES = ['created', 'captured', 'failed', 'recorded', 'refunded'];

export const ENQUIRY_STATUSES = ['new', 'contacted', 'closed'];

export const GENDERS = ['female', 'male', 'other'];

export const GENDER_LABELS = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
};

/** Cloudinary sub-folders (under CLOUDINARY_ROOT_FOLDER) per kind of upload. */
export const UPLOAD_FOLDERS = ['packages', 'gallery', 'hero', 'blog', 'destinations', 'team', 'hotels'];

export const SITE_SETTING_KEYS = [
  'gst_percent',
  'default_booking_percent',
  'company',
  'social',
  'home',
  'about',
  'contact',
  'booking',
  'policies',
  'seo',
  'email',
  'pages',
];

export const POLICY_SLUGS = ['cancellation', 'privacy', 'terms'];

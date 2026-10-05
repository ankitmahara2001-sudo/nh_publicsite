// Calendar dates as "YYYY-MM-DD" strings (string comparison works for this format).

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isInRanges(isoDate, ranges) {
  return ranges.some((range) => isoDate >= range.startDate && isoDate <= range.endDate);
}

/** First date on or after `from` that is not inside a blocked range (looks at most a year ahead). */
export function firstOpenDate(from, blockedRanges) {
  const DAYS_TO_SEARCH = 366;
  let date = from;
  for (let i = 0; i < DAYS_TO_SEARCH && isInRanges(date, blockedRanges); i += 1) date = addDays(date, 1);
  return date;
}

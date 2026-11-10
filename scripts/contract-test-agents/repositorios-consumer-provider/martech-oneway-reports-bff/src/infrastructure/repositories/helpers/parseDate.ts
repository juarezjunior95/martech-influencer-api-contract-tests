/**
 * Parses a date string and returns a valid Date or undefined.
 * Use in commands that need to validate and parse date inputs.
 */
export function parseDate(
  dateString: string | null | undefined,
): Date | undefined {
  if (typeof dateString !== "string" || !dateString) {
    return undefined;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

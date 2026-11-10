export function parseDate(input: string): Date | null {
  const dateMatch = /^(\d{2})-(\d{2})-(\d{4})$/.exec(input);
  if (dateMatch) {
    const [_, day, month, year] = dateMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date;
  }

  const quarterMatch = /^Q([1-4])-(\d{4})$/.exec(input);
  if (quarterMatch) {
    const [_, quarterStr, yearStr] = quarterMatch;
    const quarter = Number.parseInt(quarterStr);
    const year = Number.parseInt(yearStr);

    const month = quarter * 3;
    const date = new Date(Date.UTC(year, month, 1));
    return date;
  }

  return null;
}

/**
 * Returns January 1st of the same calendar year as `dtEnd`, as `YYYY-MM-DD`.
 * Accepts `YYYY-MM-DD` (e.g. BFF / formatDateToYMD) or `DD-MM-YYYY` (parseDate).
 */
export function getJanuaryFirstYmdFromDtEnd(
  dtEnd: string | undefined | null,
): string {
  if (!dtEnd?.trim()) return '';

  const trimmed = dtEnd.trim();
  const ymd = /^(\d{4})-\d{2}-\d{2}$/.exec(trimmed);
  if (ymd) return `${ymd[1]}-01-01`;

  const parsed = parseDate(trimmed);
  if (parsed) {
    return `${parsed.getFullYear()}-01-01`;
  }

  return '';
}

export const getPreviusQuarter = (date: Date) => {
  if (!date) return null;

  const month = date.getMonth();
  const year = date.getFullYear();

  const previousYearDate = new Date(year - 1, month, 1);
  return previousYearDate;
};

export const formatDateToYMD = (date: Date | null | undefined): string => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const createRequestKey = (
  identifiers: string[],
  filters: Record<string, any> | undefined,
): string => {
  const filtersString = filters
    ? Object.entries(filters)
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
    : '';

  return `${identifiers.join(',')}:${filtersString}`;
};

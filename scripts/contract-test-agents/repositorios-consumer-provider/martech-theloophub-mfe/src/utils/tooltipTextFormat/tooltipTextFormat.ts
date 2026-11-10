type MonthAbbr =
  | 'JAN'
  | 'FEB'
  | 'MAR'
  | 'APR'
  | 'MAY'
  | 'JUN'
  | 'JUL'
  | 'AUG'
  | 'SEP'
  | 'OCT'
  | 'NOV'
  | 'DEC';

const monthAbbreviations: Record<MonthAbbr, string> = {
  JAN: 'January',
  FEB: 'February',
  MAR: 'March',
  APR: 'April',
  MAY: 'May',
  JUN: 'June',
  JUL: 'July',
  AUG: 'August',
  SEP: 'September',
  OCT: 'October',
  NOV: 'November',
  DEC: 'December',
};

const validAbbreviations: MonthAbbr[] = Object.keys(
  monthAbbreviations,
) as MonthAbbr[];

export const getFullMonthName = (
  abbr: string,
  timeframe: number,
): string | undefined => {
  const upperAbbr = abbr.toUpperCase() as MonthAbbr;

  if (!validAbbreviations.includes(upperAbbr)) {
    return undefined;
  }

  return `${monthAbbreviations[upperAbbr]} ${timeframe}`;
};

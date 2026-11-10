import { camelCase, kebabCase, snakeCase, startCase } from 'lodash';
import { FilterValue } from 'models/Filters';

// Parse number on format xx,xxx.xx
export const parseNumber = (stringNumber: string) => {
  return Number(String(stringNumber).replaceAll(',', ''));
};

/**
 * Parses a percentage string (e.g. "51.2%", "12.5", " 3% ") to a numeric value.
 * Returns NaN when the value cannot be parsed.
 */
export function parsePercentage(value: string): number {
  const normalized = String(value).replaceAll('%', '').trim();
  if (normalized === '') return Number.NaN;
  return Number.parseFloat(normalized);
}

/** Parses or normalizes a value to a finite number, or `null` if it cannot be represented as one. */
export function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// Return number on format xx,xxx.xx
export const formatNumber = (
  number: number,
  minimumFractionDigits = 1,
  maximumFractionDigits = 1,
): string => {
  if (number == null || !Number.isFinite(number)) return '';
  return new Intl.NumberFormat('en', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);
};

interface FormattedNumberResult {
  value: string;
  wasFormatted: boolean;
}

const SUFFIXES = [
  { threshold: 1_000_000_000_000, suffix: 'T' },
  { threshold: 1_000_000_000, suffix: 'B' },
  { threshold: 1_000_000, suffix: 'M' },
  { threshold: 1_000, suffix: 'k' },
] as const;

export function formatNumberWithSuffix(
  num: number | string,
  minimumFractionDigits = 1,
  maximumFractionDigits = 1,
): FormattedNumberResult {
  const parsedNum =
    typeof num === 'string' ? Number(num.replaceAll(',', '')) : Number(num);

  if (Number.isNaN(parsedNum)) {
    return {
      value: String(num),
      wasFormatted: false,
    };
  }

  const isNegative = parsedNum < 0;
  const absNum = Math.abs(parsedNum);

  const matchingSuffix = SUFFIXES.find(({ threshold }) => absNum >= threshold);

  if (matchingSuffix) {
    const formattedValue = (absNum / matchingSuffix.threshold)
      .toFixed(1)
      .replace(/\.0$/, '');

    return {
      value: `${isNegative ? '-' : ''}${formattedValue}${matchingSuffix.suffix}`,
      wasFormatted: true,
    };
  }

  return {
    value: formatNumber(
      parsedNum,
      minimumFractionDigits,
      maximumFractionDigits,
    ),
    wasFormatted: false,
  };
}

export function normalizeString(
  input: FilterValue,
  toPattern: 'camel' | 'Pascal' | 'kebab' | 'snake' = 'snake',
): string {
  switch (toPattern) {
    case 'camel':
      return camelCase(input as string);

    case 'Pascal':
      return startCase(camelCase(input as string)).replaceAll(' ', '');

    case 'kebab':
      return kebabCase(input as string);

    case 'snake':
      return snakeCase(input as string);

    default:
      throw new Error(
        "Invalid target pattern. Choose from: 'camel', 'Pascal', 'kebab', 'snake'.",
      );
  }
}

export function formatDateToQuarterYear(
  date?: Date,
  divider = '´',
  sliceYear = 2,
) {
  if (!date) return '';

  let year = date.getFullYear();
  const month = date.getMonth() + 1;
  let quarter: number;

  if (month <= 2) {
    quarter = 4;
    year = year - 1;
  } else if (month <= 3) {
    quarter = 1;
  } else if (month <= 6) {
    quarter = 2;
  } else if (month <= 9) {
    quarter = 3;
  } else if (month <= 12) {
    quarter = 4;
  }

  return `Q${quarter}${divider}${String(year).slice(sliceYear)}`;
}

export function formatDateToMonthYear(date?: Date): string {
  if (!date) return '';
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const month = formatter.format(date);
  const year = String(date.getFullYear()).slice(2);

  return `${month}’${year}`;
}

export function formatDateToR12M(date?: Date, type?: string): string {
  if (!date) return '';

  const endDate = new Date(date);
  type !== 'vsLastYear' && endDate.setMonth(endDate.getMonth() - 1);

  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - 11);

  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const startMonth = formatter.format(startDate);
  const startYear = String(startDate.getFullYear()).slice(2);
  const endMonth = formatter.format(endDate);
  const endYear = String(endDate.getFullYear()).slice(2);

  return `${startMonth}’${startYear} - ${endMonth}’${endYear}`;
}

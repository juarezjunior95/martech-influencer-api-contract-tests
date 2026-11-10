import { FilterValue } from 'models/Filters';
import { BffNormalizedData } from 'services';

export type BffDateRangeSubFilters = {
  dt_ini: string;
  dt_end: string;
};

export type QuarterYear = {
  quarter: number | null;
  year: number | null;
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const getYearFromFilterValue = (value: FilterValue): number | null => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;

  const yearMatch = new RegExp(/(?:19|20)\d{2}/).exec(value);
  return yearMatch ? Number(yearMatch[0]) : null;
};

export const formatDateFilter = (year: number, month: number): string =>
  `${year}-${String(month).padStart(2, '0')}-01`;

export const getQuarterFromValue = (quarterValue: string): number | null => {
  const quarterMatch = new RegExp(/Q([1-4])/).exec(quarterValue.toUpperCase());
  return quarterMatch ? Number(quarterMatch[1]) : null;
};

export const getQuarterYearFromValue = (quarterValue: string): QuarterYear => {
  const normalizedQuarterValue = quarterValue.toUpperCase();

  const yearBeforeQuarterMatch = new RegExp(/((?:19|20)\d{2}).*?Q([1-4])/).exec(
    normalizedQuarterValue,
  );

  if (yearBeforeQuarterMatch) {
    return {
      quarter: Number(yearBeforeQuarterMatch[2]),
      year: Number(yearBeforeQuarterMatch[1]),
    };
  }

  const quarterBeforeYearMatch = new RegExp(/Q([1-4]).*?((?:19|20)\d{2})/).exec(
    normalizedQuarterValue,
  );

  if (quarterBeforeYearMatch) {
    return {
      quarter: Number(quarterBeforeYearMatch[1]),
      year: Number(quarterBeforeYearMatch[2]),
    };
  }

  return {
    quarter: getQuarterFromValue(normalizedQuarterValue),
    year: null,
  };
};

export const getQuarterDateRange = (
  year: number,
  quarter: number,
): BffDateRangeSubFilters => {
  const startMonth = (quarter - 1) * 3 + 1;

  return {
    dt_ini: formatDateFilter(year, startMonth),
    dt_end: formatDateFilter(year, startMonth + 2),
  };
};

export const getBffComponentData = (
  data: unknown,
  componentId: string,
): Record<string, unknown> => {
  const bffData = data as BffNormalizedData;
  return bffData?.[componentId] as Record<string, unknown>;
};

export const readBffComponentData = <T>(
  data: unknown,
  componentId: string,
): T | undefined => {
  if (!isRecord(data)) return undefined;
  const value = data[componentId];
  if (!isRecord(value)) return undefined;
  return value as T;
};

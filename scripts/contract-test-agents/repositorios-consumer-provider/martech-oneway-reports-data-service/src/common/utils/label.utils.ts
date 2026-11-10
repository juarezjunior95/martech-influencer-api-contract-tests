import { formatPeriod, PeriodFormatParams } from "./period.utils";
import { formatMonth } from "./month.utils";

/**
 * Formats year based on the specified format
 * @param year - Year number
 * @param format - Year format ('full' or 'short')
 * @returns Formatted year string
 */
function formatYear(year: number, format: "full" | "short" = "full"): string {
  if (format === "full") {
    return year.toString();
  }

  return year.toString().slice(-2);
}

/**
 * Label format parameters
 */
export interface LabelFormatParams {
  dtIni: string;
  dtEnd: string;
  yearFormat?: "full" | "short";
  prefix?: string;
  suffix?: string;
  periodFormatParams?: PeriodFormatParams;
}

/**
 * Generates a "vs Last Quarter" label
 * @param params - Label format parameters
 * @returns Formatted label string
 */
export function labelVsLq(params: LabelFormatParams): string {
  const { dtIni, dtEnd, yearFormat = "full" } = params;

  if (!dtIni || !dtEnd) {
    return "";
  }

  try {
    const currentDtIni = new Date(dtIni);
    const currentDtEnd = new Date(dtEnd);

    const prevPeriodDtIni = new Date(
      currentDtIni.getFullYear(),
      currentDtIni.getMonth() - 3,
      currentDtIni.getDate(),
    );
    const prevPeriodDtEnd = new Date(
      currentDtEnd.getFullYear(),
      currentDtEnd.getMonth() - 3,
      currentDtEnd.getDate(),
    );

    const prevPeriod = formatPeriod(
      prevPeriodDtIni.toISOString(),
      prevPeriodDtEnd.toISOString(),
    );

    const year = prevPeriodDtEnd.getFullYear();
    const prevPeriodYear = formatYear(year, yearFormat);

    if (!prevPeriod || !prevPeriodYear) {
      return "";
    }

    return `vs ${prevPeriod}'${prevPeriodYear}`;
  } catch {
    return "";
  }
}

/**
 * Generates a "vs Last Year" label
 * @param params - Label format parameters
 * @returns Formatted label string
 */
export function labelVsLy(params: LabelFormatParams): string {
  const {
    dtIni,
    dtEnd,
    yearFormat = "full",
    periodFormatParams,
    suffix = "",
  } = params;

  if (!dtIni || !dtEnd) {
    return "";
  }

  try {
    const currentPeriod = formatPeriod(dtIni, dtEnd, periodFormatParams);

    const currentDtEnd = new Date(dtEnd);
    const year = currentDtEnd.getFullYear() - 1;
    const prevYear = formatYear(year, yearFormat);

    if (!currentPeriod || !prevYear) {
      return "";
    }

    return `vs ${currentPeriod}'${prevYear}${suffix}`;
  } catch {
    return "";
  }
}

/**
 * "vs Last Year" label for quarterly series: formats the comparison period the same
 * way as {@link formatPeriod} with `alwaysUseQuarter: true`, for dates one calendar
 * year before {@link dtEnd} (local year). Matches how `date_refresh` is built so
 * the vs label stays aligned when ISO timestamps fall on a different local quarter/year.
 */
export function labelVsLyQuarter(params: LabelFormatParams): string {
  const { dtEnd, yearFormat = "short", suffix = "" } = params;

  if (!dtEnd) {
    return "";
  }

  try {
    const end = new Date(dtEnd);
    if (isNaN(end.getTime())) {
      return "";
    }

    const lyEnd = new Date(end.getTime());
    lyEnd.setFullYear(lyEnd.getFullYear() - 1);

    const vsCore = formatPeriod(lyEnd.toISOString(), lyEnd.toISOString(), {
      alwaysUseQuarter: true,
      includeYear: true,
      yearFormat,
    });

    if (!vsCore) {
      return "";
    }

    return `vs ${vsCore}${suffix}`;
  } catch {
    return "";
  }
}

/**
 * Generates a "Refresh" label (current period + year)
 * @param params - Label format parameters
 * @returns Formatted label string
 */
export function labelRefresh(params: LabelFormatParams): string {
  const { dtIni, dtEnd, yearFormat = "full" } = params;

  if (!dtIni || !dtEnd) {
    return "";
  }

  try {
    const currentPeriod = formatPeriod(dtIni, dtEnd);
    const currentDtEnd = new Date(dtEnd);
    const year = currentDtEnd.getFullYear();
    const currentYear = formatYear(year, yearFormat);

    if (!currentPeriod || !currentYear) {
      return "";
    }

    return `${currentPeriod}'${currentYear}`;
  } catch {
    return "";
  }
}

/**
 * Generates a "vs Last Year" label using month format instead of quarterly period
 * @param params - Label format parameters
 * @returns Formatted label string with month
 */
export function labelVsLyMonth(params: LabelFormatParams): string {
  const { dtEnd, yearFormat = "full", prefix = "vs ", suffix = "" } = params;

  if (!dtEnd) {
    return "";
  }

  try {
    const monthLabel = formatMonth(dtEnd, {
      includeYear: true,
      usePreviousYear: true,
      yearFormat,
    });

    if (!monthLabel) {
      return "";
    }

    return `${prefix}${monthLabel}${suffix}`;
  } catch {
    return "";
  }
}

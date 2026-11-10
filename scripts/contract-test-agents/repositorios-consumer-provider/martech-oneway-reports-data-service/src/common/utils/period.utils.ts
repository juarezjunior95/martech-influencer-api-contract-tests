/**
 * Period format processor parameters
 */
export interface PeriodFormatParams {
  alwaysUseQuarter?: boolean;
  useCumulativeQuarter?: boolean;
  includeYear?: boolean;
  yearFormat?: "full" | "short";
}

/**
 * Formats a date range into a specific period type
 * @param dateIni - Start date string
 * @param dateEnd - End date string
 * @param params - Formatting parameters
 * @returns Formatted period string
 */
export function formatPeriod(
  dateIni: string,
  dateEnd: string,
  params?: PeriodFormatParams,
): string {
  try {
    const startDate = new Date(dateIni);
    const endDate = new Date(dateEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "";
    }

    const {
      alwaysUseQuarter = false,
      useCumulativeQuarter = false,
      includeYear = false,
      yearFormat = "short",
    } = params || {};

    if (alwaysUseQuarter) {
      const base = getQuarterFromDate(endDate);
      return appendYearIfRequested(base, endDate, { includeYear, yearFormat });
    }

    if (useCumulativeQuarter) {
      const base = getCumulativeQuarterLabel(endDate);
      return appendYearIfRequested(base, endDate, { includeYear, yearFormat });
    }

    const quarter = getQuarterFromDate(endDate);
    const intervalMonths = getMonthDifference(startDate, endDate);

    const base = intervalMonths >= 3 ? "FY" : quarter;
    return appendYearIfRequested(base, endDate, { includeYear, yearFormat });
  } catch {
    return "";
  }
}

/**
 * Returns quarter for a given date
 * @param date - Date to get quarter from
 * @returns Quarter string ("Q1", "Q2", "Q3" or "Q4")
 */
function getQuarterFromDate(date: Date): string {
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1

  if (month <= 3) return "Q1";
  if (month <= 6) return "Q2";
  if (month <= 9) return "Q3";
  return "Q4";
}

function getQuarterFromUTCDate(date: Date): string {
  const month = date.getUTCMonth() + 1; // getUTCMonth() returns 0-11, so add 1

  if (month <= 3) return "Q1";
  if (month <= 6) return "Q2";
  if (month <= 9) return "Q3";
  return "Q4";
}

/**
 * Gets a label for data that is cumulative among various quarters
 * @param date - Date to get cumulative quarter label from
 * @returns Cumulative quarter label
 */
function getCumulativeQuarterLabel(date: Date): string {
  const quarter = getQuarterFromDate(date);

  const cumulativeMap: Record<string, string> = {
    Q1: "Q1",
    Q2: "H1",
    Q3: "YTD",
    Q4: "FY",
  };

  return cumulativeMap[quarter] || "FY";
}

/**
 * Calculates the difference in months between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of months difference
 */
function getMonthDifference(startDate: Date, endDate: Date): number {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  return yearDiff * 12 + monthDiff;
}

/**
 * Appends year to a base period label if requested
 * @param base - Base period label (e.g., "Q1", "H1", "FY")
 * @param endDate - End date used to extract the year
 * @param options - Year inclusion options
 * @returns Label with year appended when requested; otherwise base
 */
export function appendYearIfRequested(
  base: string,
  endDate: Date,
  options?: { includeYear?: boolean; yearFormat?: "full" | "short" },
): string {
  const { includeYear = false, yearFormat = "short" } = options || {};
  return includeYear ? includeYearInResult(endDate, yearFormat, base) : base;
}

/**
 * Includes year in the result text
 * @param endDate - End date
 * @param yearFormat - Year format ("full" or "short")
 * @param result - Result string with just the period
 * @returns Result string with year included
 */
function includeYearInResult(
  endDate: Date,
  yearFormat: "full" | "short" = "short",
  result: string,
): string {
  const year = endDate.getFullYear();
  const yearLabel = formatYear(year, yearFormat);
  return `${result}'${yearLabel}`;
}

/**
 * Formats year based on the specified format
 * @param year - Year number
 * @param format - Year format ("full" or "short")
 * @returns Formatted year string
 */
function formatYear(year: number, format: "full" | "short" = "full"): string {
  if (format === "full") {
    return year.toString();
  }

  return year.toString().slice(-2);
}

/**
 * Checks if two dates are in the same quarter and year (using UTC)
 * @param date1 - First date string
 * @param date2 - Second date string
 * @returns True if both dates are in the same quarter and year, false otherwise
 */
export function areDatesInSameQuarter(date1: string, date2: string): boolean {
  if (!date1 || !date2) {
    return false;
  }

  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }

    // Check if same year (UTC)
    if (d1.getUTCFullYear() !== d2.getUTCFullYear()) {
      return false;
    }

    const quarter1 = getQuarterFromUTCDate(d1);
    const quarter2 = getQuarterFromUTCDate(d2);

    return quarter1 === quarter2;
  } catch {
    return false;
  }
}

/**
 * Maps UI ytd-month preset values to the period codes expected by Databricks
 * procedures/SQL (e.g. preset value "Month" → "MTD").
 */
export function normalizePeriodFilterValue(
  value: string | number | boolean,
): string {
  const normalized = String(value).trim();

  if (normalized === "Month") {
    return "MTD";
  }

  return normalized;
}

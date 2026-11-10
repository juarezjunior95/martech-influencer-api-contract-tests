/**
 * Month format processor parameters
 */
export interface MonthFormatParams {
  includeYear?: boolean;
  usePreviousYear?: boolean;
  yearFormat?: "full" | "short";
}

/**
 * Gets month abbreviation from a date
 * @param date - Date to get month from
 * @returns Month abbreviation (e.g., "Jan", "Feb", "Mar")
 */
function getMonthAbbreviation(date: Date): string {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthNames[date.getUTCMonth()];
}

/**
 * Formats a date into a month label
 * @param dtEnd - End date string
 * @param params - Formatting parameters
 * @returns Formatted month label string
 */
export function formatMonth(dtEnd: string, params?: MonthFormatParams): string {
  if (!dtEnd) {
    return "";
  }

  try {
    const endDate = new Date(dtEnd);

    if (isNaN(endDate.getTime())) {
      return "";
    }

    const {
      includeYear = false,
      usePreviousYear = false,
      yearFormat = "full",
    } = params || {};

    const month = getMonthAbbreviation(endDate);
    if (!month) {
      return "";
    }

    let result: string;

    if (!includeYear) {
      result = month;
    } else {
      const year = usePreviousYear
        ? endDate.getUTCFullYear() - 1
        : endDate.getUTCFullYear();
      const yearLabel = formatYear(year, yearFormat);

      if (!yearLabel) {
        result = month;
      } else {
        result = `${month}'${yearLabel}`;
      }
    }

    return result;
  } catch {
    return "";
  }
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

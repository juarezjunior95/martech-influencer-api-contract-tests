import { parseDate } from "../parseDate";

/** e.g. Dec'24, Sep'25 — must run before parseDate so "Dec'24" is not parsed as Dec 24. */
const LY_MONTH_LABEL_PATTERN = /^([A-Za-z]{3})\s*'(\d{2})$/;

export class FormatFyPeriodCommand {
  public readonly name = "formatFyPeriod";

  execute(
    dateString: string | null | undefined,
    dateLocation?: "prefix" | "suffix",
  ): string | undefined {
    if (typeof dateString !== "string" || !dateString) {
      return undefined;
    }

    const lyMatch = LY_MONTH_LABEL_PATTERN.exec(dateString);
    if (lyMatch) {
      const yr = lyMatch[2];
      return dateLocation === "prefix" ? `FY'${yr}` : `${yr}'FY`;
    }

    const date = parseDate(dateString);
    if (!date) return undefined;

    const year = date.getUTCFullYear().toString().slice(-2);
    return dateLocation === "prefix" ? `FY'${year}` : `${year}'FY`;
  }
}

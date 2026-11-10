export class FormatPeriodRangeCommand {
  public readonly name = "formatPeriodRange";

  execute(
    startDate: string | null | undefined,
    endDate: string | null | undefined,
  ): string {
    if (!this.isDateLike(startDate) || !this.isDateLike(endDate)) {
      return "-";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "-";
    }

    const endLabel = this.monthLabel(end, true);
    if (
      start.getUTCFullYear() === end.getUTCFullYear() &&
      start.getUTCMonth() === end.getUTCMonth()
    ) {
      return endLabel;
    }

    return `${this.monthLabel(start, false)}-${endLabel}`;
  }

  private isDateLike(value: unknown): value is string {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value);
  }

  private monthLabel(date: Date, includeYear: boolean): string {
    const month = date.toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    if (!includeYear) return month;
    return `${month}'${date.getUTCFullYear().toString().slice(-2)}`;
  }
}

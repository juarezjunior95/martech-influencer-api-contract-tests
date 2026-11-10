import { FormatDateToMonthCommand } from "./FormatDateToMonthCommand";
import { FormatDateToQuarterCommand } from "./FormatDateToQuarterCommand";
import { FormatPeriodRangeCommand } from "./FormatPeriodRangeCommand";

export class FormatPeriodChipCommand {
  public readonly name = "formatPeriodChip";

  private readonly month = new FormatDateToMonthCommand();
  private readonly quarter = new FormatDateToQuarterCommand();
  private readonly range = new FormatPeriodRangeCommand();

  execute(
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    period: string | null | undefined,
    isQuarter = false,
  ): string {
    const normalized = typeof period === "string" ? period.toUpperCase() : "";
    if (!normalized)
      return isQuarter
        ? this.quarter.execute(endDate)
        : this.month.execute(endDate);

    if (isQuarter) {
      return `${this.quarter.execute(endDate)} ${normalized}`;
    }

    if (normalized === "YTD" || normalized === "L3M") {
      return `${this.range.execute(startDate, endDate)} ${normalized}`;
    }

    return `${this.month.execute(endDate)} ${normalized}`;
  }
}

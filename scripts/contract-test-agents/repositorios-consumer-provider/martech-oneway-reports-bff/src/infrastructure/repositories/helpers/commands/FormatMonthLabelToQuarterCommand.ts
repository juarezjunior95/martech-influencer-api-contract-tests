export class FormatMonthLabelToQuarterCommand {
  public readonly name = "formatMonthLabelToQuarter";

  private static readonly MONTH_TO_QUARTER: Record<string, number> = {
    Jan: 1,
    Feb: 1,
    Mar: 1,
    Apr: 2,
    May: 2,
    Jun: 2,
    Jul: 3,
    Aug: 3,
    Sep: 3,
    Oct: 4,
    Nov: 4,
    Dec: 4,
  };

  execute(monthLabel: string | null | undefined): string {
    if (typeof monthLabel !== "string" || !monthLabel) return "";

    const match = monthLabel.match(/^([A-Za-z]{3})('?\d{2})$/);
    if (!match) return "";

    const monthAbbr =
      match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    const yearSuffix = match[2];
    const quarter =
      FormatMonthLabelToQuarterCommand.MONTH_TO_QUARTER[monthAbbr];

    return quarter ? `Q${quarter}${yearSuffix}` : "";
  }
}

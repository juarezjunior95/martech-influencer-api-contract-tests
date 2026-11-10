export class LabelPeriodMonthCommand {
  public readonly name = "labelPeriodMonth";

  private static readonly MONTHS = [
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

  execute(year: number | string, month: number | string): string {
    const y = Number(year);
    const m = Number(month);
    if (
      Number.isNaN(y) ||
      Number.isNaN(m) ||
      !Number.isInteger(y) ||
      !Number.isInteger(m) ||
      m < 1 ||
      m > 12 ||
      y < 1
    ) {
      return "";
    }
    return `${LabelPeriodMonthCommand.MONTHS[m - 1]}'${y.toString().slice(-2)}`;
  }
}

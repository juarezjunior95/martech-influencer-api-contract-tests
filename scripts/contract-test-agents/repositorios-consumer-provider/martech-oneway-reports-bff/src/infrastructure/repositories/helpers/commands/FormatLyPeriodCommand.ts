import { parseDate } from "../parseDate";

export class FormatLyPeriodCommand {
  public readonly name = "formatLyPeriod";

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

  execute(dateString: string | null | undefined): string | undefined {
    const date = parseDate(dateString);
    if (!date) return undefined;

    date.setUTCFullYear(date.getUTCFullYear() - 1);

    const month = FormatLyPeriodCommand.MONTHS[date.getUTCMonth()];
    const year = date.getUTCFullYear().toString().slice(-2);

    return `${month}'${year}`;
  }
}

import { parseDate } from "../parseDate";

export class FormatPeriodCommand {
  public readonly name = "formatPeriod";

  execute(dateString: string | null | undefined): string | undefined {
    const date = parseDate(dateString);
    if (!date) return undefined;

    const month = date.toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${month}'${year}`;
  }
}

export class FormatDateToMonthCommand {
  public readonly name = "formatDateToMonth";

  execute(dateString: string | null | undefined): string {
    if (!dateString) return "-";
    if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      const monthShort = date.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
      });
      const yearLastTwo = date.getUTCFullYear().toString().slice(-2);

      return `${monthShort}'${yearLastTwo}`;
    } catch {
      return "-";
    }
  }
}

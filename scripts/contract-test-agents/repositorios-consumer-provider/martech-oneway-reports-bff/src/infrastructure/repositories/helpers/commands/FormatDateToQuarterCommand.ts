export class FormatDateToQuarterCommand {
  public readonly name = "formatDateToQuarter";

  execute(dateString: string | null | undefined): string {
    if (typeof dateString !== "string" || !dateString) return "-";
    if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) return "-";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();
      const quarter = Math.floor((month - 1) / 3) + 1;

      return `Q${quarter}'${year.toString().slice(-2)}`;
    } catch {
      return "-";
    }
  }
}

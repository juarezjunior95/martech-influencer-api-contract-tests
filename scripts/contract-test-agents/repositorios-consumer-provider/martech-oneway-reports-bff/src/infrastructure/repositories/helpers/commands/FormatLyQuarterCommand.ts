export class FormatLyQuarterCommand {
  public readonly name = "formatLyQuarter";

  execute(input: unknown): string {
    const dateString = Array.isArray(input) ? input[0] : input;
    if (typeof dateString !== "string" || !dateString) return "-";
    if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) return "-";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear() - 1;
      const quarter = Math.floor((month - 1) / 3) + 1;

      return `Q${quarter}'${year.toString().slice(-2)}`;
    } catch {
      return "-";
    }
  }
}

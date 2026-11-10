export class FormatLqQuarterCommand {
  public readonly name = "formatLqQuarter";

  execute(input: unknown): string {
    const dateString = Array.isArray(input) ? input[0] : input;
    if (typeof dateString !== "string" || !dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const month = date.getUTCMonth() + 1;
    let year = date.getUTCFullYear();
    let quarter = Math.floor((month - 1) / 3) + 1;

    if (quarter === 1) {
      quarter = 4;
      year = year - 1;
    } else {
      quarter = quarter - 1;
    }

    return `Q${quarter}'${year.toString().slice(-2)}`;
  }
}

export class FormatCompactNumberCommand {
  public readonly name = "formatCompactNumber";

  execute(value: number | string | null | undefined): string {
    if (typeof value !== "number" || isNaN(value)) {
      return "-";
    }

    const formatter = Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    return formatter.format(value);
  }
}

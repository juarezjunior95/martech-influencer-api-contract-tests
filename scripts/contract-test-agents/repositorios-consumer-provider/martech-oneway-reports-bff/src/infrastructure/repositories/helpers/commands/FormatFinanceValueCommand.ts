export class FormatFinanceValueCommand {
  public readonly name = "formatFinanceValue";

  execute(value: number | string | null | undefined): string {
    if (typeof value !== "number" || isNaN(value)) {
      return "-";
    }

    const abs = value >= 0 ? value : -value;

    if (abs >= 1e9) {
      return this.formatNumber(value / 1e9) + "B";
    }
    if (abs >= 1e6) {
      return this.formatNumber(value / 1e6) + "M";
    }
    if (abs >= 1000) {
      return this.formatNumber(value / 1000) + "K";
    }
    return this.formatNumber(value);
  }

  private formatNumber(n: number): string {
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: true,
    }).format(n);
  }
}

export class LabelPeriodQuarterCommand {
  public readonly name = "labelPeriodQuarter";

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
    const quarter = Math.ceil(m / 3);
    const yearShort = y.toString().slice(-2);
    return `Q${quarter}'${yearShort}`;
  }
}

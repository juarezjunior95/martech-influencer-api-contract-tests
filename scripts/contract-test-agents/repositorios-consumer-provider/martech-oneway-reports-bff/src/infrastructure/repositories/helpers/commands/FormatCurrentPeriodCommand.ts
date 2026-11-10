export class FormatCurrentPeriodCommand {
  public readonly name = "formatCurrentPeriod";

  execute(): string {
    const date = new Date();
    const month = date.toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${month}'${year}`;
  }
}

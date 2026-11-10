export class GetIndexColorCommand {
  public readonly name = "getIndexColor";
  public readonly defaultColor = { color: "neutral", background: "neutral" };
  public readonly upColor = { color: "up", background: "up" };
  public readonly downColor = { color: "down", background: "down" };
  public readonly tableColor = { color: "neutral", background: "neutral" };

  execute(
    value: number | string | null | undefined,
    isTable: boolean = false,
  ): {
    color: string;
    background: string;
  } {
    const num = typeof value === "string" ? Number(value) : value;

    if (
      num === null ||
      num === undefined ||
      typeof num !== "number" ||
      isNaN(num)
    ) {
      return this.defaultColor;
    }

    if (num > 105) {
      return this.upColor;
    }

    if (num < 95) {
      return this.downColor;
    }

    return isTable ? this.tableColor : this.defaultColor;
  }
}

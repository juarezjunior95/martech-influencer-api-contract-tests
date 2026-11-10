export class FormatValueCommand {
  public readonly name = "formatValue";

  execute(
    value: number | string | null | undefined,
    returnType?: "number" | "string",
  ): number | string {
    const num = typeof value === "string" ? Number(value) : value;

    if (
      num === null ||
      num === undefined ||
      typeof num !== "number" ||
      isNaN(num)
    ) {
      return "-";
    }

    if (returnType === "number") {
      return num;
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(num);
  }
}

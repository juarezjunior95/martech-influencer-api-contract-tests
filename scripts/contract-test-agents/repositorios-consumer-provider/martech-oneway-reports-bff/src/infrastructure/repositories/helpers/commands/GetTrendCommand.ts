/**
 * Returns "positive" or "negative" from a numeric value and variation direction.
 * When value is missing, null, or zero, returns "positive" (neutral).
 * Otherwise uses direction: "up" -> "positive", else -> "negative".
 */
export class GetTrendCommand {
  public readonly name = "getTrend";

  execute(
    value: number | string | null | undefined,
    direction: string | null | undefined,
  ): "positive" | "negative" {
    const isNeutral =
      value === null ||
      value === undefined ||
      (typeof value === "number" && (isNaN(value) || value === 0));

    if (isNeutral) {
      return "positive";
    }

    const dir = typeof direction === "string" ? direction.toLowerCase() : "";
    return dir === "up" ? "positive" : "negative";
  }
}

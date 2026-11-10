/**
 * Returns one of two color tokens ("up"/"down" values) based on a numeric
 * variation and a comparison rule.
 *
 * Rules:
 * - "standard" (default): positive values map to `up`, negative to `down`.
 * - "reverse": positive values map to `down`, negative to `up`.
 *
 * The `includeZero` flag controls whether zero is treated as positive:
 * - false (default): strict `> 0` (zero is treated as negative).
 * - true: `>= 0` (zero is treated as positive).
 *
 * `nonNumericColor` controls fallback for null, undefined, NaN and
 * non-numeric values. When omitted, falls back to `undefined`.
 */
export type VariationRule = "standard" | "reverse";
export interface GetColorUpDownOptions {
  rule?: VariationRule;
  includeZero?: boolean;
  nonNumericColor?: string;
}

export class GetColorUpDownCommand {
  public readonly name = "getColorUpDown";

  execute(
    value: number | string | null | undefined,
    up: string,
    down: string,
    options: GetColorUpDownOptions = {},
  ): string | undefined {
    const { rule = "standard", includeZero = false, nonNumericColor } = options;
    const numeric =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : NaN;

    if (!Number.isFinite(numeric)) {
      return nonNumericColor;
    }

    const isPositive = includeZero ? numeric >= 0 : numeric > 0;
    const normalizedRule: VariationRule =
      rule === "reverse" ? "reverse" : "standard";

    const positiveToken = normalizedRule === "reverse" ? down : up;
    const negativeToken = normalizedRule === "reverse" ? up : down;

    return isPositive ? positiveToken : negativeToken;
  }
}

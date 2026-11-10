/**
 * Direction format processor parameters
 */
export interface DirectionFormatParams {
  up?: string;
  down?: string;
  center?: string;
  usingCenter?: boolean;
  invert?: boolean;
  positiveZero?: boolean;
}

/**
 * Formats a value into direction labels (up/down/center)
 * @param value - The value to process
 * @param params - Direction format parameters
 * @returns Direction label string
 */
export function formatDirection(
  value: string | number,
  params: DirectionFormatParams = {},
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const {
    up = "up",
    down = "down",
    center = "center",
    invert = false,
    usingCenter = false,
    positiveZero = false,
  } = params;

  // Handle center case for both numeric and string
  if (usingCenter && (value === 0 || value === "")) {
    return center;
  }

  // Process based on value type
  if (typeof value === "number") {
    let condition = positiveZero ? value >= 0 : value > 0;

    return getDirectionLabel(condition, invert, { up, down });
  }

  // Handle string values
  const valueUpper = String(value).toUpperCase();
  const isPositive = valueUpper === "G";
  const isNegative = valueUpper === "R";

  if (isPositive || isNegative) {
    return getDirectionLabel(isPositive, invert, { up, down });
  }

  return "";
}

/**
 * Gets the appropriate direction label based on value and inversion
 * @param isPositive - Whether the value is positive
 * @param invert - Whether to invert the direction
 * @param params - Direction format parameters
 * @returns Direction label
 */
function getDirectionLabel(
  isPositive: boolean,
  invert: boolean,
  params: { up: string; down: string },
): string {
  const shouldUseUp = invert ? !isPositive : isPositive;
  return shouldUseUp ? params.up : params.down;
}

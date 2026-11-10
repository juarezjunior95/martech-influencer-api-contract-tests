/**
 * Formats a number to a string with one decimal place
 * @param num - The number to format
 * @returns Formatted string with one decimal place
 */
export function formatNumberToOneDecimal(
  num: string | number | boolean,
): string {
  const value = Number(num);
  if (num === null || Number.isNaN(value)) {
    return "-";
  }
  return value.toFixed(1);
}

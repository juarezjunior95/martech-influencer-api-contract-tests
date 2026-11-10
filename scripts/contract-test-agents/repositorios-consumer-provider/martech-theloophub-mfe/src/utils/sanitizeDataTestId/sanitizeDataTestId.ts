/**
 * Sanitize string to be used as data-testid
 * - Converts to lowercase
 * - Removes accents
 * - Replaces spaces and special chars with hyphens
 * - Keeps only letters, numbers and hyphens
 *
 * @param str - String to sanitize
 * @returns Sanitized string safe for use as data-testid
 *
 * @example
 * sanitizeDataTestId("25'dec Volume (HL)") // "25-dec-volume-hl"
 * sanitizeDataTestId("Açaí & Café") // "acai-cafe"
 * sanitizeDataTestId("Market Share %") // "market-share"
 */
export const sanitizeDataTestId = (str: string): string => {
  const sanitized = str
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '') // Remove accents
    .replaceAll(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .split('-')
    .filter(Boolean) // Remove empty segments (handles multiple/leading/trailing hyphens)
    .join('-');

  return sanitized;
};

export const buildDataTestId = (
  base: string,
  dataTestId?: string,
  suffix?: string,
): string | undefined => {
  if (!dataTestId) {
    return undefined;
  }

  const parts = [base, dataTestId, suffix].filter(Boolean);

  return parts.join('-');
};

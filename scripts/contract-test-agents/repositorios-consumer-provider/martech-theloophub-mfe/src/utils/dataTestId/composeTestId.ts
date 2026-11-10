export const composeTestId = (
  dataTestId: string | undefined,
  suffix: string,
): string | undefined => (dataTestId ? `${dataTestId}-${suffix}` : undefined);

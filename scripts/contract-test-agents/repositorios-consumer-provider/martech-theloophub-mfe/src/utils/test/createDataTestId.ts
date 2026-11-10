export function createDataTestId(
  dataTestId: string,
  prefix?: string,
  suffix?: string,
): string | undefined {
  if (!dataTestId) {
    return;
  }

  const testIdPrefix = prefix ? `${prefix}-` : '';
  const testIdSuffix = suffix ? `-${suffix}` : '';

  return dataTestId ? `${testIdPrefix}${dataTestId}${testIdSuffix}` : undefined;
}

const parseDisplayValue = (raw: number, formatted?: string): number => {
  if (formatted !== undefined) {
    const parsed = Number.parseFloat(formatted.replace('%', ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return raw;
};

export const buildDirectionsArray = (
  data: number[],
  formattedData?: string[],
) => {
  return data.map((num, index) => {
    if (index === 0) {
      return '';
    }
    const value = parseDisplayValue(num, formattedData?.[index]);
    return value > 17 ? 'down' : '';
  });
};

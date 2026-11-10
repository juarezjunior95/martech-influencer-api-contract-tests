export const findInArray = (
  arr: any[],
  searchValue: string,
  properties: string[] = ['value', 'code', 'label', 'name'],
): boolean => {
  return arr.some((item: any) => {
    // Direct string comparison
    if (typeof item === 'string') {
      return item === searchValue;
    }

    // Check all specified properties
    return properties.some((prop) => item?.[prop] === searchValue);
  });
};

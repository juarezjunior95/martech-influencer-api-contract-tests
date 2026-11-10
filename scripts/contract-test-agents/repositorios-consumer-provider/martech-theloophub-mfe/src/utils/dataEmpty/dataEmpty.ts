export const EMPTY_DATA = Object.freeze({ empty: true });

export const isDataEmpty = (data: unknown): boolean => {
  if (!data) return true;
  const dataObj = data as Record<string, unknown>;
  return Boolean(dataObj['#empty']) || Boolean(dataObj['empty']);
};

export type WithEmpty<T> = T & { empty?: boolean };

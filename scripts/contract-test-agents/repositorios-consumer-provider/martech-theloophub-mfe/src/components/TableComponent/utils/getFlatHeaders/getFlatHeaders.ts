import { TableHeaderType } from '../../types';

export const getFlatHeaders = (
  headers: TableHeaderType[],
): TableHeaderType[] => {
  return headers.reduce<TableHeaderType[]>((acc, col) => {
    if (col.children && col.children.length > 0) {
      acc.push(...col.children);
    } else {
      acc.push(col);
    }
    return acc;
  }, []);
};

import type { TableDataType } from 'components/Table/types';

export const omitSecondPnlRowGroup = (data: TableDataType): TableDataType => {
  if (!data?.rows?.length) {
    return data;
  }

  return {
    ...data,
    rows: data.rows.filter((_, index) => index !== 1),
  };
};

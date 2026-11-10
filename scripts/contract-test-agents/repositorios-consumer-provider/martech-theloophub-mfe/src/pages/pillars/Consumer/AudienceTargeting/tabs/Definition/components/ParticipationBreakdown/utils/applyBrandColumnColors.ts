import type { TableDataType, TableHeaderType } from 'components/TableComponent';
import { SUB_COLUMN_WIDTH } from 'components/TableComponent/components/FlexTableLayout/FlexTableLayout';

import { PARTICIPATION_BREAKDOWN_BRAND_PALETTE } from '../constants';

const AXIS_ALIGN = 'right' as const;
const VOLUME_CHILD_ALIGN = 'right' as const;
const INDEX_CHILD_ALIGN = 'center' as const;

const getChildConfig = (
  childIndex: number,
  childCount: number,
  color: string,
): Partial<TableHeaderType> => {
  if (childCount !== 2) {
    return childIndex === 0
      ? { align: VOLUME_CHILD_ALIGN, color }
      : { align: INDEX_CHILD_ALIGN };
  }
  return childIndex === 0
    ? { align: VOLUME_CHILD_ALIGN, width: SUB_COLUMN_WIDTH.PRIMARY, color }
    : { align: INDEX_CHILD_ALIGN, width: SUB_COLUMN_WIDTH.SECONDARY };
};

const isBrandColumn = (column: TableHeaderType): boolean =>
  Array.isArray(column.children) && column.children.length > 0;

const isAxisColumn = (column: TableHeaderType): boolean =>
  !isBrandColumn(column);

export const applyBrandColumnColors = (data: TableDataType): TableDataType => {
  const palette = PARTICIPATION_BREAKDOWN_BRAND_PALETTE;
  let brandIndex = 0;

  const header = data.header.map((column) => {
    if (isAxisColumn(column)) {
      return { ...column, align: AXIS_ALIGN };
    }

    const color = palette[brandIndex % palette.length];
    brandIndex += 1;

    const childCount = column.children?.length ?? 0;
    const children = column.children?.map((child, childIdx) => ({
      ...child,
      ...getChildConfig(childIdx, childCount, color),
    }));

    return { ...column, color, children };
  });

  return { ...data, header };
};

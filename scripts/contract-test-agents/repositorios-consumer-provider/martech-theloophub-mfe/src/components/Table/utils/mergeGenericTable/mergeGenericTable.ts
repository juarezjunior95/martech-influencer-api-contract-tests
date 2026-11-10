import { merge } from 'lodash';

import { TableDataType } from '../../types';

export function mergeGenericTables(items: TableDataType[]): TableDataType {
  const allHeaders = items.flatMap((item) => item.header);
  const seen = new Set();
  const mergedHeaders = allHeaders.filter((col) => {
    const key = col.id || col.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const maxGroups = Math.max(...items.map((item) => (item.rows || []).length));
  const mergedRowGroupData = Array.from({ length: maxGroups }, (_, rowIdx) => {
    const baseGroup = items[0].rows?.[rowIdx] || [];
    const mergedGroup = new Array(baseGroup.length).fill(null);

    items.forEach((item) => {
      const group = item.rows?.[rowIdx];
      if (group && Array.isArray(group)) {
        group.forEach((cell, colIdx) => {
          mergedGroup[colIdx] = mergedGroup[colIdx] || {};
          mergedGroup[colIdx] = merge(mergedGroup[colIdx], cell);
        });
      }
    });

    return mergedGroup;
  });

  return {
    header: mergedHeaders,
    rows: mergedRowGroupData,
  };
}

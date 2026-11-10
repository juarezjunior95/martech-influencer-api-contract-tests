import { TableDataType } from 'components/Table/types';

export const filterAbiRows = (data: TableDataType) => {
  const newRows = [];
  if (!data?.rows || !Array.isArray(data.rows)) {
    return { header: [], rows: [] };
  }
  data.rows.forEach((group) => {
    const newGroup = [];
    group.forEach((row: Record<string, any>) => {
      if (
        row?.type?.value === 'competitor' &&
        row?.id?.value !== 'Competitor Brands'
      ) {
        newGroup.push(row);
      }
    });
    newRows.push(newGroup);
  });
  return { ...data, rows: newRows };
};

export const filterCompetitorRows = (data: TableDataType) => {
  const newRows = [];
  if (!data?.rows || !Array.isArray(data.rows)) {
    return { header: [], rows: [] };
  }
  data.rows.forEach((group) => {
    const newGroup = [];
    group.forEach((row: Record<string, any>) => {
      if (row?.type?.value !== 'competitor') {
        newGroup.push(row);
      }
    });
    newRows.push(newGroup);
  });
  return { ...data, rows: newRows };
};

export const mergeRowsInPairs = (rows: any[]) => {
  const merged: any[] = [];
  let i = 0;

  while (i < rows.length) {
    const rowA = rows[i];
    const rowB = rows?.[i + 1];

    if (rowA?.id?.value !== rowB?.id?.value) {
      i += 1;
      merged.push(rowA);
      continue;
    }

    if (!rowB) {
      merged.push(rowA);
      continue;
    }

    const newRow = {};

    Object.entries(rowA).forEach(([key, value]: any) => {
      newRow[key] = {
        value: value.value,
        value2: rowB[key].value,
        unitMeasure: value.unitMeasure,
        unitMeasure2: rowB[key].unitMeasure,
        variationDirection: value.variationDirection,
        variationDirection2: rowB[key].variationDirection,
        chartData: value.chartData && {
          data: [...value.chartData.data, ...rowB[key].chartData.data],
          backgroundColor: [
            ...value.chartData.backgroundColor,
            ...rowB[key].chartData.backgroundColor,
          ],
          secondaryBackgroundColor: [
            ...(value.chartData?.secondaryBackgroundColor || []),
            ...(rowB[key].chartData?.secondaryBackgroundColor || []),
          ],
        },
      };
    });

    merged.push(newRow);
    i += 2;
  }

  return merged;
};

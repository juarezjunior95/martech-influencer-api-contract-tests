import { TableDataType, TableRowType } from 'components/Table/types';

import { TableDetailsKpiData } from '../../../types';

interface LeftTableProcessing {
  nazKpiData: TableDetailsKpiData;
  sazKpiData: TableDetailsKpiData;
  mazKpiData: TableDetailsKpiData;
  loading: boolean;
}

interface RightTableProcessing {
  apacKpiData: TableDetailsKpiData;
  afrKpiData: TableDetailsKpiData;
  eurKpiData: TableDetailsKpiData;
  loading: boolean;
}

const emptyTable: TableDataType = { header: [], rows: [] };

type FlattenRows = (rows: TableRowType[][]) => TableRowType[];

const flattenRows: FlattenRows = (rows) => rows.flat();

const deepFlattenRows: FlattenRows = (rows) =>
  rows.flat(Infinity) as TableRowType[];

const mapRowsToZone = (
  table: TableDataType,
  zone: string,
  flatten: FlattenRows,
  options: { groupBorder?: boolean } = {},
): TableRowType[] => {
  const flatRows = flatten(table?.rows ?? []);
  const firstRowLength = table?.rows?.[0]?.length ?? 0;

  return flatRows.map((row, rowIndex) => ({
    ...row,
    label: {
      value: zone,
      ...(options.groupBorder ? { groupBorder: true } : {}),
      borderBottom: rowIndex === firstRowLength - 1,
    },
  }));
};

export const leftTableProcessing = ({
  nazKpiData,
  sazKpiData,
  mazKpiData,
  loading,
}: LeftTableProcessing): TableDataType => {
  if (loading) return { header: [], rows: [] };

  const sazTable = sazKpiData?.performanceDetails || emptyTable;
  const nazTable = nazKpiData?.performanceDetails || emptyTable;
  const mazTable = mazKpiData?.performanceDetails || emptyTable;

  return {
    header: [...(nazTable?.header ?? [])],
    rows: [
      [
        ...mapRowsToZone(nazTable, 'NAZ', flattenRows, { groupBorder: true }),
        ...mapRowsToZone(sazTable, 'SAZ', flattenRows, { groupBorder: true }),
        ...mapRowsToZone(mazTable, 'MAZ', flattenRows),
      ],
    ],
  };
};

export const rightTableProcessing = ({
  apacKpiData,
  afrKpiData,
  eurKpiData,
  loading,
}: RightTableProcessing): TableDataType => {
  if (loading) return { header: [], rows: [] };

  const apacTable = apacKpiData?.performanceDetails || emptyTable;
  const afrTable = afrKpiData?.performanceDetails || emptyTable;
  const eurTable = eurKpiData?.performanceDetails || emptyTable;

  return {
    header: [...(apacTable?.header ?? [])],
    rows: [
      [
        ...mapRowsToZone(apacTable, 'APAC', deepFlattenRows, {
          groupBorder: true,
        }),
        ...mapRowsToZone(afrTable, 'AFR', deepFlattenRows, {
          groupBorder: true,
        }),
        ...mapRowsToZone(eurTable, 'EUR', deepFlattenRows),
      ],
    ],
  };
};

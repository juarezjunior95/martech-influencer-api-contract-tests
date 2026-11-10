import { TableDataType } from 'components/Table/types';
import { splitGenericTable, TableDatas } from 'components/Table/utils';
import { mergeGenericTables } from 'components/Table/utils/mergeGenericTable';

const MAX_COLUMNS_PER_TABLE = 11;
const SECTIONS = 2;

export interface PnlBrandsInput {
  kpiData: { table?: TableDataType };
  loading: boolean;
  error: Error | null;
}

interface SplitPnlBrandsTableResult {
  first: TableDataType;
  second: TableDataType;
}

export const splitPnlBrandsTable = (
  pnlBrands: PnlBrandsInput,
): SplitPnlBrandsTableResult => {
  const hasNoTableData = pnlBrands.loading || !pnlBrands.kpiData?.table?.header;
  if (hasNoTableData)
    return {
      first: {} as TableDataType,
      second: {} as TableDataType,
    };

  const [, , megabrands, expansion, sustain, tail] =
    pnlBrands.kpiData?.table?.header.map((header) =>
      header.children.flatMap((child) => child.id),
    ) || [];

  const pnlBrandsSplited = splitGenericTable(pnlBrands.kpiData?.table, [
    ['kpi', 'TT Market'],
    ['Megabrands'],
    ['Expansion'],
    ['Sustain'],
    ['Tail'],
  ]);

  const tables = balanceTables(pnlBrandsSplited, {
    megabrands,
    expansion,
    sustain,
    tail,
  });

  return tables;
};

const divideSections = (
  sections: Array<{ columns: number; table: TableDataType }>,
) => {
  let tableIndex = 0;
  const dividedTableSections: [TableDataType[], TableDataType[]] = [[], []];
  const dividedTotalBrandsColumns = [0, 0];
  for (const section of sections) {
    if (section.columns === 0 || tableIndex === SECTIONS) continue;

    if (
      dividedTotalBrandsColumns[tableIndex] + section.columns <=
      MAX_COLUMNS_PER_TABLE
    ) {
      dividedTableSections[tableIndex].push(section.table);
      dividedTotalBrandsColumns[tableIndex] += section.columns;
    } else {
      dividedTableSections[tableIndex + 1].push(section.table);
      dividedTotalBrandsColumns[tableIndex + 1] += section.columns;
      tableIndex++;
    }
  }

  return dividedTableSections;
};

const balanceTables = (
  pnlBrandsSplited: TableDatas,
  {
    megabrands,
    expansion,
    sustain,
    tail,
  }: {
    megabrands: string[];
    expansion: string[];
    sustain: string[];
    tail: string[];
  },
): SplitPnlBrandsTableResult => {
  const baseTable: TableDataType =
    pnlBrandsSplited['kpi'] || ({} as TableDataType);
  const megabrandsTable: TableDataType =
    pnlBrandsSplited['Megabrands'] || ({} as TableDataType);
  const expansionTable: TableDataType =
    pnlBrandsSplited['Expansion'] || ({} as TableDataType);
  const sustainTable: TableDataType =
    pnlBrandsSplited['Sustain'] || ({} as TableDataType);
  const tailTable: TableDataType =
    pnlBrandsSplited['Tail'] || ({} as TableDataType);

  const megabrandsColumns = megabrands?.length || 0;
  const expansionColumns = expansion?.length || 0;
  const sustainColumns = sustain?.length || 0;
  const tailColumns = tail?.length || 0;

  const totalColumns =
    megabrandsColumns + expansionColumns + sustainColumns + tailColumns;
  const firstSectionsColumns = megabrandsColumns + expansionColumns;
  if (totalColumns <= MAX_COLUMNS_PER_TABLE) {
    const firstTable = mergeGenericTables([
      baseTable,
      megabrandsTable,
      expansionTable,
      sustainTable,
      tailTable,
    ]);

    return {
      first: firstTable,
      second: {} as TableDataType,
    };
  }

  let tableSections: [TableDataType[], TableDataType[]] = [[], []];

  const sections = [
    {
      name: 'Megabrands',
      table: megabrandsTable,
      columns: megabrandsColumns,
    },
    { name: 'Expansion', table: expansionTable, columns: expansionColumns },
    { name: 'Sustain', table: sustainTable, columns: sustainColumns },
    { name: 'Tail', table: tailTable, columns: tailColumns },
  ];

  if (firstSectionsColumns <= MAX_COLUMNS_PER_TABLE) {
    tableSections[0].push(megabrandsTable, expansionTable);
    tableSections[1].push(sustainTable, tailTable);
  } else {
    tableSections = divideSections(sections);
  }

  const firstTable = mergeGenericTables([baseTable, ...tableSections[0]]);

  const secondTable =
    tableSections[1].length > 0
      ? mergeGenericTables([baseTable, ...tableSections[1]])
      : {};

  return {
    first: firstTable,
    second: (tableSections[1].length > 0 ? secondTable : {}) as TableDataType,
  };
};

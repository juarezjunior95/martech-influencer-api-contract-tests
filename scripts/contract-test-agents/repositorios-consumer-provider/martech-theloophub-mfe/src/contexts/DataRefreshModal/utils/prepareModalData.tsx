import { transformAgGridData } from 'components/Table/utils';

import { tabToKpiIdsMap } from './tabToKpiIdsMap';

type KpiRow = {
  id: string;
  kpi: string;
  update_time: string;
  [key: string]: any;
};

type KpiDataResponse = {
  columnDefs: {
    headerName: string;
    field: string;
  }[];
  rowData: KpiRow[];
};

function filterKpisByTab(tab: string, data: KpiDataResponse) {
  const kpisForTab = tabToKpiIdsMap[tab];
  if (!data) {
    return { columnDefs: [], rowData: [] };
  }

  if (!kpisForTab) {
    return {
      columnDefs: data.columnDefs,
      rowData: [],
    };
  }

  return {
    columnDefs: data.columnDefs,
    rowData: data.rowData.filter((row) => kpisForTab.includes(row.id)),
  };
}

export function prepareModalData(
  tab: string,
  rawData: any,
  showAllRows: boolean,
) {
  if (!rawData || rawData.empty)
    return { modalData: null, isDisabledBtn: true };

  const filtered = filterKpisByTab(tab, rawData);
  const transformed = transformAgGridData(filtered);

  if (!transformed.rows.length) {
    return { modalData: transformed, isDisabledBtn: true };
  }

  const fullRows = transformed.rows[0];
  const isDisabledBtn = fullRows.length <= 5;
  const displayedRows =
    !showAllRows && fullRows.length > 5 ? fullRows.slice(0, 5) : fullRows;

  return {
    modalData: {
      ...transformed,
      rows: [displayedRows],
    },
    isDisabledBtn,
  };
}

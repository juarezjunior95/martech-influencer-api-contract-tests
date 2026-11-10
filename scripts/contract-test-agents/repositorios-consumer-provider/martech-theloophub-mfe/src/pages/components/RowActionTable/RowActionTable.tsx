import { useCallback, useEffect, useMemo, useState } from 'react';

import { GridApi, GridOptions } from 'ag-grid-community';
import { ColumnDefsConfig, NoRowsMessage, Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { COMPETITOR_HEADER } from './config';
import {
  StyledRowActionTable,
  StyledSelectionRowActionTable,
} from './RowActionTable.styles';
import { mergeRowsInPairs } from './utils/mergeRowsInPairs';

interface RowActionTableProps {
  dataTestId?: string;
  data: TableDataType;
  onChangeRows?: (rowId: string) => void;
  rowSelection?: boolean;
  rowHeight?: number;
  byCompetitor?: boolean;
  fixedHeight?: string;
  columnDefsConfig?: (someRowWasSelected?: boolean) => ColumnDefsConfig;
  noRowsMessage?: NoRowsMessage;

  // Callback setter
  setClearSelectionHandler?: (clear: () => void) => void;
  setRowSelectionHandler?: (rowSelection: (id: string) => void) => void;
}

export const RowActionTable: React.FC<RowActionTableProps> = ({
  dataTestId,
  data,
  onChangeRows,
  rowSelection = true,
  byCompetitor = false,
  fixedHeight,
  rowHeight,
  columnDefsConfig,
  setClearSelectionHandler,
  setRowSelectionHandler,
  noRowsMessage,
}) => {
  const [gridApi, setGridApi] = useState<GridApi>(null);
  const [someRowWasSelected, setSomeRowWasSelected] = useState(false);
  const rowSelectionConfig: GridOptions['rowSelection'] = rowSelection
    ? {
        mode: 'singleRow',
        checkboxes: false,
        enableClickSelection: true,
      }
    : undefined;

  const style = rowSelection
    ? StyledSelectionRowActionTable
    : StyledRowActionTable;

  const finalData: TableDataType = useMemo(() => {
    if (byCompetitor) {
      return {
        header: data.header,
        rows: [mergeRowsInPairs(data.rows[0])],
      };
    }

    return data;
  }, [data, byCompetitor]);

  const handleRowSelection = useCallback(
    (api: GridApi, id: string) => {
      onChangeRows?.(id);
      api.refreshCells({ force: true });
      setSomeRowWasSelected(true);
    },
    [onChangeRows],
  );

  const clearSelection = useCallback(() => {
    if (gridApi) {
      gridApi.deselectAll();
      gridApi.refreshCells({ force: true });
      setSomeRowWasSelected(true);
    }
  }, [gridApi]);

  const rowSelectionHandler = useCallback(
    (id: string) => {
      if (gridApi) {
        gridApi.forEachNode((node) => {
          if (node.data.id === id) {
            node.setSelected(true);
            handleRowSelection(gridApi, id);
          }
        });
      }
    },
    [gridApi, handleRowSelection],
  );

  useEffect(() => {
    setSomeRowWasSelected(false);
  }, [byCompetitor]);

  useEffect(() => {
    if (gridApi) {
      gridApi.deselectAll();
      setSomeRowWasSelected(false);
    }
  }, [data, gridApi]);

  useEffect(() => {
    if (setClearSelectionHandler && gridApi) {
      setClearSelectionHandler(clearSelection);
    }
  }, [setClearSelectionHandler, gridApi, clearSelection]);

  useEffect(() => {
    if (setRowSelectionHandler && gridApi) {
      setRowSelectionHandler(rowSelectionHandler);
    }
  }, [setRowSelectionHandler, gridApi, rowSelectionHandler]);
  return (
    <Table
      dataTestId={dataTestId || undefined}
      data={finalData}
      columnDefsConfig={columnDefsConfig(someRowWasSelected)}
      style={style}
      chartType="single-bar"
      headerHeight={32}
      rowHeight={rowHeight}
      getRowHeight={(params) => {
        if (rowHeight) return rowHeight;

        if (params.data.id === COMPETITOR_HEADER) {
          return 32;
        }
        return byCompetitor ? 88 : 56;
      }}
      fixedHeight={fixedHeight}
      scrollbarWidth={8}
      rowSelection={rowSelectionConfig}
      onGridReadyCallback={(params) => {
        setGridApi(params.api);
      }}
      onRowClicked={(params) => {
        if (!rowSelection) return;
        handleRowSelection(params.api, params.data.id);
      }}
      noRowsMessage={noRowsMessage}
      suppressRowVirtualisation
      suppressColumnVirtualisation
    />
  );
};

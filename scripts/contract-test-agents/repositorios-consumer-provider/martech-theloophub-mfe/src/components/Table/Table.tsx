import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  Column,
  ColumnResizedEvent,
  GridReadyEvent,
  ModuleRegistry,
  RowHeightParams,
} from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { FilterValue } from 'models/Filters';

import { CustomNoRows } from './components';
import { getRowClass, getRowHeight, onColumnResized } from './config/callbacks';
import { gridOptions } from './config/columnDefs';
import { ROW_HEIGHT_EMPTY } from './constants';
import { CustomStyleDefault, StyledTableContainer } from './Table.styles';
import { AgGridTheme } from './theme';
import { TableChartType, TableDataType, TableRowType } from './types';
import { getAllFields, getAllFieldsToHide } from './utils';
import { generateColumnDefs } from './utils/generateColumnDefs';
import { generateRowData } from './utils/generateRowData';

ModuleRegistry.registerModules([AllCommunityModule]);

export type ColumnDefsConfig = Record<string, ColDef | ColGroupDef>;

export type TableFilter = {
  allFieldsToFilter: FilterValue[];
  fieldsToHide: FilterValue[];
};

export type EmptyRow = {
  addOnStart?: boolean;
  addOnEnd?: boolean;
};

export type NoRowsMessage = {
  title?: string;
  description?: string;
};

interface TableProps {
  data: TableDataType;
  style?: React.FC;
  fixedHeight?: string;
  columnDefsConfig?: ColumnDefsConfig;
  chartType?: TableChartType;
  rowHeight?: number;
  headerHeight?: number;
  groupHeaderHeight?: number;
  scrollbarWidth?: number;
  emptyRow?: EmptyRow;
  filter?: TableFilter;
  noRowsMessage?: NoRowsMessage;
  dataTestId?: string;

  onGridReadyCallback?: (params: GridReadyEvent) => void;
  getRowHeightCallback?: (params: RowHeightParams) => number;
}

export const Table: React.FC<TableProps & AgGridReactProps> = ({
  data,
  style,
  fixedHeight,
  columnDefsConfig,
  chartType,
  rowHeight = 48,
  headerHeight = 56,
  groupHeaderHeight = 56,
  scrollbarWidth = 48,
  emptyRow,
  filter,
  noRowsMessage,
  dataTestId,
  onGridReadyCallback,
  getRowHeightCallback,
  ...rest
}) => {
  const [gridApi, setGridApi] = useState(null);
  const gridApiRef = useRef<GridReadyEvent['api'] | null>(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(fixedHeight ?? 'auto');

  const CustomStyle = style || CustomStyleDefault;

  const columnDefs = useMemo(() => {
    return data.header ? generateColumnDefs(data.header, columnDefsConfig) : [];
  }, [data.header, columnDefsConfig]);

  const allFields = useMemo(() => {
    if (!gridApi) return [];
    const columnDefs = gridApi?.getColumnDefs();
    return getAllFields(columnDefs);
  }, [gridApi]);

  const fieldsToHideMemoized = useMemo(
    () => getAllFieldsToHide(filter),
    [filter],
  );

  const rowData = useMemo(() => {
    return data.rows
      ? generateRowData(
          data.rows,
          chartType,
          emptyRow?.addOnStart,
          emptyRow?.addOnEnd,
        )
      : [];
  }, [data.rows, chartType, emptyRow?.addOnEnd, emptyRow?.addOnStart]);

  const calculateTotalHeight = useCallback(() => {
    if (fixedHeight) {
      setHeight(fixedHeight);
      return;
    }

    const containerElement = containerRef.current;
    if (!containerElement || !gridApi) return;

    const headerElement = containerElement.querySelector('.ag-header');
    const headerHeight = headerElement.offsetHeight;
    const headerWidth = headerElement.offsetWidth;
    const headerContentWidth = gridApi
      .getColumns()
      .reduce((total: number, column: Column) => {
        return total + column.getActualWidth();
      }, 0);

    const hasScrollBar = headerWidth < headerContentWidth;
    const minHeight = hasScrollBar
      ? headerHeight + scrollbarWidth
      : headerHeight;

    if (!gridApi || !rowData || rowData.length === 0) {
      setHeight(`536px`);
      return;
    }

    const rowsHeight = rowData.reduce(
      (acc: number, row: TableRowType, index: number) => {
        if (row.isEmpty) return acc + ROW_HEIGHT_EMPTY;

        const node = gridApi?.getRowNode?.(index.toString());
        const realHeight = node?.rowHeight ?? rowHeight;
        return acc + realHeight;
      },
      0,
    );

    const finalHeight = Number(rowsHeight) + minHeight;

    if (rowData.length === 0) {
      setHeight(`536px`);
      return;
    }

    setHeight(`${finalHeight}px`);
  }, [gridApi, containerRef, rowData, fixedHeight, rowHeight, scrollbarWidth]);

  const onGridReady = (event: GridReadyEvent) => {
    setGridApi(event.api);
    gridApiRef.current = event.api;

    onGridReadyCallback?.(event);

    event.api.autoSizeAllColumns();
    event.api.addEventListener('gridSizeChanged', () => {
      setTimeout(() => {
        calculateTotalHeight();
        event.api.sizeColumnsToFit();
      }, 150);
    });

    setTimeout(() => {
      calculateTotalHeight();
      event.api.sizeColumnsToFit();
    }, 1000);
  };

  const fitColumnsAndHeight = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.sizeColumnsToFit();
      calculateTotalHeight();
    }
  }, [calculateTotalHeight]);

  const checkVisibility = () => {
    const container = containerRef.current;
    if (!container) return false;

    const rect = container.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isVisible = checkVisibility();

    if (isVisible) {
      fitColumnsAndHeight();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fitColumnsAndHeight();
        }
      });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, fitColumnsAndHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(fitColumnsAndHeight, 100);
    });

    resizeObserver.observe(container);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    };
  }, [fitColumnsAndHeight]);

  useEffect(() => {
    if (!gridApi) return;

    if (!filter) return;

    gridApi.setColumnsVisible(allFields, true);
    gridApi.setColumnsVisible(fieldsToHideMemoized, false);

    const timer = setTimeout(() => {
      gridApi.sizeColumnsToFit();
    }, 100);

    return () => clearTimeout(timer);
  }, [fieldsToHideMemoized, filter, allFields, gridApi]);

  const noRowsOverlayComponent = () => {
    return (
      <CustomNoRows
        title={noRowsMessage?.title}
        description={noRowsMessage?.description}
      />
    );
  };

  return (
    <CustomStyle>
      <StyledTableContainer
        className="table-container"
        style={{ height }}
        ref={containerRef}
        data-testid={dataTestId ? `table-${dataTestId}` : undefined}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          theme={AgGridTheme}
          onGridReady={onGridReady}
          onColumnResized={(event: ColumnResizedEvent<any, any>) =>
            onColumnResized(event, containerRef)
          }
          onFirstDataRendered={() => {
            calculateTotalHeight();
            gridApiRef.current?.sizeColumnsToFit();
          }}
          gridOptions={gridOptions}
          getRowHeight={(params: RowHeightParams) =>
            getRowHeight(params, rowHeight, getRowHeightCallback)
          }
          scrollbarWidth={scrollbarWidth}
          getRowClass={getRowClass}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          groupHeaderHeight={groupHeaderHeight}
          suppressMovableColumns={true}
          suppressRowTransform={true}
          tooltipShowDelay={100}
          noRowsOverlayComponent={noRowsOverlayComponent}
          {...rest}
        />
      </StyledTableContainer>
    </CustomStyle>
  );
};

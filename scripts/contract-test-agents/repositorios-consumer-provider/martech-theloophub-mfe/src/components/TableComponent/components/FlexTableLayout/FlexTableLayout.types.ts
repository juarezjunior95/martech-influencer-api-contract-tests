import {
  HighlightStyle,
  RenderCellOptions,
  SortState,
  TableCellType,
  TableHeaderType,
} from '../../types';
import { FlatRow } from '../../utils';

export type FlexTableRowCell = TableCellType | string | number | boolean;
export type FlexTableRowData = Record<string, FlexTableRowCell>;
export type HighlightedItemKey = string | number;

/** Row grouping key from `rowGroup` cells (Sonar: avoid repeating `string | number | undefined`). */
export type RowGroupValue = string | number | undefined;

export type RenderBodyCellArgs = {
  readonly col: TableHeaderType;
  readonly rawCell: FlexTableRowCell;
  readonly row: FlexTableRowData;
  readonly globalIdx: number;
  readonly colGroupIdx: number;
  readonly gIdx: number;
  readonly cellWidth?: string;
  readonly disableHover?: boolean;
};

export interface FlexTableLayoutProps {
  readonly header: TableHeaderType[];
  readonly allRows: FlatRow[];
  readonly showAxis?: boolean;
  readonly axisClickable?: boolean;
  readonly axisWidth?: number | string;
  readonly hideEmptyAxisHeader?: boolean;
  readonly rowGroupLabel?: 'horizontal' | 'vertical';
  readonly hasSecondaryColumns?: boolean;
  readonly highlightedItems?: HighlightedItemKey[];
  readonly highlightField?: string;
  readonly highlightStyle?: HighlightStyle;
  readonly disableHighlightHover?: boolean;
  readonly groupBorder?: boolean;
  readonly columnBorder?: boolean;
  readonly headerOnlyColumnBorder?: boolean;
  readonly headerColumnGap?: boolean;
  readonly headerGap?: boolean;
  readonly zebraStriping?: boolean;
  readonly rowHover?: boolean;
  readonly rowBorder?: boolean;
  readonly columnHover?: boolean;
  readonly cellHover?: boolean;
  readonly hoverRowColumn?: boolean;
  readonly allowEmptyCellClick?: boolean;
  readonly useCustomHeaderTooltip?: boolean;
  readonly subHeaderFullCellTooltip?: boolean;
  readonly sortState?: SortState;
  readonly hoveredColumnId: string | null;
  readonly setHoveredColumnId: (id: string | null) => void;
  readonly dataTestId?: string;
  readonly onCellClick?: boolean;
  readonly onRowClick?: boolean;
  readonly hasPagination?: boolean;
  readonly handleSortClick: (columnId: string) => void;
  readonly getSortDirection: (
    columnId: string,
  ) => 'asc' | 'desc' | 'none' | undefined;
  readonly handleCellClick: (
    cell: TableCellType,
    columnId: string,
    columnTitle: string,
    rowData: FlexTableRowData,
    rowIndex: number,
    groupIndex: number,
  ) => void;
  readonly handleRowClick: (
    rowData: FlexTableRowData,
    rowIndex: number,
    groupIndex: number,
  ) => void;
  readonly renderCell: (
    cell: TableCellType,
    column: TableHeaderType,
    options?: RenderCellOptions,
  ) => React.ReactNode;
}

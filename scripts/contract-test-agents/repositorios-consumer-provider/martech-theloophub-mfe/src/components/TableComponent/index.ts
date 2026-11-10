export { DataTable } from './DataTable';

export type {
  DataTableProps,
  DataTableFooterProps,
  TableDataType,
  TableHeaderType,
  TableCellType,
  TableRowType,
  TableGroupType,
  BrandCellType,
  CellRendererProps,
  PaginationConfig,
  CellContentType,
  SortState,
  SortChangeEvent,
  CellClickEvent,
  RowClickEvent,
  CheckboxChangeEvent,
  CellContext,
  HighlightStyle,
} from './types';

export {
  TextCell,
  NumberCell,
  ImageCell,
  AxisCell,
  HeaderGridCell,
  CheckboxCell,
  IconCell,
} from './components/CellRenderers/index';

export {
  simpleTableMock,
  variationTableMock,
  dividedHeaderMock,
  groupedAxisMock,
  dividedColumnsMock,
  sixColumnGroupsMock,
  sortableTableMock,
  simpleAxisTableMock,
  cellTypesMock,
  interactiveCellsMock,
  alignmentMock,
  categoryHealthMock,
  categoryHealthWithLabelGroupMock,
  simplifiedCategoryHealthMock,
  audienceTargetingMock,
} from './__mocks__';

export { TableFooter } from './components/TableFooter';
export type { TableFooterProps } from './components/TableFooter';

export { Pagination } from './components/Pagination/Pagination';
export type { PaginationProps } from './components/Pagination/Pagination';

export {
  useDataTablePagination,
  type UseDataTablePaginationParams,
  type UseDataTablePaginationReturn,
} from './components/Pagination/hooks';

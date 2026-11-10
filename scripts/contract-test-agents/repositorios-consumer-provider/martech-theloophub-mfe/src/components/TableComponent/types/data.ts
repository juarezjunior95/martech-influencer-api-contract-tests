export interface BrandCellType {
  src: string;
  name: string;
  variation: string;
  variationMeasure: string;
  variationDirection: string;
  country?: string;
}

export type CellContentType =
  | 'axis'
  | 'header'
  | 'icon'
  | 'primaryText'
  | 'secondaryText'
  | 'primaryNumber'
  | 'secondaryNumber'
  | 'upNumber'
  | 'downNumber'
  | 'circleImageText';

export interface TableCellType {
  value?: string | number;
  cellId?: string;
  clickUrl?: string;
  secondaryValue?: string | number;
  secondaryUnitMeasure?: string;
  secondaryOnly?: boolean;
  layout?: 'inline' | 'stacked';
  prefix?: string;
  unitMeasure?: string;
  variationDirection?: 'up' | 'down' | 'neutral' | string;
  variationMeasure?: string;
  showArrow?: boolean;
  colorize?: boolean;
  iconVariationDirection?: 'up' | 'down' | 'neutral';
  brands?: BrandCellType[];
  img?: string;
  imgName?: string;
  imgShape?: 'circle' | 'square';
  imagePosition?: 'left' | 'top';
  icon?: string | React.ReactNode;
  iconSize?: 'small' | 'medium' | 'large';
  iconPosition?: 'left' | 'right';
  checkbox?: boolean;
  checkboxState?: 'checked' | 'unchecked' | 'indeterminate';
  disabled?: boolean;
  contentType?: CellContentType;
  dataTestId?: string;
  colSpan?: number;
  rowSpan?: number;
  isEmpty?: boolean;
  subtitle?: string;
  subtext?: string;
  aggregated?: boolean;
  last?: boolean;
  merge?: boolean;
  cellType?: 'tag' | 'barChart';
  barChartLabelPosition?: 'adjacent' | 'end';
  tagThresholds?: {
    upMin?: number;
    downMax?: number;
  };
  [key: string]: unknown;
}

export type EmptyTableRowType = {
  isEmpty: boolean;
};

export type TableRowType =
  | {
      [key: string]: TableCellType | string | number | boolean;
    }
  | EmptyTableRowType;

export type TableGroupType = TableRowType[];

export interface TableHeaderParams {
  type: string;
  data: unknown;
}

export interface TableHeaderType {
  id?: string;
  title: string;
  subtitle?: string;
  imgName?: string;
  dataTestId?: string;
  children?: TableHeaderType[];
  params?: TableHeaderParams;
  tooltipContent?: string;
  /** Optional bold title in the header `CustomTooltip` (with `tooltipContent` as body text). */
  tooltipTitle?: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  merge?: boolean;
  sortable?: boolean;
  color?: string;
}

export interface TableDataType {
  header: TableHeaderType[];
  rows: TableRowType[][];
  filtersOptions?: unknown[];
  splits?: string[][];
  mergeColumns?: string[];
}

export interface CellContext {
  cellId?: string;
  clickUrl?: string;
  rowLabel: string | number | null;
  rowLabelColumnId: string;
  rowLabelColumnTitle: string;
  columnLabel: string;
  columnId: string;
  headerGroupLabel?: string;
  headerGroupId?: string;
  cellValue: string | number | null;
  rowIndex: number;
  groupIndex: number;
  zone?: string | number | null;
  country?: string | number | null;
}

export interface CheckboxChangeEvent {
  rowIndex: number;
  columnId: string;
  checked: boolean;
  cell: TableCellType;
  context: CellContext;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
}

export interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

export interface SortChangeEvent {
  columnId: string;
  direction: 'asc' | 'desc' | 'none';
}

export interface CellClickEvent {
  cell: TableCellType;
  columnId: string;
  columnTitle: string;
  rowData: Record<string, TableCellType>;
  rowIndex: number;
  groupIndex: number;
  context: CellContext;
}

export interface RowClickEvent {
  rowData: Record<string, TableCellType>;
  rowIndex: number;
  groupIndex: number;
  context: CellContext;
}

export interface DataTableFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  visiblePages?: number[];
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  onPageChange: (page: number) => void;
  showQuantityIndicator?: boolean;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export interface HighlightStyle {
  backgroundColor?: string;
  borderLeft?: string;
}

export interface DataTableProps {
  data: TableDataType;
  zebraStriping?: boolean;
  showAxis?: boolean;
  axisClickable?: boolean;
  axisWidth?: string;
  hideEmptyAxisHeader?: boolean;
  rowGroupLabel?: 'horizontal' | 'vertical';
  hasSecondaryColumns?: boolean;
  tagThresholds?: {
    upMin?: number;
    downMax?: number;
  };
  highlightedItems?: (string | number)[];
  highlightField?: string;
  highlightStyle?: HighlightStyle;
  disableHighlightHover?: boolean;
  onCheckboxChange?: (event: CheckboxChangeEvent) => void;
  sortState?: SortState;
  onSortChange?: (event: SortChangeEvent) => void;
  onCellClick?: (event: CellClickEvent) => void;
  onRowClick?: (event: RowClickEvent) => void;
  rowHover?: boolean;
  rowBorder?: boolean;
  columnHover?: boolean;
  cellHover?: boolean;
  hoverRowColumn?: boolean;
  allowEmptyCellClick?: boolean;
  headerColumnGap?: boolean;
  groupBorder?: boolean;
  columnBorder?: boolean;
  headerOnlyColumnBorder?: boolean;
  sectionTitle?: string;
  sectionPosition?: 'top' | 'middle' | 'bottom' | 'standalone';
  showSectionHeader?: boolean;
  showSectionFooter?: boolean;
  pagination?: PaginationConfig;
  footer?: DataTableFooterProps;
  footerInfo?: string;
  headerGap?: boolean;

  useCustomHeaderTooltip?: boolean;
  subHeaderFullCellTooltip?: boolean;
  dataTestId?: string;
}

export interface CellRendererProps {
  cell: TableCellType;
  column: TableHeaderType;
  rowIndex?: number;
  onCheckboxChange?: (checked: boolean) => void;
  dataTestId?: string;
}

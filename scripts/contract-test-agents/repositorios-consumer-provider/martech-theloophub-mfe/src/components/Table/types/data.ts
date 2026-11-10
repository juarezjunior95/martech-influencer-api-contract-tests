import { FilterOption } from 'models/Filters';

export type TableChartType = 'single-bar' | 'waterfall' | 'standart-deviation';

export interface ChartDataType {
  data: number[] | string[];
  backgroundColor: string[];
  chartUnitMeasure?: string;
  secondaryBackgroundColor?: string[];
  labels?: string[];
  variation?: number | number[];
  variationColor?: string[];
  variationMeasure?: string;
  min?: number;
  max?: number;
  type?: TableChartType;
}

export type BrandCellType = {
  src: string;
  name: string;
  variation: string;
  variationMeasure: string;
  variationDirection: string;
  country?: string;
  country_src: string;
};

export interface ChartLegend {
  title?: string;
  values: {
    label: string;
    color: string;
  }[];
}

export interface TableCellType {
  value?: any;
  prefix?: string;
  unitMeasure?: string;
  chartData?: ChartDataType;
  chartLegend?: ChartLegend;
  variation?: number;
  variationDirection?: string;
  variationMeasure?: string;
  brands?: BrandCellType[];
  img?: string;
  imgName?: string;
  dataTestId?: string;
  colSpan?: number;
  isEmpty?: boolean;
  subtitle?: string;
  aggregated?: boolean;
  last?: boolean;
  [key: string]: any;
}

export type EmptyTableRowType = {
  isEmpty: boolean;
};

export type TableRowType =
  | {
      [key: string]: TableCellType;
    }
  | EmptyTableRowType;

export type TableGroupType = TableRowType[];

export interface TableHeaderType {
  id?: string;
  title: string;
  subtitle?: string;
  imgName?: string;
  dataTestId?: string;
  children?: TableHeaderType[];
  params?: TableHeaderParams;
  tooltip?: boolean;
}

export interface TableDataType {
  header: TableHeaderType[];
  rows: TableRowType[][];
  filtersOptions?: FilterOption[];
  splits?: string[][];
  empty?: boolean;
}

interface TableHeaderParams {
  type: string;
  data: any;
}

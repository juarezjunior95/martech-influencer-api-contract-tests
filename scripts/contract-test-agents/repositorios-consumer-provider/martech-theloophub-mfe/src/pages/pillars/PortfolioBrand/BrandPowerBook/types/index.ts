import { SimpleBarChartData } from 'components/Chart';
import { TableDataType } from 'components/Table/types';

export interface Legend {
  label: string;
  color: string;
}

export interface PerformanceTrend extends SimpleBarChartData {
  legend?: Legend[];
}

export interface TablePerformance {
  table: TableDataType;
  legend: Legend[];
}

export interface Details {
  details: TableDataType;
  legend: Legend[];
}

import { TableDataType } from 'components/Table/types';

import {
  BarChartKpiData,
  BigNumbersKpiData,
  LineChartKpiData,
} from '../../../types';

export interface BrandsSlideData {
  bigNumbersKpiData: BigNumbersKpiData[];
  lineChartKpiData: LineChartKpiData;
  barChartKpiData: BarChartKpiData;
  marketsTableKpiData: TableDataType;
}

export interface BrandsSlideProps {
  loading?: boolean;
  error?: Error;
  data: BrandsSlideData;
  lineChartHeight?: number;
  tableHeight?: number;
  marketsTableHeaderHeight?: number;
  dataTestId?: string;
}

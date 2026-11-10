import { TableDataType } from 'components/Table/types';
import {
  BigNumbersKpiData,
  LineChartKpiData,
} from 'pages/pillars/ValueCreation/VolumePages/types';

export type SlideTableId = 'priorities' | 'portfolio' | 'markets';

export interface SlideContentData {
  bigNumbersKpiData: BigNumbersKpiData[];
  lineChartKpiData: LineChartKpiData;
  portfolioTableKpiData: TableDataType;
  prioritiesTableKpiData: TableDataType;
  marketsTableKpiData: TableDataType;
}

export interface SlideContentProps {
  loading?: boolean;
  error?: Error;
  data: SlideContentData;
  tableOrder?: SlideTableId[];
  tableHeight?: number;
  lineChartHeight?: number;
  adaptiveLayout?: boolean;
  prioritiesTableHeaderHeight?: number;
  prioritiesTableHeaderHeightMock?: number;
  portfolioTableHeaderHeight?: number;
  marketsTableHeaderHeight?: number;
  dataTestId?: string;
}

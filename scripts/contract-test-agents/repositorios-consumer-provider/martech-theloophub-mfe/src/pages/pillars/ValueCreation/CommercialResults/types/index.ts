import { BigNumberData } from 'components/BigNumber/types';
import { FilterForm } from 'models';

import {
  BarChartData,
  LineChartData,
  WaterfallData,
} from '../../PerformanceTool/types';

export interface BigNumberHeader {
  title: string;
  measure?: string;
}

export interface CommercialResultsBigNumbersSectionData {
  header: BigNumberHeader;
  data: BigNumberData[];
}

export interface CommercialResultsConfig {
  kpiGroup: string;
  periodValues: readonly string[];
  measure: string;
  driversTitle: string;
}

export interface UseBigNumberData {
  title: string;
  selectedBigNumberIndex: number;
  handleBigNumbersSelect: (index: number) => void;
  bigNumbersData: CommercialResultsBigNumbersSectionData[];
  loading: boolean;
  error: Error | null;
}

export interface UseWaterfallData {
  title: string;
  waterfallData: WaterfallData;
  loading: boolean;
  error: Error | null;
  isViewByDisabled: boolean;
  contextKey: string;
  handleViewByChange: (value: string) => void;
  handleBarClick: (index: number | null) => void;
}

export interface LegendItem {
  label: string;
  color?: string;
}
export interface UseKpiDrillDownData {
  applied: FilterForm;
  performanceInfo: {
    performanceSection: string;
    tooltip: string;
  };
  config: CommercialResultsConfig;
  bigNumbersData: UseBigNumberData;
  waterfallData: UseWaterfallData;
  lineBarChartData: UseLineBarChartData;
}
export interface LineBarChartsSectionData {
  empty?: boolean;
  legend?: LegendItem[];
  lineChart: LineChartData;
  barChart: BarChartData;
}

export interface UseLineBarChartData {
  title: string;
  subtitle: {
    prefix: string;
    value: string;
  };
  data: LineBarChartsSectionData;
  loading: boolean;
  error: Error | null;
  showLineDataLabels: boolean;
}

export interface SkeletonProps {
  height: string;
  width: string;
  length: number;
  borderRadius: 'small' | 'medium' | 'large';
}

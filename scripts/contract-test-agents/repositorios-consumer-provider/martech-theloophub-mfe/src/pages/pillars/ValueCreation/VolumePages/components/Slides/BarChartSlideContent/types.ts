import { SkeletonProps } from 'components';

import { BarChartKpiData } from '../../../types';

export interface BarChartSlideContentData {
  barChartYtdKpiData: BarChartKpiData;
  barChartMtdKpiData: BarChartKpiData;
}

export interface BarChartSlideContentProps {
  data: BarChartSlideContentData;
  error?: any;
  loading?: boolean;
  chartHeight?: string;
  centerZeroLine?: boolean;
  skeletonProps?: SkeletonProps;
  dataTestId?: string;
}

import { BarChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

export interface TopBottomBarChartSlideContentData {
  topKpiData?: BarChartKpiData;
  bottomKpiData?: BarChartKpiData;
}

export interface TopBottomBarChartSlideContentProps {
  loading?: boolean;
  error?: Error | null;
  data: TopBottomBarChartSlideContentData;
  chartHeight?: string;
  dataTestId?: string;
}

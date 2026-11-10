import { WaterfallChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

export interface TopBottomWaterfallSlideContentData {
  topKpiData?: WaterfallChartKpiData;
  bottomKpiData?: WaterfallChartKpiData;
  topBrandsKpiData?: WaterfallChartKpiData;
  bottomBrandsKpiData?: WaterfallChartKpiData;
}

export interface TopBottomWaterfallSlideContentProps {
  loading?: boolean;
  error?: Error;
  data: TopBottomWaterfallSlideContentData;
  chartHeight?: string;
  dataTestId?: string;
}

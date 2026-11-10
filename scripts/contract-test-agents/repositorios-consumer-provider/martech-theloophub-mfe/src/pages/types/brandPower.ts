import { SimpleBarChartData } from 'components/Chart';
import { VariationCaptionData } from 'components/VariationCaption/types';
import { Legend } from 'pages/pillars/PortfolioBrand/BrandPowerBook/types';

interface VariationCaption {
  variationCaptions?: VariationCaptionData[];
}

export type PerformanceTrendChart = SimpleBarChartData & {
  empty?: boolean;
} & VariationCaption;

export interface PerformanceTrend {
  trendOverTime: PerformanceTrendChart;
  yearPowerVsAc: PerformanceTrendChart & { legend: Legend[] };
  legend: Legend[];
}

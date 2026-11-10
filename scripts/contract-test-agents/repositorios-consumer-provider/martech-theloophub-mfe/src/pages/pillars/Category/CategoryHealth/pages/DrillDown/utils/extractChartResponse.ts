import { ShareOfThroatData } from '../components';
import type { DriversData } from '../components/Drivers/Drivers';
import type { LineChartPerformanceData } from '../components/LineChartPerformance/LineChartPerformance';

export interface ExtractedChartResponse {
  lineChartData: LineChartPerformanceData | undefined;
  driversData: DriversData | undefined;
  stackedAreaChartData: ShareOfThroatData | undefined;
}

const RESPONSE_KEY = 'category-health_drill-down-line-chart-drill';

export function extractChartResponse(
  data: Record<string, unknown> | null | undefined,
): ExtractedChartResponse {
  if (!data)
    return {
      lineChartData: undefined,
      driversData: undefined,
      stackedAreaChartData: undefined,
    };

  const container = data[RESPONSE_KEY];
  if (!container || typeof container !== 'object') {
    return {
      lineChartData: undefined,
      driversData: undefined,
      stackedAreaChartData: undefined,
    };
  }

  const entries = Object.entries(container as Record<string, unknown>);
  let lineChartData: LineChartPerformanceData | undefined;
  let driversData: DriversData | undefined;
  let stackedAreaChartData: ShareOfThroatData | undefined;

  for (const [key, value] of entries) {
    if (key === 'drivers') driversData = value as DriversData;
    else if (key === 'shareOfThroat')
      stackedAreaChartData = value as ShareOfThroatData;
    else lineChartData = value as LineChartPerformanceData;
  }

  return { lineChartData, driversData, stackedAreaChartData };
}

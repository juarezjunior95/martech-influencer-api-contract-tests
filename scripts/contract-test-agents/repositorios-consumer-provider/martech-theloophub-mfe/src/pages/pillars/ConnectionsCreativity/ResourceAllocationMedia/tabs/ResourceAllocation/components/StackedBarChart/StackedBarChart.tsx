import { Bar } from 'react-chartjs-2';

import { BorderRadius } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { emptyBarOverlay, StripedBackground } from 'components/Chart/plugins';
import { totalAllocationDatalabel } from 'components/Chart/plugins/TotalAllocation/TotalAllocation';

import { StackedChart } from '../../types';
import { generateChartData, generateChartOptions } from './config';
import { DEFAULT_BORDER_RADIUS } from './constants';
import { applyRoundingToDatasets } from './utils';

export interface StackedBarChartProps {
  chart: StackedChart;
  borderRadius?: BorderRadius[][] | BorderRadius[] | BorderRadius;
  backgroundColor: string[] | string[][];
  roundTo?: number;
  minBarLength?: number;
  dataTestId?: string;
}

export const StackedBarChart = ({
  chart,
  borderRadius = DEFAULT_BORDER_RADIUS,
  backgroundColor,
  roundTo,
  minBarLength,
  dataTestId,
}: StackedBarChartProps) => {
  const { total_allocation, emptyIndices } = chart;

  const data = generateChartData(
    chart,
    backgroundColor,
    borderRadius,
    minBarLength,
  );
  const options = generateChartOptions(total_allocation, emptyIndices);

  if (roundTo !== undefined) {
    applyRoundingToDatasets(data, roundTo);
    const valueAxis = options.scales?.x;
    if (valueAxis) {
      valueAxis.max = roundTo;
      valueAxis.min = 0;
    }
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar
        data-testid={dataTestId ? `${dataTestId}-stacked-bar-chart` : undefined}
        data={data}
        options={options}
        plugins={[
          StripedBackground,
          ChartDataLabels,
          totalAllocationDatalabel,
          emptyBarOverlay,
        ]}
      />
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { Bubble } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { VariationCaption } from 'components';

import { ChartBottom, ChartContainer } from './BubbleChart.styles';
import { Label } from './components/Label/Label';
import { getChartOptions } from './configs/chartOptions';
import { getPlugins } from './configs/plugins';
import { clearTooltip } from './constants';
import { BubbleChartData } from './types';
import { generateDatasets } from './utils/utils';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface Props {
  data: BubbleChartData;
  dataTestId?: string;
}

export const BubbleChart: React.FC<Props> = ({ data, dataTestId }) => {
  const chartRef = useRef<ChartJS<'bubble'>>(null);

  useEffect(() => {
    const canvas = chartRef.current?.canvas;
    if (!canvas) return;

    const handleMouseLeave = () => {
      clearTooltip();
      chartRef.current?.update();
    };

    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => canvas.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const chartData = {
    datasets: generateDatasets(data),
  };

  return (
    <ChartContainer data-testid={dataTestId}>
      <Bubble
        ref={chartRef}
        data={chartData}
        options={getChartOptions(data)}
        plugins={getPlugins(data)}
      />

      <ChartBottom style={{ paddingLeft: data.yAxis.max >= 100 ? '7px' : '0' }}>
        <Label labels={data.label} />
        <VariationCaption
          variationCaptionData={[data.caption]}
          gridColumnsCount={data.datasets.length}
          paddingLeft={37}
          paddingRight={8}
          dividerPaddingRight={10}
        />
      </ChartBottom>
    </ChartContainer>
  );
};

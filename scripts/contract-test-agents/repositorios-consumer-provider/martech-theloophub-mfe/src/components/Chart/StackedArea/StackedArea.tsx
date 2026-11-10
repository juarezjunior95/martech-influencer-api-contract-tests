import { useEffect } from 'react';

import { BaseChart } from 'components/Chart/BaseChart';

import { getStackedAreaOptions, removeStackedAreaTooltip } from './configs';
import {
  useCellVisibility,
  useContainerSize,
  useResponsiveConfig,
} from './hooks';
import { getStackedAreaPlugins } from './plugins';
import type { StackedAreaProps } from './types';
import { transformToChartData } from './utils';

export const StackedArea: React.FC<StackedAreaProps> = ({
  data,
  size = 'medium',
  height = 500,
}) => {
  const chartHeight = typeof height === 'number' ? height : 500;
  const { ref, width: containerWidth } = useContainerSize();
  const config = useResponsiveConfig(
    size,
    containerWidth,
    data.columns.length,
    data.legends?.length ?? 0,
  );
  const columnsWithVisibility = useCellVisibility(data.columns, chartHeight);

  const datasets = transformToChartData(
    columnsWithVisibility,
    data.colors,
    data.legends,
    config,
  );
  const labels = data.columns.map((col) => col.label);
  const options = getStackedAreaOptions(config);
  const plugins = getStackedAreaPlugins(data, config);

  useEffect(() => {
    return () => removeStackedAreaTooltip();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: `${chartHeight}px`,
      }}
    >
      <BaseChart
        type="bar"
        datasets={datasets}
        labels={labels}
        options={options}
        plugins={plugins}
      />
    </div>
  );
};

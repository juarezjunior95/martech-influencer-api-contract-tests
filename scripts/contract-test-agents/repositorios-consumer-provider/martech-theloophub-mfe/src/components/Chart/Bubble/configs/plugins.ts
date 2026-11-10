import { COLUMN_WIDTH, getHoveredColumn } from '../constants';
import { createColumnHoverPlugin, createDividerPlugin } from '../plugins';
import { BubbleChartData } from '../types';
import { createBackgroundPlugin } from './../../plugins';

export function getPlugins(data: BubbleChartData) {
  const columnsCount = data.datasets.length;

  return [
    createBackgroundPlugin({
      sections: data.backgroundChart.backgrounds,
      useColumnDivision: true,
      columnWidth: COLUMN_WIDTH,
      getHoveredColumn,
    }),
    createDividerPlugin(columnsCount),
    createColumnHoverPlugin(columnsCount),
  ];
}

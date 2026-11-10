import { Plugin } from 'chart.js';

import {
  COLUMN_WIDTH,
  getHoveredColumn,
  isInCooldown,
  setHoveredColumn,
} from '../constants';

export function createColumnHoverPlugin(
  columnsCount: number,
  onHoverChange?: (colIndex: number | null) => void,
): Plugin<'bubble'> {
  return {
    id: 'hoverPlugin',
    beforeEvent(chart, args) {
      const event = args.event;
      const xScale = chart.scales.x;

      if (!xScale || event.type !== 'mousemove' || isInCooldown()) return;

      const xValue = xScale.getValueForPixel(event.x);
      const colIndex = Math.floor(xValue / COLUMN_WIDTH);

      const isWithinBounds = colIndex >= 0 && colIndex < columnsCount;
      const isNewColumn = getHoveredColumn() !== colIndex;

      if (isWithinBounds && isNewColumn) {
        setHoveredColumn(colIndex);
        chart.update();
        onHoverChange?.(colIndex);
      }
    },
  };
}

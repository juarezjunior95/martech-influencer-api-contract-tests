import { ChartArea } from 'chart.js';
import { formatNumber } from 'utils/format';

import { drawArrow } from './utils/drawArrow';
import { drawRoundedRect } from './utils/drawRoundedRect';

export type ChartContext = CanvasRenderingContext2D;

export const ConnectorPlugin = {
  id: 'connectorPlugin',
  afterDatasetsDraw(chart) {
    try {
      const {
        ctx,
        chartArea,
        config: { options },
      }: {
        ctx: ChartContext;
        chartArea: ChartArea;
        config: { options };
      } = chart;

      const dataset = chart.getDatasetMeta(0);
      const data = dataset.data;

      if (!data.length) return;

      const connectorPluginData = options?.plugins?.connector;

      if (!connectorPluginData) return;

      const { value, from, to, backgroundColor, textColor, measure, prefix } =
        connectorPluginData;

      if (value == undefined || from == undefined || to == undefined) return;

      const firstBarIndex =
        chart.data.labels.includes(from) === -1
          ? from
          : chart.data.labels.indexOf(from);
      const lastBarIndex =
        chart.data.labels.includes(to) === -1
          ? to
          : chart.data.labels.indexOf(to);

      const { top } = chartArea;

      const firstBar = data[firstBarIndex];
      const lastBar = data[lastBarIndex];

      const yScale = chart.scales.y;
      const min = yScale?.min;
      const axisLineY =
        yScale && typeof yScale.getPixelForValue === 'function'
          ? yScale.getPixelForValue(min)
          : chartArea.bottom;

      const midX = (lastBar.x + firstBar.x) / 2;
      const midY = top;
      const offset = 30;
      const arcRadius = 10;

      ctx.save();

      drawArrow({
        ctx,
        firstBar,
        lastBar,
        axisLineY,
        midY,
        arcRadius,
        offset,
      });

      const label = formatNumber(+value) + (measure ?? '');
      const hasPrefix = Boolean(prefix);
      const boxWidth = hasPrefix ? 100 : 54;

      drawRoundedRect({
        ctx,
        x: midX - boxWidth / 2,
        y: midY - 65,
        width: boxWidth,
        height: 24,
        radius: 4,
        label,
        textColor,
        backgroundColor,
        prefix,
      });

      ctx.restore();
    } catch (error) {
      console.error('Error in connectorPlugin:', error, {
        chart,
        connectorPluginData: chart.config.options?.plugins?.connector,
      });
    }
  },
};

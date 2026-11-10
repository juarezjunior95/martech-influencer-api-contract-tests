import { ChartData, Chart as ChartJS } from 'chart.js';

type DatasetWithBaseChartColors = {
  baseChartColors?: string[];
};

export const BaseChartColors = {
  id: 'baseChartColors',
  afterDatasetsDraw(chart: ChartJS) {
    const { ctx, scales, data } = chart;
    const datasets = data.datasets as (ChartData<'bar'>['datasets'][0] &
      DatasetWithBaseChartColors)[];
    const colors = datasets[0]?.baseChartColors || [];
    const lineWidth = 6;
    const offsetLeft = 4;
    const offsetRight = 4;

    if (!colors.length || !scales.x || !scales.y) return;

    const yScale = scales.y;
    const dataset = chart.getDatasetMeta(0);

    if (!dataset?.data) return;

    ctx.save();
    ctx.lineWidth = lineWidth;

    const isWaterfall = Array.isArray(datasets[0]?.data?.[0]);

    const baseY = isWaterfall ? yScale.bottom : yScale.bottom + lineWidth / 2;
    const chartLeft = chart.chartArea.left + offsetLeft;
    const chartRight = chart.chartArea.right - offsetRight;
    const totalWidth = chartRight - chartLeft;

    const categoryWidth = totalWidth / dataset.data.length;

    const positions = dataset.data
      .map((element: { x: number; width?: number }, index: number) => ({
        x: element.x,
        width: categoryWidth,
        color: colors[index],
        index,
      }))
      .filter((item) => item.color)
      .sort((a, b) => a.x - b.x);

    if (positions.length === 0) {
      ctx.restore();
      return;
    }

    let currentX = chartLeft;

    for (let i = 0; i < positions.length; i++) {
      const current = positions[i];
      const barCenter = current.x;

      let segmentEnd;
      if (i === positions.length - 1) {
        segmentEnd = chartRight;
      } else {
        const nextBar = positions[i + 1];
        segmentEnd = (barCenter + nextBar.x) / 2;
      }

      ctx.strokeStyle = current.color;
      ctx.beginPath();
      ctx.moveTo(currentX, baseY);
      ctx.lineTo(segmentEnd, baseY);
      ctx.stroke();

      currentX = segmentEnd;
    }

    ctx.restore();
  },
};

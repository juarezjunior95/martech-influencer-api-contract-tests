export interface CustomGridProps {
  display?: boolean;
  color?: string;
  width?: number;
}

const defaultConfig: CustomGridProps = {
  display: true,
  color: '#E4E7EA',
  width: 1,
};

export const CustomGrid = {
  id: 'customGrid',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const xAxis = chart.scales['x'];
    const yAxis = chart.scales['y'];
    const indexAxis = chart.config.options.indexAxis;

    const config: CustomGridProps =
      chart.config.options.plugins.customGrid || {};

    if (config?.display === false) return;

    if (!xAxis || !yAxis) return;

    ctx.save();
    ctx.strokeStyle = config.color || defaultConfig.color;
    ctx.lineWidth = config.width || defaultConfig.width;

    if (indexAxis === 'x') {
      yAxis.ticks.forEach((tick, i) => {
        const y = yAxis.getPixelForTick(i);
        ctx.beginPath();
        ctx.moveTo(xAxis.left, y);
        ctx.lineTo(chart.width, y);
        ctx.stroke();
      });
    }

    if (indexAxis === 'y') {
      xAxis.ticks.forEach((tick, i) => {
        const x = xAxis.getPixelForTick(i);
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.stroke();
      });
    }

    ctx.restore();
  },
};

import { BarElement } from 'chart.js/dist';

interface Position {
  x: number;
  y: number;
  color: string;
  textAlign: CanvasTextAlign;
}
const MIN_WIDTH = 40;
const OFFSET_X = 10;
const OFFSET_Y = 5;
const OFFSET_Y_SMALL = 10;

export const dynamicDatalabelsPlugin = {
  id: 'dynamicDatalabels',

  afterDatasetsDraw(chart) {
    const { ctx, scales } = chart;
    try {
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          if (!bar) return;
          const value = dataset.data[index];
          const formattedData = dataset.formattedData?.[index];
          const position = getLabelPosition(bar, scales);
          drawLabel(ctx, formattedData || value, position);
        });
      });
    } catch (error) {
      console.error('Error drawing data labels:', error);
    }
  },
};

function getLabelPosition(bar: BarElement, scales): Position {
  const { x, y, base, height, width, horizontal } = bar.getProps(
    ['x', 'y', 'base', 'height', 'width', 'horizontal'],
    true,
  );
  if (horizontal) {
    return {
      x:
        width > MIN_WIDTH
          ? (x + base) / 2
          : scales.x.getPixelForValue(0) + width + OFFSET_X,
      y: y + OFFSET_Y,
      color: '#141414',
      textAlign: width > MIN_WIDTH ? 'center' : 'left',
    };
  } else {
    return {
      x,
      y: height > MIN_WIDTH ? (y + base) / 2 : y - OFFSET_Y_SMALL,
      color: '#141414',
      textAlign: height > MIN_WIDTH ? 'center' : 'left',
    };
  }
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  position: Position,
) {
  ctx.save();
  ctx.font = '12px Work Sans';
  ctx.textAlign = position.textAlign;
  ctx.fillStyle = position.color;
  ctx.fillText(text, position.x, position.y);
  ctx.restore();
}

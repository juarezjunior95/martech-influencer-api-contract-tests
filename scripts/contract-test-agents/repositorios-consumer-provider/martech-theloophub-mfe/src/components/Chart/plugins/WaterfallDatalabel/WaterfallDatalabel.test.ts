import { Chart, Plugin } from 'chart.js';

import { WaterfallDatalabel } from './WaterfallDatalabel';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn().mockReturnValue({ width: 50 }),
    font: '',
    textAlign: '',
    textBaseline: '',
    fillStyle: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (ctx: CanvasRenderingContext2D): Chart<'bar'> =>
  ({
    ctx,
    config: {
      options: {
        plugins: {
          waterfallDatalabel: {
            display: true,
            datalabels: ['100', '-200', '300', '-400'],
            indexes: {
              first: 0,
              last: 3,
              retained: 2,
            },
            font: "normal 12px 'Work Sans', sans-serif",
            textAlign: 'center',
            textBaseline: 'middle',
            color: {
              inside: '#ffffff',
              outside: '#000000',
              retained: '#ff0000',
            },
          },
        },
        scales: {
          x: { min: 0, max: 100 },
        },
      },
    },
    data: {
      datasets: [
        {
          data: [
            [0, 10],
            [10, 20],
            [20, 30],
            [30, 40],
          ],
        },
      ],
    },
    getDatasetMeta: jest.fn(() => ({
      type: 'bar',
      data: [
        { x: 10, y: 50, base: 40, width: 70, height: 10 },
        { x: 20, y: 40, base: 30, width: 60, height: 10 },
        { x: 30, y: 30, base: 20, width: 50, height: 10 },
        { x: 40, y: 20, base: 10, width: 40, height: 10 },
      ],
    })),
    scales: {
      x: {
        getPixelForValue: jest.fn((value) => value * 10),
      },
      y: {
        getPixelForValue: jest.fn((value) => value * 10),
      },
    },
  }) as unknown as Chart<'bar'>;

describe('WaterfallDatalabel Plugin', () => {
  let plugin: Plugin<'bar'>;
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart<'bar'>;

  beforeEach(() => {
    mockCtx = createMockCtx();
    mockChart = createMockChart(mockCtx);
    jest.clearAllMocks();
    plugin = WaterfallDatalabel;
  });

  it('should draw data labels on bars', () => {
    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillText).toHaveBeenCalledTimes(4);
  });

  it('should not draw when display is false', () => {
    mockChart.config.options.plugins.waterfallDatalabel.display = false;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('should not draw when meta type is not bar', () => {
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'line',
      controller: {} as any,
      order: 0,
      label: '',
      index: 0,
      data: [],
      dataset: {} as any,
      hidden: false,
      stack: 0,
      xAxisID: '',
      yAxisID: '',
      _stacked: false,
      _parsed: [],
      _sorted: false,
      visible: true,
      indexAxis: 'x',
      iAxisID: '',
      vAxisID: '',
    })) as any;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('should draw the correct color for retained bar when is text is bigger than the bar', () => {
    mockChart.config.options.plugins.waterfallDatalabel.indexes = {
      first: 0,
      last: 3,
      retained: 1,
    };

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });
});

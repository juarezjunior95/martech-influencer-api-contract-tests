import { Chart, ChartMeta, Plugin } from 'chart.js';

import { ConnectBars } from './ConnectBars';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    measureText: jest.fn().mockReturnValue({
      width: 50,
      actualBoundingBoxAscent: 10,
      actualBoundingBoxDescent: 5,
    }),
    font: '',
    textBaseline: '',
    fillStyle: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (ctx: CanvasRenderingContext2D): Chart<'bar'> =>
  ({
    ctx,
    config: {
      options: {
        plugins: {
          connectBars: {
            display: true,
            color: '#d9d9d9',
            indexes: {
              first: 0,
              last: 1,
              retained: 2,
              variation: 3,
            },
          },
        },
        indexAxis: 'y',
      },
    },
    data: {
      datasets: [
        {
          data: [
            [0, 1],
            [1, 2],
            [2, -3],
            [-3, 4],
          ],
          backgroundColor: ['#000', '#fff'],
        },
      ],
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    },
    getDatasetMeta: jest.fn(() => ({
      type: 'bar',
      data: [
        {
          x: 10,
          y: 20,
          base: 30,
          width: 50,
          height: 100,
          backgroundColor: '#000',
        },
        {
          x: 15,
          y: 25,
          base: 35,
          width: 60,
          height: 90,
          backgroundColor: '#fff',
        },
        {
          x: 25,
          y: 30,
          base: 35,
          width: 60,
          height: 90,
          backgroundColor: '#fff',
        },
        {
          x: 35,
          y: 35,
          base: 35,
          width: 60,
          height: 90,
          backgroundColor: '#fff',
        },
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

describe('ConnectBars Plugin', () => {
  let plugin: Plugin<'bar'>;
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart<'bar'>;

  beforeEach(() => {
    mockCtx = createMockCtx();
    mockChart = createMockChart(mockCtx);
    jest.clearAllMocks();
    plugin = ConnectBars;
  });

  it('should draw connecting lines between bars', () => {
    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledTimes(3);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(3);
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should not draw when display is false', () => {
    mockChart.config.options.plugins.connectBars.display = false;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
    expect(mockCtx.moveTo).not.toHaveBeenCalled();
    expect(mockCtx.lineTo).not.toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should not draw when type is not bar', () => {
    mockChart.config.options.plugins.connectBars.display = true;
    mockChart.getDatasetMeta = jest.fn(
      () =>
        ({
          type: 'line',
        }) as unknown as ChartMeta,
    );

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
    expect(mockCtx.moveTo).not.toHaveBeenCalled();
    expect(mockCtx.lineTo).not.toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should not draw when dont pass de options', () => {
    delete mockChart.config.options?.plugins.connectBars;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.beginPath).not.toHaveBeenCalled();
    expect(mockCtx.moveTo).not.toHaveBeenCalled();
    expect(mockCtx.lineTo).not.toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('should draw when dont pass the indexAxis', () => {
    delete mockChart.config.options.indexAxis;

    plugin.afterDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });
});

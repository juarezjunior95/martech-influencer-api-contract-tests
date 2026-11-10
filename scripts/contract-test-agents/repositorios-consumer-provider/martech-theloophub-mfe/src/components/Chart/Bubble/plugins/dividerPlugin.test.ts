import { Chart } from 'chart.js';

import { COLUMN_WIDTH } from '../constants';
import { createDividerPlugin } from './dividerPlugin';

jest.mock('../constants', () => ({
  COLUMN_WIDTH: 100,
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    setLineDash: jest.fn(),
    strokeStyle: '',
    lineWidth: 0,
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (ctx: CanvasRenderingContext2D): Chart<'bubble'> =>
  ({
    ctx,
    chartArea: {
      top: 50,
      bottom: 550,
      left: 50,
      right: 750,
    },
    scales: {
      x: {
        getPixelForValue: jest.fn((value) => 50 + value * 7),
      },
      y: {
        getPixelForValue: jest.fn((value) => 500 - value * 5),
      },
    },
  }) as unknown as Chart<'bubble'>;

describe('createDividerPlugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart<'bubble'>;

  beforeEach(() => {
    mockCtx = createMockCtx();
    mockChart = createMockChart(mockCtx);
    jest.clearAllMocks();
  });

  it('creates plugin with correct id', () => {
    const plugin = createDividerPlugin(5);

    expect(plugin.id).toBe('columnDividers');
  });

  it('draws divider lines for specified columns', () => {
    const plugin = createDividerPlugin(5);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.beginPath).toHaveBeenCalledTimes(4);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(4);
  });

  it('applies correct line styles', () => {
    const plugin = createDividerPlugin(3);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.strokeStyle).toBe('rgba(20, 20, 20, 0.12)');
    expect(mockCtx.lineWidth).toBe(1);
    expect(mockCtx.setLineDash).toHaveBeenCalledWith([4, 4]);
  });

  it('draws vertical lines from top to bottom', () => {
    const plugin = createDividerPlugin(3);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    const { top, bottom } = mockChart.chartArea;

    expect(mockCtx.moveTo).toHaveBeenCalledWith(expect.any(Number), top);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(expect.any(Number), bottom);
  });

  it('calculates correct x positions based on COLUMN_WIDTH', () => {
    const plugin = createDividerPlugin(3);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockChart.scales.x.getPixelForValue).toHaveBeenCalledWith(100);
    expect(mockChart.scales.x.getPixelForValue).toHaveBeenCalledWith(200);
  });

  it('does not draw dividers when columnsCount is 1', () => {
    const plugin = createDividerPlugin(1);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });

  it('does not draw dividers when columnsCount is 0', () => {
    const plugin = createDividerPlugin(0);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('draws correct number of dividers for large column count', () => {
    const plugin = createDividerPlugin(10);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.beginPath).toHaveBeenCalledTimes(9);
  });

  it('saves and restores canvas context', () => {
    const plugin = createDividerPlugin(5);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('draws dashed lines', () => {
    const plugin = createDividerPlugin(3);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.setLineDash).toHaveBeenCalledWith([4, 4]);
  });

  it('starts drawing from column 1 (skips column 0)', () => {
    const plugin = createDividerPlugin(4);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    const getPixelCalls = (mockChart.scales.x.getPixelForValue as jest.Mock)
      .mock.calls;
    const firstCallValue = getPixelCalls[0][0];
    expect(firstCallValue).toBe(COLUMN_WIDTH);
  });

  it('spaces dividers evenly based on COLUMN_WIDTH', () => {
    const plugin = createDividerPlugin(4);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockChart.scales.x.getPixelForValue).toHaveBeenCalledWith(100);
    expect(mockChart.scales.x.getPixelForValue).toHaveBeenCalledWith(200);
    expect(mockChart.scales.x.getPixelForValue).toHaveBeenCalledWith(300);
  });

  it('calls beginPath before each line', () => {
    const plugin = createDividerPlugin(3);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.beginPath).toHaveBeenCalledTimes(2);
  });

  it('calls moveTo and lineTo for each divider', () => {
    const plugin = createDividerPlugin(3);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    expect(mockCtx.moveTo).toHaveBeenCalledTimes(2);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(2);
  });

  it('draws lines at correct pixel positions', () => {
    const plugin = createDividerPlugin(2);

    plugin.beforeDraw(mockChart, { cancelable: true }, {});

    const expectedPixel = 50 + 100 * 7;

    expect(mockCtx.moveTo).toHaveBeenCalledWith(expectedPixel, 50);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(expectedPixel, 550);
  });
});

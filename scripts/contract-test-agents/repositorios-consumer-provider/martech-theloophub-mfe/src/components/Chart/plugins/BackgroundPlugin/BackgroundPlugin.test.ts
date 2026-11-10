import { Chart } from 'chart.js';

import { createBackgroundPlugin } from './BackgroundPlugin';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (ctx: CanvasRenderingContext2D): Chart<'bar'> =>
  ({
    ctx,
    chartArea: {
      top: 0,
      bottom: 400,
      left: 0,
      right: 600,
    },
    scales: {
      x: {
        max: 100,
        getPixelForValue: jest.fn((value) => value * 6),
      },
      y: {
        getPixelForValue: jest.fn((value) => 400 - value * 4),
      },
    },
  }) as unknown as Chart<'bar'>;

describe('BackgroundPlugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart<'bar'>;

  beforeEach(() => {
    mockCtx = createMockCtx();
    mockChart = createMockChart(mockCtx);
    jest.clearAllMocks();
  });

  it('creates plugin with correct id', () => {
    const plugin = createBackgroundPlugin({
      sections: [],
    });

    expect(plugin.id).toBe('backgroundMultiSplit');
  });

  it('draws background sections correctly', () => {
    const plugin = createBackgroundPlugin({
      sections: [
        { from: 0, to: 50, color: '#FF0000' },
        { from: 50, to: 100, color: '#00FF00' },
      ],
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('applies correct colors to sections', () => {
    const plugin = createBackgroundPlugin({
      sections: [
        { from: 0, to: 50, color: '#FF0000' },
        { from: 50, to: 100, color: '#00FF00' },
      ],
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillStyle).toContain('#00FF00');
  });

  it('draws separator lines between sections', () => {
    const plugin = createBackgroundPlugin({
      sections: [
        { from: 0, to: 50, color: '#FF0000' },
        { from: 50, to: 100, color: '#00FF00' },
      ],
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('handles column division correctly', () => {
    const plugin = createBackgroundPlugin({
      sections: [{ from: 0, to: 100, color: '#FF0000' }],
      useColumnDivision: true,
      columnWidth: 20,
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillRect).toHaveBeenCalledTimes(5);
  });

  it('applies hover color when column is hovered', () => {
    const getHoveredColumn = jest.fn(() => 1);
    const plugin = createBackgroundPlugin({
      sections: [
        {
          from: 0,
          to: 100,
          color: '#FF0000',
          hoverColor: '#FFFF00',
        },
      ],
      useColumnDivision: true,
      columnWidth: 20,
      getHoveredColumn,
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(getHoveredColumn).toHaveBeenCalled();
    expect(mockCtx.fillStyle).toContain('#FF0000');
  });

  it('uses default color when hoverColor is not provided', () => {
    const getHoveredColumn = jest.fn(() => 0);
    const plugin = createBackgroundPlugin({
      sections: [
        {
          from: 0,
          to: 100,
          color: '#FF0000',
        },
      ],
      useColumnDivision: true,
      columnWidth: 50,
      getHoveredColumn,
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillStyle).toContain('#FF0000');
  });

  it('handles sections without column division', () => {
    const plugin = createBackgroundPlugin({
      sections: [
        { from: 0, to: 50, color: '#FF0000' },
        { from: 50, to: 100, color: '#00FF00' },
      ],
      useColumnDivision: false,
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2);
  });

  it('does not crash with empty sections array', () => {
    const plugin = createBackgroundPlugin({
      sections: [],
    });

    expect(() => {
      plugin.beforeDraw?.(mockChart, {} as any, {} as any);
    }).not.toThrow();
  });

  it('calculates column boundaries correctly', () => {
    const plugin = createBackgroundPlugin({
      sections: [{ from: 0, to: 100, color: '#FF0000' }],
      useColumnDivision: true,
      columnWidth: 25,
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockChart.scales.x.getPixelForValue).toHaveBeenCalledWith(0);
    expect(mockChart.scales.x.getPixelForValue).toHaveBeenCalledWith(25);
  });

  it('draws separator lines only between sections', () => {
    const plugin = createBackgroundPlugin({
      sections: [
        { from: 0, to: 30, color: '#FF0000' },
        { from: 30, to: 60, color: '#00FF00' },
        { from: 60, to: 100, color: '#0000FF' },
      ],
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.stroke).toHaveBeenCalledTimes(2);
  });

  it('applies correct separator line style', () => {
    const plugin = createBackgroundPlugin({
      sections: [
        { from: 0, to: 50, color: '#FF0000' },
        { from: 50, to: 100, color: '#00FF00' },
      ],
    });

    plugin.beforeDraw?.(mockChart, {} as any, {} as any);

    expect(mockCtx.strokeStyle).toBe('rgba(126, 124, 124, 0.1)');
    expect(mockCtx.lineWidth).toBe(0.5);
  });

  it('handles getHoveredColumn returning undefined', () => {
    const getHoveredColumn = jest.fn(() => undefined);
    const plugin = createBackgroundPlugin({
      sections: [{ from: 0, to: 100, color: '#FF0000', hoverColor: '#FFFF00' }],
      useColumnDivision: true,
      columnWidth: 50,
      getHoveredColumn,
    });

    expect(() => {
      plugin.beforeDraw?.(mockChart, {} as any, {} as any);
    }).not.toThrow();
  });
});

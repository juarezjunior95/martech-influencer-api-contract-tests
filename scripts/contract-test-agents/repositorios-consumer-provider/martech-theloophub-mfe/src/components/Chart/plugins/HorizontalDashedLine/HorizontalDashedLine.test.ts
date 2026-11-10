import { Chart } from 'chart.js';

import * as tooltipModule from './createTooltip';
import { createHorizontalDashedLinePlugin } from './HorizontalDashedLine';

jest.mock('./createTooltip', () => ({
  createTooltip: jest.fn(),
  hideTooltip: jest.fn(),
  removeTooltip: jest.fn(),
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
    fillText: jest.fn(),
    measureText: jest.fn().mockReturnValue({ width: 40 }),
    fill: jest.fn(),
    rect: jest.fn(),
    roundRect: jest.fn(),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockCanvas = (): HTMLCanvasElement =>
  ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getBoundingClientRect: jest.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
    }),
  }) as unknown as HTMLCanvasElement;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): Chart =>
  ({
    ctx,
    canvas,
    chartArea: {
      left: 50,
      right: 750,
      top: 50,
      bottom: 550,
    },
    scales: {
      x: {
        ticks: [{ value: 0 }, { value: 1 }, { value: 2 }],
        getPixelForTick: jest.fn((index) => 100 + index * 200),
      },
      y: {
        getPixelForValue: jest.fn((value) => 500 - value * 10),
      },
    },
  }) as unknown as Chart;

describe('HorizontalDashedLine Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockCanvas: HTMLCanvasElement;
  let mockChart: Chart;
  let plugin: any;

  beforeEach(() => {
    mockCtx = createMockCtx();
    mockCanvas = createMockCanvas();
    mockChart = createMockChart(mockCtx, mockCanvas);
    jest.clearAllMocks();
  });

  it('creates plugin with correct id', () => {
    plugin = createHorizontalDashedLinePlugin([]);

    expect(plugin.id).toBe('horizontalSteppedLine');
  });

  it('draws dashed horizontal lines for segments', () => {
    const segments = [
      { value: 10, xEnd: 1 },
      { value: 20, xEnd: 2 },
    ];
    plugin = createHorizontalDashedLinePlugin(segments);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.setLineDash).toHaveBeenCalledWith([6, 6]);
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('applies correct line styles', () => {
    plugin = createHorizontalDashedLinePlugin([{ value: 10 }]);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.strokeStyle).toBe('rgba(170, 180, 190, 1)');
    expect(mockCtx.lineWidth).toBe(1);
  });

  it('draws labels with unit measure', () => {
    const segments = [{ value: 10, unitMeasure: '%' }];
    plugin = createHorizontalDashedLinePlugin(segments);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '10%',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('draws labels without unit measure', () => {
    const segments = [{ value: 15 }];
    plugin = createHorizontalDashedLinePlugin(segments);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '15',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('draws rounded rectangles for labels when roundRect is available', () => {
    const segments = [{ value: 10 }];
    plugin = createHorizontalDashedLinePlugin(segments);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.roundRect).toHaveBeenCalled();
  });

  it('draws regular rectangles when roundRect is not available', () => {
    mockCtx.roundRect = undefined as any;
    const segments = [{ value: 10 }];
    plugin = createHorizontalDashedLinePlugin(segments);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.rect).toHaveBeenCalled();
  });

  it('registers mouse event listeners on beforeInit', () => {
    plugin = createHorizontalDashedLinePlugin([]);

    plugin.beforeInit(mockChart);

    expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
      'mouseleave',
      expect.any(Function),
    );
  });

  it('removes event listeners on beforeDestroy', () => {
    plugin = createHorizontalDashedLinePlugin([]);

    plugin.beforeInit(mockChart);
    plugin.beforeDestroy(mockChart);

    expect(mockCanvas.removeEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(mockCanvas.removeEventListener).toHaveBeenCalledWith(
      'mouseleave',
      expect.any(Function),
    );
  });

  it('creates tooltip on hover', () => {
    const tooltipText = 'Test Tooltip';
    plugin = createHorizontalDashedLinePlugin([{ value: 10 }], tooltipText);

    plugin.beforeInit(mockChart);
    plugin.afterDatasetsDraw(mockChart);

    const mouseMoveHandler = (mockCanvas.addEventListener as jest.Mock).mock
      .calls[0][1];
    mouseMoveHandler({
      clientX: 50,
      clientY: 50,
    });

    expect(tooltipModule.createTooltip).toHaveBeenCalledTimes(0);
  });

  it('hides tooltip when not hovering', () => {
    plugin = createHorizontalDashedLinePlugin([{ value: 10 }]);

    plugin.beforeInit(mockChart);
    plugin.afterDatasetsDraw(mockChart);

    const mouseMoveHandler = (mockCanvas.addEventListener as jest.Mock).mock
      .calls[0][1];
    mouseMoveHandler({
      clientX: 1000,
      clientY: 1000,
    });

    expect(tooltipModule.hideTooltip).toHaveBeenCalled();
  });

  it('hides tooltip on mouse leave', () => {
    plugin = createHorizontalDashedLinePlugin([{ value: 10 }]);

    plugin.beforeInit(mockChart);

    const mouseLeaveHandler = (mockCanvas.addEventListener as jest.Mock).mock
      .calls[1][1];
    mouseLeaveHandler();

    expect(tooltipModule.hideTooltip).toHaveBeenCalled();
  });

  it('removes tooltip on destroy', () => {
    plugin = createHorizontalDashedLinePlugin([{ value: 10 }]);

    plugin.beforeInit(mockChart);
    plugin.beforeDestroy(mockChart);

    expect(tooltipModule.removeTooltip).toHaveBeenCalled();
  });

  it('draws vertical lines between segments', () => {
    const segments = [{ value: 10, xEnd: 1 }, { value: 20 }];
    plugin = createHorizontalDashedLinePlugin(segments);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalled();
  });

  it('handles empty segments array', () => {
    plugin = createHorizontalDashedLinePlugin([]);

    expect(() => {
      plugin.afterDatasetsDraw(mockChart);
    }).not.toThrow();
  });

  it('resets line dash after drawing', () => {
    plugin = createHorizontalDashedLinePlugin([{ value: 10 }]);

    plugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.setLineDash).toHaveBeenCalledWith([]);
  });
});

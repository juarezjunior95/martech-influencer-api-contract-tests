import { Chart } from 'chart.js';

import * as createLabelIconModule from './createLabelIcon';
import * as tooltipModule from './createTooltip';
import { LabelIcon } from './LabelIcon';

jest.mock('./createLabelIcon', () => ({
  createLabelIcon: jest.fn(),
}));

jest.mock('./createTooltip', () => ({
  createTooltip: jest.fn(),
  hideTooltip: jest.fn(),
  removeTooltip: jest.fn(),
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    measureText: jest.fn().mockReturnValue({ width: 50 }),
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
  indexAxis: 'x' | 'y' = 'x',
): Chart =>
  ({
    ctx,
    canvas,
    data: {
      labels: ['USA', 'Brazil', 'Global', 'China'],
      datasets: [
        {
          icons: ['', '', 'world', ''],
          labelIconTooltip: 'This is a global market',
        },
      ],
    },
    options: {
      indexAxis,
    },
    scales: {
      x: {
        left: 50,
        getPixelForValue: jest.fn((index) => 100 + index * 150),
      },
      y: {
        bottom: 550,
        getPixelForValue: jest.fn((index) => 500 - index * 100),
      },
    },
  }) as unknown as Chart;

describe('LabelIcon Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockCanvas: HTMLCanvasElement;
  let mockChart: Chart;

  beforeEach(() => {
    mockCtx = createMockCtx();
    mockCanvas = createMockCanvas();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(LabelIcon.id).toBe('labelIcon');
  });

  it('draws icon for world icon type with x-axis', () => {
    mockChart = createMockChart(mockCtx, mockCanvas, 'x');

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).toHaveBeenCalled();
  });

  it('draws icon for world icon type with y-axis', () => {
    mockChart = createMockChart(mockCtx, mockCanvas, 'y');

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).toHaveBeenCalled();
  });

  it('does not draw when no icons array', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);
    mockChart.data.datasets[0] = {} as any;

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).not.toHaveBeenCalled();
  });

  it('does not draw when icons array is empty', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);
    mockChart.data.datasets[0] = { icons: [] } as any;

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).not.toHaveBeenCalled();
  });

  it('does not draw when x-scale is missing', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);
    mockChart.scales.x = undefined;

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).not.toHaveBeenCalled();
  });

  it('does not draw when y-scale is missing', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);
    mockChart.scales.y = undefined;

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).not.toHaveBeenCalled();
  });

  it('only draws icons for world type', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);
    mockChart.data.datasets[0] = {
      icons: ['other', 'world', 'something'],
      labels: ['A', 'B', 'C'],
    } as any;

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).toHaveBeenCalledTimes(1);
  });

  it('registers mouse event listeners on beforeInit', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.beforeInit(mockChart);

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
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.beforeInit(mockChart);
    LabelIcon.beforeDestroy(mockChart);

    expect(mockCanvas.removeEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(mockCanvas.removeEventListener).toHaveBeenCalledWith(
      'mouseleave',
      expect.any(Function),
    );
  });
  it('registers mouse event listeners that can trigger tooltip', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.beforeInit(mockChart);

    expect(mockCanvas.addEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );

    const mouseMoveHandler = (mockCanvas.addEventListener as jest.Mock).mock
      .calls[0][1];

    expect(() => {
      mouseMoveHandler({
        clientX: 400,
        clientY: 560,
      });
    }).not.toThrow();
  });

  it('mouse move handler calls hideTooltip when not hovering', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.beforeInit(mockChart);
    LabelIcon.afterDraw(mockChart);

    const mouseMoveHandler = (mockCanvas.addEventListener as jest.Mock).mock
      .calls[0][1];

    mouseMoveHandler({
      clientX: 10000,
      clientY: 10000,
    });

    expect(tooltipModule.hideTooltip).toHaveBeenCalled();
  });

  it('hides tooltip on mouse leave', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.beforeInit(mockChart);

    const mouseLeaveHandler = (mockCanvas.addEventListener as jest.Mock).mock
      .calls[1][1];
    mouseLeaveHandler();

    expect(tooltipModule.hideTooltip).toHaveBeenCalled();
  });

  it('removes tooltip on destroy', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.beforeInit(mockChart);
    LabelIcon.beforeDestroy(mockChart);

    expect(tooltipModule.removeTooltip).toHaveBeenCalled();
  });

  it('removes tooltip on destroy', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.beforeInit(mockChart);
    LabelIcon.beforeDestroy(mockChart);

    expect(tooltipModule.removeTooltip).toHaveBeenCalled();
  });

  it('uses correct icon size', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).toHaveBeenCalledWith(
      mockCtx,
      expect.any(Number),
      expect.any(Number),
      6,
    );
  });

  it('skips icons without corresponding labels', () => {
    mockChart = createMockChart(mockCtx, mockCanvas);
    mockChart.data.datasets[0] = {
      icons: ['world', 'world', 'world', 'world', 'world'],
    } as any;
    mockChart.data.labels = ['A', 'B'];

    LabelIcon.afterDraw(mockChart);

    expect(createLabelIconModule.createLabelIcon).toHaveBeenCalledTimes(2);
  });

  it('handles array labels correctly for x-axis', () => {
    mockChart = createMockChart(mockCtx, mockCanvas, 'x');
    mockChart.data.labels = [
      ['Line 1', 'Line 2'],
      'Single',
      ['A', 'B', 'C'],
      'Last',
    ];
    mockChart.data.datasets[0] = {
      icons: ['', '', 'world', ''],
    } as any;

    LabelIcon.afterDraw(mockChart);

    expect(mockCtx.measureText).toHaveBeenCalled();
    expect(createLabelIconModule.createLabelIcon).toHaveBeenCalled();
  });
});

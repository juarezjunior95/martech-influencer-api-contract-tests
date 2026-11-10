import { Chart } from 'chart.js';

import { ZeroLabelPlugin } from './ZeroLabelPlugin';

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  overrides?: { withoutYAxis?: boolean },
): Chart<'bar'> =>
  ({
    ctx,
    scales: overrides?.withoutYAxis
      ? {}
      : {
          y: {
            getPixelForValue: jest.fn((value: number) => 400 - value * 10),
            right: 50,
          },
        },
  }) as unknown as Chart<'bar'>;

describe('ZeroLabelPlugin', () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCtx = createMockCtx();
  });

  it('has correct plugin id', () => {
    expect(ZeroLabelPlugin.id).toBe('zeroLabel');
  });

  it('draws "0" label when y-axis exists', () => {
    const mockChart = createMockChart(mockCtx);

    ZeroLabelPlugin.afterDraw?.(mockChart, {}, {});

    expect(mockCtx.save).toHaveBeenCalledTimes(1);
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '0',
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockCtx.restore).toHaveBeenCalledTimes(1);
  });

  it('does not draw when y-axis is missing', () => {
    const mockChart = createMockChart(mockCtx, { withoutYAxis: true });

    ZeroLabelPlugin.afterDraw?.(mockChart, {}, {});

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.fillText).not.toHaveBeenCalled();
    expect(mockCtx.restore).not.toHaveBeenCalled();
  });

  it('applies correct text styles', () => {
    const mockChart = createMockChart(mockCtx);

    ZeroLabelPlugin.afterDraw?.(mockChart, {}, {});

    expect(mockCtx.font).toBe('12px "Work Sans", sans-serif');
    expect(mockCtx.fillStyle).toBe('#5C5C5C');
    expect(mockCtx.textAlign).toBe('right');
    expect(mockCtx.textBaseline).toBe('bottom');
  });

  it('positions label at correct coordinates', () => {
    const mockChart = createMockChart(mockCtx);
    const yAxis = mockChart.scales.y;

    ZeroLabelPlugin.afterDraw?.(mockChart, {}, {});

    expect(yAxis.getPixelForValue).toHaveBeenCalledWith(0);

    const expectedY =
      (yAxis.getPixelForValue as jest.Mock).mock.results[0].value - 4;
    const expectedX = yAxis.right - 10;

    expect(mockCtx.fillText).toHaveBeenCalledWith('0', expectedX, expectedY);
  });

  it('saves context before drawing and restores after', () => {
    const mockChart = createMockChart(mockCtx);
    const callOrder: string[] = [];

    (mockCtx.save as jest.Mock).mockImplementation(() =>
      callOrder.push('save'),
    );
    (mockCtx.fillText as jest.Mock).mockImplementation(() =>
      callOrder.push('fillText'),
    );
    (mockCtx.restore as jest.Mock).mockImplementation(() =>
      callOrder.push('restore'),
    );

    ZeroLabelPlugin.afterDraw?.(mockChart, {}, {});

    expect(callOrder).toEqual(['save', 'fillText', 'restore']);
  });
});

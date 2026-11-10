import { Chart } from 'chart.js';
import { theme } from 'theme';

import { DrawZeroValue } from './DrawZeroValue';

jest.mock('theme', () => ({
  theme: {
    colors: {
      txt: {
        secondary: '#6B7280',
      },
    },
  },
}));

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
  drawZeroValueOptions?: any,
): Chart<'bar'> =>
  ({
    ctx,
    config: {
      options: {
        plugins: {
          drawZeroValue: drawZeroValueOptions,
        },
      },
    },
    scales: {
      y: {
        top: 50,
        bottom: 550,
        left: 100,
        getPixelForValue: jest.fn((value) => 300 - value * 10),
      },
    },
  }) as unknown as Chart<'bar'>;

describe('DrawZeroValue Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart<'bar'>;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(DrawZeroValue.id).toBe('zeroLabelPlugin');
  });

  it('has correct default values', () => {
    expect(DrawZeroValue.defaults).toEqual({
      display: false,
    });
  });

  it('draws zero label when display is true', () => {
    mockChart = createMockChart(mockCtx, { display: true });

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '0',
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('does not draw when display is false', () => {
    mockChart = createMockChart(mockCtx, { display: false });

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('does not draw when y-axis is missing', () => {
    mockChart = createMockChart(mockCtx, { display: true });
    mockChart.scales.y = undefined;

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('does not draw when options are not provided (defaults to false)', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.config.options.plugins = {};

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.save).not.toHaveBeenCalled();
    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('applies correct text styles', () => {
    mockChart = createMockChart(mockCtx, { display: true });

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.font).toBe("12px 'Work Sans', sans-serif");
    expect(mockCtx.fillStyle).toBe(theme.colors.txt.secondary);
    expect(mockCtx.textAlign).toBe('right');
    expect(mockCtx.textBaseline).toBe('middle');
  });

  it('draws label at correct position', () => {
    mockChart = createMockChart(mockCtx, { display: true });

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    const zeroY = 300;
    const expectedX = mockChart.scales.y.left + 35;
    const expectedY = zeroY - 10;

    expect(mockCtx.fillText).toHaveBeenCalledWith('0', expectedX, expectedY);
  });

  it('calls getPixelForValue with 0', () => {
    mockChart = createMockChart(mockCtx, { display: true });

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockChart.scales.y.getPixelForValue).toHaveBeenCalledWith(0);
  });

  it('only draws when zero is within chart bounds', () => {
    mockChart = createMockChart(mockCtx, { display: true });

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('does not draw when zero is above chart bounds', () => {
    mockChart = createMockChart(mockCtx, { display: true });
    mockChart.scales.y.getPixelForValue = jest.fn(() => 40);

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('does not draw when zero is below chart bounds', () => {
    mockChart = createMockChart(mockCtx, { display: true });
    mockChart.scales.y.getPixelForValue = jest.fn(() => 600);

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('draws when zero is exactly at top boundary', () => {
    mockChart = createMockChart(mockCtx, { display: true });
    mockChart.scales.y.getPixelForValue = jest.fn(() => 50);

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('draws when zero is exactly at bottom boundary', () => {
    mockChart = createMockChart(mockCtx, { display: true });
    mockChart.scales.y.getPixelForValue = jest.fn(() => 550);

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('saves and restores canvas context', () => {
    mockChart = createMockChart(mockCtx, { display: true });

    DrawZeroValue.afterDraw(mockChart, {}, {} as any);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });
});

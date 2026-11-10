import { Chart } from 'chart.js';

import { ExtendYAxisPlugin } from './ExtendYAxisPlugin';

jest.mock('theme/colors/dataFoundations', () => ({
  __esModule: true,
  default: {
    charts: {
      border: {
        neutrals: { '40': '#CCCCCC' },
      },
    },
    txt: {
      secondary: '#5C5C5C',
    },
  },
}));

jest.mock('theme/fonts/typography', () => ({
  fontFoundations: {
    body: {
      xsmall: "normal 10px 'Work Sans', sans-serif",
    },
  },
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  options?: {
    extendYAxis?: { display: boolean };
    extendXAxis?: { display: boolean };
  },
  yScaleOptions?: { display?: boolean; border?: { color?: string } },
): Chart =>
  ({
    ctx,
    config: {
      options: {
        plugins: {
          extendYAxis: options?.extendYAxis,
          extendXAxis: options?.extendXAxis,
        },
      },
    },
    chartArea: {
      top: 50,
      bottom: 400,
      left: 40,
      right: 600,
    },
    scales: {
      y: {
        options: {
          display: yScaleOptions?.display ?? true,
          border: yScaleOptions?.border ?? { color: '#AAAAAA' },
        },
        getPixelForValue: jest.fn((value: number) => 400 - value * 10),
        right: 40,
      },
    },
  }) as unknown as Chart;

describe('ExtendYAxisPlugin', () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('should have correct plugin id', () => {
    expect(ExtendYAxisPlugin.id).toBe('extendYAxis');
  });

  it('should not draw when yScale is missing', () => {
    const chart = createMockChart(mockCtx, { extendYAxis: { display: true } });
    (chart as any).scales.y = undefined;

    ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('should not draw when yScale display is false', () => {
    const chart = createMockChart(
      mockCtx,
      { extendYAxis: { display: true } },
      { display: false },
    );

    ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  describe('extendYAxis', () => {
    it('should draw vertical line from top of chart area to top of canvas when enabled', () => {
      const chart = createMockChart(
        mockCtx,
        { extendYAxis: { display: true } },
        { display: true, border: { color: '#AAAAAA' } },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.moveTo).toHaveBeenCalledWith(40.5, 50);
      expect(mockCtx.lineTo).toHaveBeenCalledWith(40.5, 0);
      expect(mockCtx.stroke).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    it('should use yScale border color for stroke', () => {
      const chart = createMockChart(
        mockCtx,
        { extendYAxis: { display: true } },
        { display: true, border: { color: '#FF0000' } },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.strokeStyle).toBe('#FF0000');
    });

    it('should use default border color when yScale border color is not a string', () => {
      const chart = createMockChart(
        mockCtx,
        { extendYAxis: { display: true } },
        { display: true, border: { color: undefined } },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.strokeStyle).toBe('#CCCCCC');
    });

    it('should not draw vertical line when display is false', () => {
      const chart = createMockChart(
        mockCtx,
        { extendYAxis: { display: false } },
        { display: true },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.moveTo).not.toHaveBeenCalled();
    });
  });

  describe('extendXAxis', () => {
    it('should draw horizontal line and zero label when enabled', () => {
      const chart = createMockChart(
        mockCtx,
        { extendXAxis: { display: true } },
        { display: true, border: { color: '#AAAAAA' } },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 400);
      expect(mockCtx.lineTo).toHaveBeenCalledWith(40, 400);
      expect(mockCtx.stroke).toHaveBeenCalled();
    });

    it('should draw "0" label at correct position', () => {
      const chart = createMockChart(
        mockCtx,
        { extendXAxis: { display: true } },
        { display: true, border: { color: '#AAAAAA' } },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.fillText).toHaveBeenCalledWith(
        '0',
        30,
        expect.any(Number),
      );
      expect(mockCtx.textAlign).toBe('right');
      expect(mockCtx.textBaseline).toBe('bottom');
    });

    it('should not draw horizontal line when display is false', () => {
      const chart = createMockChart(
        mockCtx,
        { extendXAxis: { display: false } },
        { display: true },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.moveTo).not.toHaveBeenCalled();
    });
  });

  describe('both plugins enabled', () => {
    it('should draw both extensions when both are enabled', () => {
      const chart = createMockChart(
        mockCtx,
        { extendYAxis: { display: true }, extendXAxis: { display: true } },
        { display: true, border: { color: '#AAAAAA' } },
      );

      ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

      expect(mockCtx.beginPath).toHaveBeenCalledTimes(2);
      expect(mockCtx.stroke).toHaveBeenCalledTimes(2);
      expect(mockCtx.fillText).toHaveBeenCalledWith(
        '0',
        expect.any(Number),
        expect.any(Number),
      );
    });
  });

  it('should save and restore context', () => {
    const chart = createMockChart(
      mockCtx,
      { extendYAxis: { display: true } },
      { display: true },
    );

    ExtendYAxisPlugin.afterDraw!(chart as Chart<'bar'>, {}, {});

    expect(mockCtx.save).toHaveBeenCalledTimes(1);
    expect(mockCtx.restore).toHaveBeenCalledTimes(1);
  });
});

import { COLUMN_WIDTH } from '../constants';
import { BubbleChartData } from '../types';
import { getChartOptions } from './chartOptions';

jest.mock('./externalTooltip', () => ({
  customExternalTooltip: jest.fn(),
}));

describe('Chart Bubble - getChartOptions', () => {
  const createMockData = (
    overrides?: Partial<BubbleChartData>,
  ): BubbleChartData => ({
    yAxis: { min: 0, max: 100 },
    info: { label: 'Test Label' },
    backgroundChart: { backgrounds: [] },
    caption: { title: '', subtitle: '', data: [] },
    datasets: [
      {
        bubbles: [{ y: 10, r: 5, tooltip: 'Test', backgroundColor: '#FF0000' }],
      },
    ],
    ...overrides,
  });

  it('should return ChartOptions with correct structure', () => {
    const mockData = createMockData();
    const result = getChartOptions(mockData);

    expect(result).toHaveProperty('responsive', true);
    expect(result).toHaveProperty('interaction');
    expect(result).toHaveProperty('scales');
    expect(result).toHaveProperty('plugins');
    expect(result).toHaveProperty('elements');
  });

  it('should configure interaction correctly', () => {
    const mockData = createMockData();
    const result = getChartOptions(mockData);

    expect(result.interaction).toEqual({
      intersect: false,
      mode: 'nearest',
    });
  });

  describe('X Scale Configuration', () => {
    it('should configure x scale based on number of datasets', () => {
      const mockData = createMockData({
        datasets: [
          {
            bubbles: [
              { y: 10, r: 5, tooltip: 'Test', backgroundColor: '#FF0000' },
            ],
          },
          {
            bubbles: [
              { y: 20, r: 5, tooltip: 'Test2', backgroundColor: '#00FF00' },
            ],
          },
        ],
      });
      const result = getChartOptions(mockData);

      expect(result.scales?.x).toMatchObject({
        type: 'linear',
        min: 0,
        max: 2 * COLUMN_WIDTH,
      });
    });

    it('should configure x scale ticks correctly', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.scales?.x?.ticks).toMatchObject({
        stepSize: COLUMN_WIDTH,
        display: false,
      });
    });

    it('should configure x scale grid correctly', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.scales?.x?.grid).toMatchObject({
        drawTicks: false,
        drawOnChartArea: false,
      });
    });

    it('should handle single dataset', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.scales?.x?.max).toBe(COLUMN_WIDTH);
    });

    it('should handle multiple datasets', () => {
      const mockData = createMockData({
        datasets: [
          {
            bubbles: [
              { y: 10, r: 5, tooltip: 'Test', backgroundColor: '#FF0000' },
            ],
          },
          {
            bubbles: [
              { y: 20, r: 5, tooltip: 'Test2', backgroundColor: '#00FF00' },
            ],
          },
          {
            bubbles: [
              { y: 30, r: 5, tooltip: 'Test3', backgroundColor: '#0000FF' },
            ],
          },
        ],
      });
      const result = getChartOptions(mockData);

      expect(result.scales?.x?.max).toBe(3 * COLUMN_WIDTH);
    });
  });

  describe('Y Scale Configuration', () => {
    it('should configure y scale with data yAxis values', () => {
      const mockData = createMockData({
        yAxis: { min: 10, max: 90 },
      });
      const result = getChartOptions(mockData);

      expect(result.scales?.y).toMatchObject({
        beginAtZero: false,
        min: 10,
        max: 90,
      });
    });

    it('should configure y scale grid correctly', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.scales?.y?.grid).toMatchObject({
        drawOnChartArea: false,
        tickLength: 4,
        tickColor: '#AAB4BE',
      });
    });

    it('should configure y scale title correctly', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.scales?.y?.title).toMatchObject({
        display: false,
      });
    });

    it('should configure y scale ticks callback to hide min and max values', () => {
      const mockData = createMockData({
        yAxis: { min: 0, max: 100 },
      });
      const result = getChartOptions(mockData);
      const callback = result.scales?.y?.ticks?.callback;

      expect(callback).toBeDefined();
      if (callback) {
        const mockThis = {} as any;
        expect(callback.call(mockThis, 0, 0, [])).toBe('');
        expect(callback.call(mockThis, 100, 0, [])).toBe('');
        expect(callback.call(mockThis, 50, 0, [])).toBe(50);
      }
    });

    it('should configure y scale ticks padding', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.scales?.y?.ticks?.padding).toBe(10);
    });
  });

  describe('Plugins Configuration', () => {
    it('should configure tooltip correctly', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.plugins?.tooltip).toMatchObject({
        enabled: false,
      });
      expect(result.plugins?.tooltip?.external).toBeDefined();
    });

    it('should configure tooltip labelPointStyle callback', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);
      const labelPointStyle =
        result.plugins?.tooltip?.callbacks?.labelPointStyle;

      expect(labelPointStyle).toBeDefined();
      if (labelPointStyle) {
        const mockTooltipItem = {} as any;
        const mockThis = {} as any;
        const style = labelPointStyle.call(mockThis, mockTooltipItem);
        expect(style).toEqual({
          pointStyle: 'circle',
          radius: 5,
          rotation: 0,
        });
      }
    });

    it('should configure tooltip label callback', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);
      const labelCallback = result.plugins?.tooltip?.callbacks?.label;

      expect(labelCallback).toBeDefined();
      if (labelCallback) {
        const mockCtx = {
          raw: { tooltip: 'Test Tooltip' },
        } as any;
        const mockThis = {} as any;
        expect(labelCallback.call(mockThis, mockCtx)).toBe('Test Tooltip');
      }
    });

    it('should configure legend to be hidden', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.plugins?.legend).toMatchObject({
        display: false,
      });
    });
  });

  describe('Elements Configuration', () => {
    it('should configure point radius callback', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);
      const radiusCallback = result.elements?.point?.radius;

      expect(radiusCallback).toBeDefined();
      if (typeof radiusCallback === 'function') {
        const mockCtx = {
          dataIndex: 0,
          dataset: {
            data: [{ r: 10 }],
          },
        } as any;
        const mockThis = {} as any;
        expect(radiusCallback.call(mockThis, mockCtx, {} as any)).toBe(10);
      }
    });

    it('should use default radius when point r is undefined', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);
      const radiusCallback = result.elements?.point?.radius;

      expect(radiusCallback).toBeDefined();
      if (typeof radiusCallback === 'function') {
        const mockCtx = {
          dataIndex: 0,
          dataset: {
            data: [{}],
          },
        } as any;
        const mockThis = {} as any;
        expect(radiusCallback.call(mockThis, mockCtx, {} as any)).toBe(5);
      }
    });

    it('should configure hoverRadius callback', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);
      const hoverRadiusCallback = result.elements?.point?.hoverRadius;

      expect(hoverRadiusCallback).toBeDefined();
      if (typeof hoverRadiusCallback === 'function') {
        const mockCtx = {
          dataIndex: 0,
          dataset: {
            data: [{ r: 8 }],
          },
        } as any;
        const mockThis = {} as any;
        expect(hoverRadiusCallback.call(mockThis, mockCtx, {} as any)).toBe(8);
      }
    });

    it('should use default hoverRadius when point r is undefined', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);
      const hoverRadiusCallback = result.elements?.point?.hoverRadius;

      expect(hoverRadiusCallback).toBeDefined();
      if (typeof hoverRadiusCallback === 'function') {
        const mockCtx = {
          dataIndex: 0,
          dataset: {
            data: [{}],
          },
        } as any;
        const mockThis = {} as any;
        expect(hoverRadiusCallback.call(mockThis, mockCtx, {} as any)).toBe(5);
      }
    });

    it('should configure point hitRadius and borderWidth', () => {
      const mockData = createMockData();
      const result = getChartOptions(mockData);

      expect(result.elements?.point).toMatchObject({
        hitRadius: 5,
        borderWidth: 2,
      });
    });
  });
});

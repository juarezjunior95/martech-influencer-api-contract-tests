import { Log2Scale } from './LogScale';

describe('Log2Scale', () => {
  const mockChartConfig = {
    chart: {
      config: {
        options: {
          scales: {
            y: {
              log: {
                base: 2,
                log: Math.log2,
              },
            },
          },
        },
      },
    },
    id: 'test-scale',
    type: 'logarithmic',
    min: 1,
    max: 16,
  };

  let scale: Log2Scale;

  beforeEach(() => {
    scale = new Log2Scale(mockChartConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates instance with correct static properties', () => {
    expect(Log2Scale.id).toBe('log2Scale');
    expect(Log2Scale.defaults).toEqual({});
  });

  it('initializes with correct base and log function', () => {
    expect(scale['_base']).toBe(2);
    expect(scale['_log']).toBe(Math.log2);
  });

  it('initializes with default base when log config is not provided', () => {
    const configWithoutLog = {
      chart: {
        config: {
          options: {
            scales: {
              y: {},
            },
          },
        },
      },
    };

    const scaleWithDefaults = new Log2Scale(configWithoutLog);
    expect(scaleWithDefaults['_base']).toBe(2);
    expect(scaleWithDefaults['_log']).toBe(Math.log2);
  });

  it('parses finite values correctly', () => {
    const result = scale.parse(10, 0);
    expect(result).not.toBeNull();
  });

  it('returns null for non-finite values', () => {
    const result = scale.parse(Infinity, 0);
    expect(result).toBeNull();
  });

  it('determines data limits correctly', () => {
    scale.min = 1;
    scale.max = 16;

    // Mock getMinMax
    scale.getMinMax = jest.fn().mockReturnValue({ min: 2, max: 32 });

    scale.determineDataLimits();

    expect(scale.min).toBe(2);
    expect(scale.max).toBe(32);
  });

  it('handles non-finite values in determineDataLimits', () => {
    scale.getMinMax = jest
      .fn()
      .mockReturnValue({ min: Infinity, max: -Infinity });

    scale.determineDataLimits();

    expect(scale.min).toBeNull();
    expect(scale.max).toBeNull();
  });

  it('builds ticks correctly for positive range', () => {
    scale.min = 2;
    scale.max = 16;
    (scale.options as any) = { beginAtZero: false };

    const ticks = scale.buildTicks();

    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks[0]).toHaveProperty('value');
    expect(scale.min).toBeDefined();
    expect(scale.max).toBeDefined();
  });

  it('builds ticks correctly for negative range', () => {
    scale.min = -16;
    scale.max = -2;
    (scale.options as any) = { beginAtZero: false };

    const ticks = scale.buildTicks();

    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks.every((tick) => tick.value <= 0)).toBe(false);
  });

  it('builds ticks with beginAtZero option', () => {
    scale.min = 0.5;
    scale.max = 16;
    (scale.options as any) = { beginAtZero: true };

    const ticks = scale.buildTicks();

    expect(ticks.length).toBeGreaterThan(0);
  });

  it('includes base value tick when min is less than base', () => {
    scale.min = 1;
    scale.max = 16;
    (scale.options as any) = { beginAtZero: false };

    const ticks = scale.buildTicks();

    const hasBaseTick = ticks.some((tick) => Math.abs(tick.value) === 2);
    expect(hasBaseTick).toBe(true);
  });

  it('configures scale correctly', () => {
    scale.min = 2;
    scale.max = 16;

    // Mock the parent configure method
    const originalConfigure = Object.getPrototypeOf(
      Object.getPrototypeOf(scale),
    ).configure;
    Object.getPrototypeOf(Object.getPrototypeOf(scale)).configure = jest.fn();

    scale.configure();

    expect(scale['_startValue']).toBeDefined();
    expect(scale['_valueRange']).toBeDefined();

    // Restore original method
    Object.getPrototypeOf(Object.getPrototypeOf(scale)).configure =
      originalConfigure;
  });

  it('calculates pixel for value correctly', () => {
    scale.min = 2;
    scale.max = 16;
    scale['_startValue'] = 1;
    scale['_valueRange'] = 3;

    // Mock getPixelForDecimal
    scale.getPixelForDecimal = jest.fn().mockReturnValue(100);

    const pixel = scale.getPixelForValue(8);

    expect(pixel).toBe(100);
    expect(scale.getPixelForDecimal).toHaveBeenCalled();
  });

  it('uses min value as default in getPixelForValue', () => {
    scale.min = 4;
    scale['_startValue'] = 2;
    scale['_valueRange'] = 2;

    scale.getPixelForDecimal = jest.fn().mockReturnValue(50);

    const pixel = scale.getPixelForValue();

    expect(pixel).toBe(50);
  });

  it('calculates value for pixel correctly', () => {
    scale['_startValue'] = 1;
    scale['_valueRange'] = 3;

    // Mock getDecimalForPixel
    scale.getDecimalForPixel = jest.fn().mockReturnValue(0.5);

    const value = scale.getValueForPixel(100);

    expect(value).toBeGreaterThan(0);
    expect(scale.getDecimalForPixel).toHaveBeenCalledWith(100);
  });

  it('handles edge case with value equal to base', () => {
    scale.min = 2;
    scale.max = 16;
    scale['_startValue'] = 1;
    scale['_valueRange'] = 3;

    scale.getPixelForDecimal = jest.fn().mockReturnValue(0);

    const pixel = scale.getPixelForValue(2);

    expect(scale.getPixelForDecimal).toHaveBeenCalled();
  });

  it('handles small values less than base correctly', () => {
    scale.min = 0.5;
    scale.max = 16;
    scale['_startValue'] = 0;
    scale['_valueRange'] = 4;

    scale.getPixelForDecimal = jest.fn().mockReturnValue(10);

    const pixel = scale.getPixelForValue(1);

    expect(scale.getPixelForDecimal).toHaveBeenCalled();
  });
});

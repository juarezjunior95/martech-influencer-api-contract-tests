import { theme } from 'theme';

import {
  createBaseGridConfig,
  createFirstTickLabelPlugin,
  createIntegerTickCallback,
  createSingleAxisFirstTickPlugin,
  createSuffixTickCallback,
  TICK_LENGTH,
  TICK_WIDTH,
} from './chartAxisUtils';

const createCanvasContext = () =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    fillText: jest.fn(),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D & {
    save: jest.Mock;
    restore: jest.Mock;
    fillText: jest.Mock;
  };

describe('chartAxisUtils', () => {
  describe('createSuffixTickCallback', () => {
    const callback = createSuffixTickCallback();

    it('should format numbers for any tick index (first tick label is handled by grid/plugin, not this callback)', () => {
      expect(callback(100, 0)).toBe('');
      expect(callback(0, 0)).toBe('');
    });

    it('should format numbers with suffix for non-zero indices', () => {
      expect(callback(1500, 1)).toBe('1.5k');
      expect(callback(1500000, 2)).toBe('1.5M');
      expect(callback(500, 1)).toBe('500');
      expect(callback(100, 2)).toBe('100');
    });

    it('should return string values as-is', () => {
      expect(callback('label', 1)).toBe('label');
    });
  });

  describe('createIntegerTickCallback', () => {
    const callback = createIntegerTickCallback();

    it('should return integer values for any tick index (first tick label is drawn separately)', () => {
      expect(callback(10, 0)).toBe(10);
      expect(callback(0, 0)).toBe(0);
    });

    it('should return integer values directly for non-zero indices', () => {
      expect(callback(10, 1)).toBe(10);
      expect(callback(20, 2)).toBe(20);
      expect(callback(100, 5)).toBe(100);
    });

    it('should return empty string for non-integer values', () => {
      expect(callback(10.5, 1)).toBe('');
      expect(callback(20.7, 2)).toBe('');
    });

    it('should return string values as-is', () => {
      expect(callback('label', 1)).toBe('label');
    });
  });

  describe('createBaseGridConfig', () => {
    it('should return base grid configuration with correct values', () => {
      const config = createBaseGridConfig();

      expect(config.display).toBe(true);
      expect(config.drawTicks).toBe(true);
      expect(config.tickLength).toBe(TICK_LENGTH);
      expect(config.tickWidth).toBe(TICK_WIDTH);
      expect(typeof config.tickColor).toBe('function');
    });

    it('should return transparent color for first tick', () => {
      const config = createBaseGridConfig();
      const tickColor = config.tickColor({ index: 0 });

      expect(tickColor).toBe('transparent');
    });

    it('should return theme color for non-first ticks', () => {
      const config = createBaseGridConfig();
      const tickColor1 = config.tickColor({ index: 1 });
      const tickColor2 = config.tickColor({ index: 5 });

      expect(tickColor1).toBe(theme.colors.charts.bg.neutrals[40]);
      expect(tickColor2).toBe(theme.colors.charts.bg.neutrals[40]);
    });
  });

  describe('Grid configuration constants', () => {
    it('should export TICK_LENGTH with correct value', () => {
      expect(TICK_LENGTH).toBe(4);
    });

    it('should export TICK_WIDTH with correct value', () => {
      expect(TICK_WIDTH).toBe(2);
    });
  });

  describe('createFirstTickLabelPlugin', () => {
    it('should draw first tick labels for both y axes', () => {
      const ctx = createCanvasContext();
      const plugin = createFirstTickLabelPlugin();
      const chart = {
        ctx,
        scales: {
          y: {
            ticks: [{ value: 1500 }],
            getPixelForValue: jest.fn().mockReturnValue(100),
            right: 60,
            left: 0,
          },
          y1: {
            ticks: [{ value: 10.6 }],
            getPixelForValue: jest.fn().mockReturnValue(200),
            right: 300,
            left: 240,
          },
        },
      };

      plugin.afterDraw?.(chart as any, {} as any, {} as any);

      expect(ctx.save).toHaveBeenCalledTimes(1);
      expect(ctx.fillText).toHaveBeenNthCalledWith(1, '1.5k', 50, 96);
      expect(ctx.fillText).toHaveBeenNthCalledWith(2, '11', 250, 196);
      expect(ctx.restore).toHaveBeenCalledTimes(1);
    });
  });

  describe('createSingleAxisFirstTickPlugin', () => {
    it('should draw the first y-axis tick label when ticks are available', () => {
      const ctx = createCanvasContext();
      const plugin = createSingleAxisFirstTickPlugin();
      const chart = {
        ctx,
        scales: {
          y: {
            ticks: [{ value: 0 }],
            getPixelForValue: jest.fn().mockReturnValue(120),
            right: 80,
            left: 0,
          },
        },
      };

      plugin.afterDraw?.(chart as any, {} as any, {} as any);

      expect(ctx.save).toHaveBeenCalledTimes(1);
      expect(ctx.textAlign).toBe('right');
      expect(ctx.fillText).toHaveBeenCalledWith('0', 70, 116);
      expect(ctx.restore).toHaveBeenCalledTimes(1);
    });

    it('should not draw when the y-axis has no ticks', () => {
      const ctx = createCanvasContext();
      const plugin = createSingleAxisFirstTickPlugin();
      const chart = {
        ctx,
        scales: {
          y: {
            ticks: [],
            getPixelForValue: jest.fn(),
            right: 80,
            left: 0,
          },
        },
      };

      plugin.afterDraw?.(chart as any, {} as any, {} as any);

      expect(ctx.fillText).not.toHaveBeenCalled();
      expect(ctx.save).not.toHaveBeenCalled();
    });
  });
});

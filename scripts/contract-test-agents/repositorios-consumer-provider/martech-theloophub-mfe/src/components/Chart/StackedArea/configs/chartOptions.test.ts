import { CELL_VISIBILITY_THRESHOLD } from '../constants';
import type { ResponsiveConfig } from '../types';
import { getStackedAreaOptions } from './chartOptions';

const mockConfig: ResponsiveConfig = {
  columnWidth: 72,
  columnSpacing: 16,
  fontSize: { label: 12, value: 14, variation: 12 },
  padding: { top: 50, right: 24, bottom: 40, left: 24 },
  borderRadius: 8,
  minCellHeight: 8,
};

describe('getStackedAreaOptions', () => {
  let options: ReturnType<typeof getStackedAreaOptions>;

  beforeEach(() => {
    jest.clearAllMocks();
    options = getStackedAreaOptions(mockConfig);
  });

  it('returns responsive true and maintainAspectRatio false', () => {
    expect(options.responsive).toBe(true);
    expect(options.maintainAspectRatio).toBe(false);
  });

  it('sets indexAxis to "x"', () => {
    expect(options.indexAxis).toBe('x');
  });

  describe('interaction', () => {
    it('sets mode to index', () => {
      expect(options.interaction?.mode).toBe('index');
    });
    it('sets intersect to false', () => {
      expect(options.interaction?.intersect).toBe(false);
    });
  });

  describe('scales', () => {
    it('has x scale stacked', () => {
      expect(options.scales?.x).toBeDefined();
      expect((options.scales?.x as any)?.stacked).toBe(true);
    });

    it('has x scale displayed', () => {
      expect((options.scales?.x as any)?.display).toBe(true);
    });

    it('sets x ticks font size from config', () => {
      expect((options.scales?.x as any)?.ticks?.font?.size).toBe(
        mockConfig.fontSize.label,
      );
    });

    it('has y scale stacked', () => {
      expect((options.scales?.y as any)?.stacked).toBe(true);
    });

    it('has y scale displayed', () => {
      expect((options.scales?.y as any)?.display).toBe(true);
    });

    it('sets y beginAtZero to true', () => {
      expect((options.scales?.y as any)?.beginAtZero).toBe(true);
    });

    it('sets y max to 100', () => {
      expect((options.scales?.y as any)?.max).toBe(100);
    });

    it('has y grid with drawTicks enabled and drawOnChartArea disabled', () => {
      const yGrid = (options.scales?.y as any)?.grid;
      expect(yGrid?.display).toBe(true);
      expect(yGrid?.drawOnChartArea).toBe(false);
      expect(yGrid?.drawTicks).toBe(true);
    });
    it('has y border displayed', () => {
      expect((options.scales?.y as any)?.border?.display).toBe(true);
    });

    describe('y.ticks.callback', () => {
      const getCallback = () =>
        (options.scales?.y as any)?.ticks?.callback as (
          value: number | string,
        ) => string;

      it('returns "0" for 0', () => {
        const callback = getCallback();
        expect(callback(0)).toBe('');
      });

      it('returns rounded string for non-zero values', () => {
        const callback = getCallback();
        expect(callback(50)).toBe('50');
      });

      it('rounds decimal values', () => {
        const callback = getCallback();
        expect(callback(33.7)).toBe('34');
        expect(callback(33.2)).toBe('33');
      });

      it('handles string input', () => {
        const callback = getCallback();
        expect(callback('75')).toBe('75');
      });
    });
  });

  describe('plugins.legend', () => {
    it('has display set to false', () => {
      expect(options.plugins?.legend?.display).toBe(false);
    });
  });

  describe('plugins.datalabels', () => {
    const getDatalabels = () => (options.plugins as any)?.datalabels;

    it('has anchor set to "center"', () => {
      expect(getDatalabels()?.anchor).toBe('center');
    });

    it('has align set to "center"', () => {
      expect(getDatalabels()?.align).toBe('center');
    });

    it('has color set to #141414', () => {
      expect(getDatalabels()?.color).toBe('#141414');
    });

    it('sets font size from config', () => {
      expect(getDatalabels()?.font?.size).toBe(mockConfig.fontSize.value);
    });

    it('sets font weight to normal', () => {
      expect(getDatalabels()?.font?.weight).toBe('normal');
    });

    describe('display', () => {
      const getDisplay = () =>
        getDatalabels()?.display as (context: any) => boolean;

      it('returns false when value is 0', () => {
        const display = getDisplay();
        const context = {
          dataset: { data: [0] },
          dataIndex: 0,
          chart: { chartArea: { height: 300 } },
        };
        expect(display(context)).toBe(false);
      });

      it('returns false when value is null/undefined', () => {
        const display = getDisplay();
        const context = {
          dataset: { data: [null] },
          dataIndex: 0,
          chart: { chartArea: { height: 300 } },
        };
        expect(display(context)).toBe(false);
      });

      it('returns false when chartArea is not available', () => {
        const display = getDisplay();
        const context = {
          dataset: { data: [50] },
          dataIndex: 0,
          chart: { chartArea: null },
        };
        expect(display(context)).toBe(false);
      });

      it('returns true when expected height meets threshold', () => {
        const display = getDisplay();
        const chartHeight = 300;
        const value = 10;
        const expectedHeight = (value / 100) * chartHeight;

        const context = {
          dataset: { data: [value] },
          dataIndex: 0,
          chart: { chartArea: { height: chartHeight } },
        };

        if (expectedHeight >= CELL_VISIBILITY_THRESHOLD) {
          expect(display(context)).toBe(true);
        } else {
          expect(display(context)).toBe(false);
        }
      });

      it('returns false when expected height is below threshold', () => {
        const display = getDisplay();
        const context = {
          dataset: { data: [1] },
          dataIndex: 0,
          chart: { chartArea: { height: 300 } },
        };
        expect(display(context)).toBe(false);
      });
    });

    describe('formatter', () => {
      const getFormatter = () =>
        getDatalabels()?.formatter as (value: number, context: any) => string;

      it('formats with originalValues and % suffix', () => {
        const formatter = getFormatter();
        const context = {
          dataset: { originalValues: [42, 58] },
          dataIndex: 0,
        };
        expect(formatter(0, context)).toBe('42%');
      });

      it('returns empty string when originalValues is missing', () => {
        const formatter = getFormatter();
        const context = {
          dataset: {},
          dataIndex: 0,
        };
        expect(formatter(0, context)).toBe('');
      });

      it('handles zero in originalValues', () => {
        const formatter = getFormatter();
        const context = {
          dataset: { originalValues: [0, 100] },
          dataIndex: 0,
        };
        expect(formatter(0, context)).toBe('0%');
      });
    });
  });

  describe('callbacks.label', () => {
    const getLabel = () =>
      (options.plugins?.tooltip?.callbacks as any)?.label as (
        context: any,
      ) => string;

    it('returns original value with % when originalValues exists', () => {
      const label = getLabel();
      const context = {
        dataset: { label: 'Beer', originalValues: [82.1, 79] },
        dataIndex: 0,
        parsed: { y: 85.3 },
      };
      expect(label(context)).toBe('Beer: 82.1%');
    });

    it('falls back to parsed.y with % when originalValues is missing', () => {
      const label = getLabel();
      const context = {
        dataset: { label: 'Wine' },
        dataIndex: 0,
        parsed: { y: 5.3 },
      };
      expect(label(context)).toBe('Wine: 5.3%');
    });

    it('handles zero in originalValues', () => {
      const label = getLabel();
      const context = {
        dataset: { label: 'Spirits', originalValues: [0, 10] },
        dataIndex: 0,
        parsed: { y: 0 },
      };
      expect(label(context)).toBe('Spirits: 0%');
    });
  });

  describe('layout', () => {
    it('uses config.padding', () => {
      expect(options.layout?.padding).toEqual(mockConfig.padding);
    });

    it('reflects different padding values', () => {
      const customConfig = {
        ...mockConfig,
        padding: { top: 10, right: 5, bottom: 15, left: 5 },
      };
      const customOptions = getStackedAreaOptions(customConfig);
      expect(customOptions.layout?.padding).toEqual(customConfig.padding);
    });
  });
});

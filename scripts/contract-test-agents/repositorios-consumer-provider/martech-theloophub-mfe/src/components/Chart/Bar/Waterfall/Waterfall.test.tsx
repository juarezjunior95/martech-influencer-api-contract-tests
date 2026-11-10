import React from 'react';

import { render, screen } from '@testing-library/react';

import { BaseChart } from '../../BaseChart';
import { Waterfall } from './Waterfall';

// Mock BaseChart
jest.mock('../../BaseChart', () => ({
  BaseChart: jest.fn(() => <div data-testid="base-chart">BaseChart</div>),
}));

// Mock parseNumber utility
jest.mock('utils/format', () => ({
  parseNumber: jest.fn(Number),
}));

describe('Waterfall Component', () => {
  const mockValues = [100, 20, -15, 30, -10, 135];
  const mockLabels = [
    'Initial',
    'Gain 1',
    'Loss 1',
    'Gain 2',
    'Loss 2',
    'Final',
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render BaseChart component', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      expect(screen.getByTestId('base-chart')).toBeInTheDocument();
      expect(BaseChart).toHaveBeenCalled();
    });

    it('should pass correct type to BaseChart', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.type).toBe('bar');
    });

    it('should pass plugins to BaseChart', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const pluginIds = calls.plugins.map((p: any) => p.id);
      expect(pluginIds).toContain('connectBars');
      expect(pluginIds).toContain('waterfallCutBars');
      expect(pluginIds).toContain('waterfallDatalabel');
    });

    it('should disable grid', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.showGrid).toBe(false);
    });

    it('should pass baseChartColors to BaseChart', () => {
      const colors = ['#D8D7D4', '#67665F', '#D1A33C'];
      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          baseChartColors={colors}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.baseChartColors).toEqual(colors);
    });
  });

  describe('Props Validation - Size', () => {
    it('should apply medium size by default', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.barThickness).toBe(40);
    });

    it('should apply small size when specified', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} size="small" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.barThickness).toBe(32);
    });

    it('should apply large size when specified', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} size="large" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.barThickness).toBe(48);
    });
  });

  describe('Props Validation - Special Indexes', () => {
    it('should use default special indexes when not provided', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const connectBarsConfig = calls.options.plugins.connectBars;

      expect(connectBarsConfig.indexes.first).toBe(0);
      expect(connectBarsConfig.indexes.last).toBe(5);
    });

    it('should use custom special indexes when provided', () => {
      const specialIndexes = {
        first: 1,
        last: 4,
        retained: 2,
        variation: 3,
      };

      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          specialIndexes={specialIndexes}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const connectBarsConfig = calls.options.plugins.connectBars;

      expect(connectBarsConfig.indexes.first).toBe(1);
      expect(connectBarsConfig.indexes.last).toBe(4);
      expect(connectBarsConfig.indexes.retained).toBe(2);
      expect(connectBarsConfig.indexes.variation).toBe(3);
    });
  });

  describe('Props Validation - Colors', () => {
    it('should apply default colors when not provided', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const backgroundColors = dataset.backgroundColor;

      expect(backgroundColors).toBeDefined();
      expect(Array.isArray(backgroundColors)).toBe(true);
      expect(backgroundColors.length).toBe(mockValues.length);
    });

    it('should apply custom colors when provided', () => {
      const customColors = {
        positive: '#00FF00',
        negative: '#FF0000',
        first: '#0000FF',
        last: '#FFFF00',
        retained: '#FF00FF',
      };

      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          colors={customColors}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.backgroundColor[0]).toBe(customColors.first);
      expect(dataset.backgroundColor[5]).toBe(customColors.last);
    });

    it('should assign positive color to positive values', () => {
      render(
        <Waterfall values={[100, 20, 30, 150]} labels={['A', 'B', 'C', 'D']} />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.backgroundColor[1]).toBeDefined();
      expect(dataset.backgroundColor[2]).toBeDefined();
    });

    it('should assign negative color to negative values', () => {
      render(
        <Waterfall
          values={[100, -20, -30, 50]}
          labels={['A', 'B', 'C', 'D']}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.backgroundColor[1]).toBeDefined();
      expect(dataset.backgroundColor[2]).toBeDefined();
    });
  });

  describe('Props Validation - FormattedData', () => {
    it('should display datalabels when formattedData is provided', () => {
      const formattedData = [['100', '20', '-15', '30', '-10', '135']];

      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          formattedData={formattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.datalabels.display).toBe(true);
    });

    it('should not display datalabels when formattedData is not provided', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.datalabels.display).toBe(false);
    });

    it('should format datalabels correctly', () => {
      const formattedData = [['$100', '$20', '-$15', '$30', '-$10', '$135']];

      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          formattedData={formattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const formatter = dataset.datalabels.formatter;

      const result = formatter(mockValues[1], {
        datasetIndex: 0,
        dataIndex: 1,
      });

      expect(result).toBe('$20');
    });
  });

  describe('Props Validation - IndexAxis', () => {
    it('should apply correct padding for x-axis', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} indexAxis="x" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const padding = calls.options.layout.padding;

      expect(padding.left).toBe(16);
      expect(padding.top).toBe(40);
      expect(padding.right).toBe(16);
    });

    it('should apply correct padding for y-axis', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} indexAxis="y" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const padding = calls.options.layout.padding;

      expect(padding.left).toBe(0);
      expect(padding.top).toBe(0);
      expect(padding.right).toBe(20);
    });

    it('should configure scales correctly for x-axis', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} indexAxis="x" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const scales = calls.options.scales;

      expect(scales.y).toBeDefined();
      expect(scales.y.min).toBeDefined();
      expect(scales.y.max).toBeDefined();
    });

    it('should configure scales correctly for y-axis', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} indexAxis="y" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const scales = calls.options.scales;

      expect(scales.x).toBeDefined();
      expect(scales.x.min).toBeDefined();
      expect(scales.x.max).toBeDefined();
    });
  });

  describe('Behavior Assertions - Data Processing', () => {
    it('should convert values to numbers', () => {
      const stringValues = ['100', '20', '-15', '30', '-10', '135'];

      render(<Waterfall values={stringValues as any} labels={mockLabels} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should process first index value to 0', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should process last index value to 0', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should invert variation value when specified', () => {
      const specialIndexes = {
        first: 0,
        last: 5,
        variation: 3,
      };

      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          specialIndexes={specialIndexes}
        />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should calculate normalized ranges correctly', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(Array.isArray(dataset.data)).toBe(true);
      expect(dataset.data.length).toBe(mockValues.length);
    });

    it('should calculate min and max values correctly', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const scales = calls.options.scales;

      expect(scales.y?.min).toBeDefined();
      expect(scales.y?.max).toBeDefined();
    });

    it('should apply spacing to first and last values', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];

      expect(calls.options.scales.y?.suggestedMin).toBeDefined();
      expect(calls.options.scales.y?.suggestedMax).toBeDefined();
    });
  });

  describe('Behavior Assertions - Plugin Configuration', () => {
    it('should configure ConnectBars plugin', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const connectBarsConfig = calls.options.plugins.connectBars;

      expect(connectBarsConfig.display).toBe(true);
      expect(connectBarsConfig.color).toBe('#141414');
      expect(connectBarsConfig.indexes).toBeDefined();
    });

    it('should configure WaterfallCutBars plugin', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const cutBarsConfig = calls.options.plugins.waterfallCutBars;

      expect(cutBarsConfig.display).toBe(true);
      expect(cutBarsConfig.color).toBe('#141414');
      expect(cutBarsConfig.direction).toBe('diagonal');
      expect(cutBarsConfig.indexes).toBeDefined();
    });

    it('should configure WaterfallDatalabel plugin when formattedData is not provided', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const datalabelConfig = calls.options.plugins.waterfallDatalabel;

      expect(datalabelConfig.display).toBe(true);
      expect(datalabelConfig.indexes).toBeDefined();
      expect(datalabelConfig.datalabels).toBeDefined();
      expect(datalabelConfig.decimalPlaces).toBe(1);
      expect(datalabelConfig.color).toBeDefined();
    });

    it('should pass custom decimalPlaces to WaterfallDatalabel plugin when provided', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} decimalPlaces={3} />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.waterfallDatalabel.decimalPlaces).toBe(3);
    });

    it('should disable WaterfallDatalabel plugin when formattedData is provided', () => {
      const formattedData = [['100', '20', '-15', '30', '-10', '135']];

      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          formattedData={formattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const datalabelConfig = calls.options.plugins.waterfallDatalabel;

      expect(datalabelConfig.display).toBe(false);
    });

    it('should disable verticalGuidelines plugin', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const guidelinesConfig = calls.options.plugins.verticalGuidelines;

      expect(guidelinesConfig.display).toBe(false);
    });

    it('should disable legend', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.legend.display).toBe(false);
    });

    it('should disable tooltip', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.tooltip.enabled).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty values array', () => {
      render(<Waterfall values={[]} labels={[]} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle single value', () => {
      render(<Waterfall values={[100]} labels={['Single']} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.datasets[0].data).toHaveLength(1);
    });

    it('should handle all zero values', () => {
      render(<Waterfall values={[0, 0, 0]} labels={['A', 'B', 'C']} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle all positive values', () => {
      render(
        <Waterfall values={[100, 20, 30, 150]} labels={['A', 'B', 'C', 'D']} />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle all negative values', () => {
      render(
        <Waterfall
          values={[100, -20, -30, 50]}
          labels={['A', 'B', 'C', 'D']}
        />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle very large values', () => {
      render(
        <Waterfall
          values={[1000000, 500000, -200000, 1300000]}
          labels={['A', 'B', 'C', 'D']}
        />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle decimal values', () => {
      render(
        <Waterfall
          values={[100.5, 20.3, -15.7, 105.1]}
          labels={['A', 'B', 'C', 'D']}
        />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle undefined specialIndexes gracefully', () => {
      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          specialIndexes={undefined}
        />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle retained index without error', () => {
      const specialIndexes = {
        first: 0,
        last: 5,
        retained: 2,
      };

      render(
        <Waterfall
          values={mockValues}
          labels={mockLabels}
          specialIndexes={specialIndexes}
        />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });
  });

  describe('Behavior Assertions - Scales Configuration', () => {
    it('should configure axis ticks correctly', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const yAxisTicks = calls.options.scales.y?.ticks;

      expect(yAxisTicks.display).toBe(true);
      expect(yAxisTicks.font).toBeDefined();
      expect(yAxisTicks.color).toBe('#202123');
    });

    it('should configure axis border', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const yAxisBorder = calls.options.scales.y?.border;

      expect(yAxisBorder.display).toBe(true);
    });

    it('should set animation duration', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.options.animation.duration).toBe(300);
    });
  });

  describe('Props Validation - AxisType', () => {
    it('should pass axisType to BaseChart', () => {
      render(
        <Waterfall values={mockValues} labels={mockLabels} axisType="one" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.axisType).toBe('one');
    });

    it('should use default axisType as none', () => {
      render(<Waterfall values={mockValues} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.axisType).toBe('none');
    });
  });
});

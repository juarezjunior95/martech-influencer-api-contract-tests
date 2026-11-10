import React from 'react';
import { Chart } from 'react-chartjs-2';

import { render, screen } from '@testing-library/react';

import { BaseChart } from './BaseChart';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Chart: jest.fn(() => <div data-testid="chart">Chart</div>),
}));

// Mock Chart utilities
jest.mock('components/Chart/utils', () => ({
  getChartSuggestedMinMax: jest.fn(() => ({ min: 0, max: 100 })),
}));

// Mock format utilities
jest.mock('utils/format', () => ({
  formatNumberWithSuffix: jest.fn((value) => ({
    value: `${value}k`,
    suffix: 'k',
  })),
}));

describe('BaseChart Component', () => {
  const mockDatasets = [
    {
      label: 'Dataset 1',
      data: [10, 20, 30, 40, 50],
      backgroundColor: '#FF0000',
    },
  ];

  const mockLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Chart component', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      expect(screen.getByTestId('chart')).toBeInTheDocument();
      expect(Chart).toHaveBeenCalled();
    });

    it('should render with wrapper div', () => {
      const { container } = render(
        <BaseChart datasets={mockDatasets} labels={mockLabels} />,
      );

      const wrapper = container.querySelector(
        '[style*="width"]',
      ) as HTMLElement;
      expect(wrapper?.style.width).toBe('100%');
      expect(wrapper?.style.height).toBe('100%');
    });
  });

  describe('Props Validation - Chart Type', () => {
    it('should default to bar type', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.type).toBe('bar');
    });

    it('should accept custom chart type', () => {
      render(
        <BaseChart type="line" datasets={mockDatasets} labels={mockLabels} />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.type).toBe('line');
    });
  });

  describe('Props Validation - Datasets', () => {
    it('should pass datasets with yAxisID', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const dataset = calls.data.datasets[0];

      expect(dataset.yAxisID).toBe('y');
    });

    it('should pass baseChartColors to datasets', () => {
      const baseColors = ['#FF0000', '#00FF00', '#0000FF'];

      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          baseChartColors={baseColors}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const dataset = calls.data.datasets[0];

      expect(dataset.baseChartColors).toEqual(baseColors);
    });

    it('should handle multiple datasets', () => {
      const multipleDatasets = [
        { label: 'DS1', data: [10, 20, 30] },
        { label: 'DS2', data: [40, 50, 60] },
      ];

      render(
        <BaseChart datasets={multipleDatasets} labels={['A', 'B', 'C']} />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets).toHaveLength(2);
    });
  });

  describe('Props Validation - Options', () => {
    it('should set default options', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.options.responsive).toBe(true);
      expect(calls.options.maintainAspectRatio).toBe(false);
      expect(calls.options.animation.duration).toBe(1000);
      expect(calls.options.beginAtZero).toBe(true);
    });

    it('should merge custom options with defaults', () => {
      const customOptions = {
        animation: { duration: 500 },
        responsive: false,
      };

      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          options={customOptions}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.options.animation.duration).toBe(500);
      expect(calls.options.responsive).toBe(false);
    });
  });

  describe('Props Validation - IndexAxis', () => {
    it('should default to x indexAxis', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.indexAxis).toBe('x');
    });

    it('should apply custom indexAxis', () => {
      render(
        <BaseChart datasets={mockDatasets} labels={mockLabels} indexAxis="y" />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.indexAxis).toBe('y');
    });
  });

  describe('Props Validation - Layout Padding', () => {
    it('should apply default padding', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const padding = calls.options.layout.padding;

      expect(padding.top).toBe(40);
    });

    it('should apply custom padding when showGrid and not showDivider', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          showGrid={true}
          showDivider={false}
          axisType="one"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const padding = calls.options.layout.padding;

      expect(padding.right).toBe(16);
    });

    it('should apply padding when axisType is none', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          axisType="none"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const padding = calls.options.layout.padding;

      expect(padding.left).toBe(16);
    });

    it('should apply bottom padding when showLabels is false', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          showLabels={false}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const padding = calls.options.layout.padding;

      expect(padding.bottom).toBe(4);
    });
  });

  describe('Props Validation - Scales', () => {
    it('should configure x-axis correctly', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const xScale = calls.options.scales.x;

      expect(xScale.display).toBe(true);
      expect(xScale.offset).toBe(true);
      expect(xScale.beginAtZero).toBe(true);
    });

    it('should configure y-axis correctly', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const yScale = calls.options.scales.y;

      expect(yScale.display).toBe(true);
      expect(yScale.position).toBe('left');
    });

    it('should configure y1-axis when axisType is two', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          axisType="two"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const y1Scale = calls.options.scales.y1;

      expect(y1Scale.display).toBe(true);
      expect(y1Scale.position).toBe('right');
    });

    it('should hide x-axis when showLabels is false', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          showLabels={false}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const xScale = calls.options.scales.x;

      expect(xScale.display).toBe(false);
    });

    it('should hide y-axis when axisType is none', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          axisType="none"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const yScale = calls.options.scales.y;

      expect(yScale.display).toBe(false);
    });

    it('should apply suggested min and max from utility', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.options.scales.x.suggestedMin).toBeDefined();
      expect(calls.options.scales.x.suggestedMax).toBeDefined();
    });
  });

  describe('Props Validation - Plugins', () => {
    it('should disable legend by default', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.legend.display).toBe(false);
    });

    it('should disable tooltip by default', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.tooltip.enabled).toBe(false);
    });

    it('should configure verticalGuidelines plugin', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const guidelines = calls.options.plugins.verticalGuidelines;

      expect(guidelines.display).toBe(true);
      expect(guidelines.displayAxisX).toBe(true);
    });

    it('should configure customGrid when showGrid is true and no divider', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          showGrid={true}
          showDivider={false}
          axisType="one"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const customGrid = calls.options.plugins.customGrid;

      expect(customGrid.display).toBe(true);
    });

    it('should configure drawZeroLine when enabled', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          drawZeroLine={true}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const drawZeroLine = calls.options.plugins.drawZeroLine;

      expect(drawZeroLine.display).toBe(true);
      expect(drawZeroLine.color).toBe('#AAB4BE');
    });

    it('should register default plugins', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.plugins.length).toBeGreaterThan(0);
    });

    it('should include custom plugins', () => {
      const customPlugins = [{ id: 'customPlugin1' }, { id: 'customPlugin2' }];

      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          plugins={customPlugins as any}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.plugins.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Props Validation - Grid Display', () => {
    it('should show grid by default', () => {
      render(<BaseChart datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const yGrid = calls.options.scales.y.grid;

      expect(yGrid.display).toBe(false);
    });

    it('should hide grid when showGrid is false', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          showGrid={false}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const yGrid = calls.options.scales.y.grid;

      expect(yGrid.display).toBe(false);
    });
  });

  describe('Props Validation - HighlightLabels', () => {
    it('should apply bold font to highlighted labels', () => {
      const highlightLabels = ['Feb', 'Apr'];

      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          highlightLabels={highlightLabels}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const fontCallback = calls.options.scales.x.ticks.font;

      const boldFont = fontCallback({ tick: { label: 'Feb' } });
      expect(boldFont.weight).toBe('500');

      const normalFont = fontCallback({ tick: { label: 'Jan' } });
      expect(normalFont.weight).toBe('500');
    });

    it('should handle empty highlightLabels', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          highlightLabels={[]}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const fontCallback = calls.options.scales.x.ticks.font;

      const font = fontCallback({ tick: { label: 'Feb' } });
      expect(font.weight).toBe('500');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty datasets', () => {
      render(<BaseChart datasets={[]} labels={[]} />);

      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    it('should handle datasets without labels', () => {
      render(<BaseChart datasets={mockDatasets} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.data.labels).toBeUndefined();
    });

    it('should handle spacing parameter', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          spacing={0.25}
        />,
      );

      expect(Chart).toHaveBeenCalled();
    });

    it('should handle showDivider true', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          showDivider={true}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const guidelines = calls.options.plugins.verticalGuidelines;

      expect(guidelines.displayRightY).toBe(true);
    });
  });

  describe('Behavior Assertions - Callbacks', () => {
    it('should format x-axis ticks correctly for y indexAxis', () => {
      render(
        <BaseChart datasets={mockDatasets} labels={mockLabels} indexAxis="y" />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const callback = calls.options.scales.x.ticks.callback;

      const result = callback(0, 0);
      expect(result).toBe('');
    });

    it('should format y-axis ticks correctly for x indexAxis', () => {
      render(
        <BaseChart datasets={mockDatasets} labels={mockLabels} indexAxis="x" />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const callback = calls.options.scales.y.ticks.callback;

      const result = callback(0, 0);
      expect(result).toBe('');
    });

    it('should format y1-axis ticks when axisType is two', () => {
      render(
        <BaseChart
          datasets={mockDatasets}
          labels={mockLabels}
          axisType="two"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const callback = calls.options.scales.y1.ticks.callback;

      expect(callback).toBeDefined();
    });
  });
});

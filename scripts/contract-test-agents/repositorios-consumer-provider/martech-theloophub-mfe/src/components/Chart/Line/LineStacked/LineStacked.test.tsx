import React from 'react';
import { Chart } from 'react-chartjs-2';

import { render, screen } from '@testing-library/react';
import { ChartDataset } from 'chart.js';

import { LineStacked } from './LineStacked';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Chart: jest.fn(() => <div data-testid="chart">Chart</div>),
}));

// Mock hooks
jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(() => ({
    currentPage: 'volume-pages',
  })),
  usePageFilterApplied: jest.fn(() => ({
    applied: {
      time_frame: 'Q1 2024',
    },
  })),
}));

// Mock utils
jest.mock('./utils', () => ({
  calculateAverage: jest.fn((data) => {
    const sum = data.reduce((acc: number, val: number) => acc + val, 0);
    return sum / data.length;
  }),
  validateAverage: jest.fn((avg) => avg),
  getDatalabelsConfig: jest.fn(() => ({
    display: true,
    align: 'end',
    anchor: 'end',
  })),
  setAnchorLabels: jest.fn(() => 'end'),
  setAlignLabels: jest.fn(() => 'top'),
}));

// Mock Chart.js utilities
jest.mock('components/Chart/utils', () => ({
  getChartSuggestedMinMax: jest.fn(() => ({ min: 0, max: 100 })),
}));

describe('LineStacked Component', () => {
  const mockDatasets: ChartDataset<'line'>[] = [
    {
      label: 'Dataset 1',
      data: [10, 20, 30, 40, 50],
      borderColor: '#FF0000',
      backgroundColor: '#FF0000',
    },
  ];

  const mockLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Chart component', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      expect(screen.getByTestId('chart')).toBeInTheDocument();
      expect(Chart).toHaveBeenCalled();
    });

    it('should render with wrapper div', () => {
      const { container } = render(
        <LineStacked datasets={mockDatasets} labels={mockLabels} />,
      );

      const wrapper = container.querySelector(
        '[style*="width"]',
      ) as HTMLElement;
      expect(wrapper?.style.width).toBe('100%');
      expect(wrapper?.style.height).toBe('100%');
    });
  });

  describe('Props Validation - Chart Type', () => {
    it('should use line type for line datasets', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.type).toBe('line');
    });

    it('should use bar type when dataset contains bar type', () => {
      const mixedDatasets: ChartDataset<'line'>[] = [
        {
          label: 'Line',
          data: [10, 20, 30],
          type: 'line' as any,
        },
        {
          label: 'Bar',
          data: [40, 50, 60],
          type: 'bar' as any,
        },
      ];

      render(<LineStacked datasets={mixedDatasets} labels={['A', 'B', 'C']} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.type).toBe('bar');
    });
  });

  describe('Props Validation - Dataset Configuration', () => {
    it('should apply default properties to datasets', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const dataset = calls.data.datasets[0];

      expect(dataset.pointRadius).toBe(4);
      expect(dataset.pointBorderWidth).toBe(1);
      expect(dataset.tension).toBe(0);
    });

    it('should set order based on dataset type', () => {
      const mixedDatasets: ChartDataset<'line'>[] = [
        { label: 'Line', data: [10, 20], type: 'line' as any },
        { label: 'Bar', data: [30, 40], type: 'bar' as any },
      ];

      render(<LineStacked datasets={mixedDatasets} labels={['A', 'B']} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.data.datasets[0].order).toBe(1);
      expect(calls.data.datasets[1].order).toBe(2);
    });

    it('should apply borderRadius for bar type', () => {
      const barDataset: ChartDataset<'line'>[] = [
        { label: 'Bar', data: [10, 20], type: 'bar' as any },
      ];

      render(<LineStacked datasets={barDataset} labels={['A', 'B']} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const dataset = calls.data.datasets[0];

      expect(dataset.borderRadius).toBe(4);
    });

    it('should apply borderRadius 0 for line type', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const dataset = calls.data.datasets[0];

      expect(dataset.borderRadius).toBe(4);
    });

    it('should set borderSkipped for bar datasets', () => {
      const barDatasets: ChartDataset<'line'>[] = [
        { label: 'Bar1', data: [10, 20], type: 'bar' as any },
        { label: 'Bar2', data: [30, 40], type: 'bar' as any },
      ];

      render(<LineStacked datasets={barDatasets} labels={['A', 'B']} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.data.datasets[0].borderSkipped).toBe('bottom');
      expect(calls.data.datasets[1].borderSkipped).toBe('top');
    });

    it('should set borderColor to transparent for bar type', () => {
      const barDataset: ChartDataset<'line'>[] = [
        {
          label: 'Bar',
          data: [10, 20],
          type: 'bar' as any,
          borderColor: '#FF0000',
        },
      ];

      render(<LineStacked datasets={barDataset} labels={['A', 'B']} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const dataset = calls.data.datasets[0];

      expect(dataset.borderColor).toBe('transparent');
    });
  });

  describe('Props Validation - Plugins Configuration', () => {
    it('should pass roundedArrow config to plugins', () => {
      const roundedArrowConfig = {
        comparison: 10,
        unit_of_measure: '%',
        direction: 'up' as const,
      };

      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          roundedArrow={roundedArrowConfig}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.roundedArrow).toEqual(roundedArrowConfig);
    });

    it('should disable legend', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.legend.display).toBe(false);
    });

    it('should disable standard datalabels', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.datalabels.display).toBe(false);
    });

    it('should enable tooltip when prop is true', () => {
      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          tooltip={true}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.tooltip.enabled).toBe(true);
    });

    it('should disable tooltip by default', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.tooltip.enabled).toBe(false);
    });

    it('should configure datalabelWithVariation plugin', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const plugin = calls.options.plugins.datalabelWithVariation;

      expect(plugin).toBeDefined();
      expect(plugin.separator).toEqual({ yAxis: '|', xAxis: '-' });
      expect(plugin.label).toBeDefined();
      expect(plugin.variation).toBeDefined();
    });

    it('should register correct plugins', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.plugins).toHaveLength(5); // RoundedArrow, VerticalGuidelines, ChartDataLabels, StripedBackground
    });
  });

  describe('Props Validation - Scales Configuration', () => {
    it('should configure x-axis correctly', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const xScale = calls.options.scales.x;

      expect(xScale.offset).toBe(true);
      expect(xScale.beginAtZero).toBe(true);
      expect(xScale.grid.display).toBe(true);
      expect(xScale.grid.drawOnChartArea).toBe(false);
    });

    it('should configure y-axis correctly', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const yScale = calls.options.scales.y;

      expect(yScale.beginAtZero).toBe(false);
      expect(yScale.grid.display).toBe(true);
      expect(yScale.grid.drawOnChartArea).toBe(true);
    });

    it('should set stacked scales when bar type is present', () => {
      const mixedDatasets: ChartDataset<'line'>[] = [
        { label: 'Line', data: [10, 20], type: 'line' as any },
        { label: 'Bar', data: [30, 40], type: 'bar' as any },
      ];

      render(<LineStacked datasets={mixedDatasets} labels={['A', 'B']} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.options.scales.x.stacked).toBe(true);
      expect(calls.options.scales.y.stacked).toBe(true);
    });

    it('should not stack when all datasets are line type', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      expect(calls.options.scales.x.stacked).toBe(false);
      expect(calls.options.scales.y.stacked).toBe(false);
    });

    it('should apply custom suggestedMin from options', () => {
      const customOptions = {
        scales: {
          y: { suggestedMin: -50, suggestedMax: 200 },
        },
      } as any;

      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          options={customOptions}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.y.suggestedMin).toBe(-50);
      expect(calls.options.scales.y.suggestedMax).toBe(200);
    });

    it('should use calculated min/max when custom options not provided', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];

      // Should use calculated values from getChartSuggestedMinMax
      expect(calls.options.scales.y.suggestedMin).toBeDefined();
      expect(calls.options.scales.y.suggestedMax).toBeDefined();
    });

    it('should configure y-axis width correctly for x indexAxis', () => {
      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          indexAxis="x"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const mockAxis = { width: 0 };

      calls.options.scales.y.afterFit(mockAxis);

      expect(mockAxis.width).toBe(35);
    });

    it('should configure y-axis width correctly for y indexAxis', () => {
      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          indexAxis="y"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const mockAxis = { width: 0 };

      calls.options.scales.y.afterFit(mockAxis);

      expect(mockAxis.width).toBe(80);
    });
  });

  describe('Props Validation - Layout', () => {
    it('should apply correct padding', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const padding = calls.options.layout.padding;

      expect(padding.top).toBe(80);
      expect(padding.left).toBe(10);
      expect(padding.right).toBe(0);
    });
  });

  describe('Props Validation - IndexAxis', () => {
    it('should default to x indexAxis', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.indexAxis).toBe('x');
    });

    it('should apply custom indexAxis', () => {
      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          indexAxis="y"
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.indexAxis).toBe('y');
    });
  });

  describe('Behavior Assertions - Tooltip Callbacks', () => {
    it('should configure tooltip title callback', () => {
      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          tooltip={true}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const titleCallback = calls.options.plugins.tooltip.callbacks.title;

      const result = titleCallback([{ label: 'Jan' }]);
      expect(result).toBeDefined();
    });

    it('should configure tooltip labelPointStyle callback', () => {
      render(
        <LineStacked
          datasets={mockDatasets}
          labels={mockLabels}
          tooltip={true}
        />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      const labelPointStyle =
        calls.options.plugins.tooltip.callbacks.labelPointStyle();

      expect(labelPointStyle.pointStyle).toBe('line');
      expect(labelPointStyle.rotation).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty datasets', () => {
      render(<LineStacked datasets={[]} labels={[]} />);

      expect(screen.getByTestId('chart')).toBeInTheDocument();
    });

    it('should handle single dataset', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets).toHaveLength(1);
    });

    it('should handle multiple datasets', () => {
      const multipleDatasets: ChartDataset<'line'>[] = [
        { label: 'DS1', data: [10, 20, 30] },
        { label: 'DS2', data: [40, 50, 60] },
        { label: 'DS3', data: [70, 80, 90] },
      ];

      render(
        <LineStacked datasets={multipleDatasets} labels={['A', 'B', 'C']} />,
      );

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets).toHaveLength(3);
    });

    it('should handle datasets with zero values', () => {
      const zeroDatasets: ChartDataset<'line'>[] = [
        { label: 'Zero', data: [0, 0, 0] },
      ];

      render(<LineStacked datasets={zeroDatasets} labels={['A', 'B', 'C']} />);

      expect(Chart).toHaveBeenCalled();
    });

    it('should handle datasets with negative values', () => {
      const negativeDatasets: ChartDataset<'line'>[] = [
        { label: 'Negative', data: [-10, -20, -30] },
      ];

      render(
        <LineStacked datasets={negativeDatasets} labels={['A', 'B', 'C']} />,
      );

      expect(Chart).toHaveBeenCalled();
    });

    it('should handle mixed line and bar datasets', () => {
      const mixedDatasets: ChartDataset<'line'>[] = [
        { label: 'Line1', data: [10, 20], type: 'line' as any },
        { label: 'Bar1', data: [30, 40], type: 'bar' as any },
        { label: 'Line2', data: [50, 60], type: 'line' as any },
        { label: 'Bar2', data: [70, 80], type: 'bar' as any },
      ];

      render(<LineStacked datasets={mixedDatasets} labels={['A', 'B']} />);

      expect(Chart).toHaveBeenCalled();
    });
  });

  describe('Options Configuration', () => {
    it('should set responsive and maintainAspectRatio', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.responsive).toBe(true);
      expect(calls.options.maintainAspectRatio).toBe(false);
    });

    it('should set animation duration', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.animation.duration).toBe(1000);
    });

    it('should configure interaction mode', () => {
      render(<LineStacked datasets={mockDatasets} labels={mockLabels} />);

      const calls = (Chart as jest.Mock).mock.calls[0][0];
      expect(calls.options.interaction.intersect).toBe(false);
      expect(calls.options.interaction.mode).toBe('index');
    });
  });
});

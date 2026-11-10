import React from 'react';
import { Bar } from 'react-chartjs-2';

import { render, screen, waitFor } from '@testing-library/react';
import { Chart as ChartJS } from 'chart.js';

import { SimpleBarChart, SimpleBarChartData } from './SimpleBarChart';

jest.mock('react-chartjs-2', () => ({
  Bar: jest.fn(() => <div data-testid="chart-bar">Chart</div>),
}));

// Mock Chart.js modules registration
jest.mock('components/Chart/register', () => ({
  registerChartModules: jest.fn(),
}));

describe('SimpleBarChart Component', () => {
  const mockData: SimpleBarChartData = {
    values: [10, 20, 30, 40, 50],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    backgroundColor: '#FF0000',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Bar chart component', () => {
      render(<SimpleBarChart data={mockData} />);

      expect(screen.getByTestId('chart-bar')).toBeInTheDocument();
      expect(Bar).toHaveBeenCalled();
    });

    it('should render with default width', () => {
      const { container } = render(<SimpleBarChart data={mockData} />);

      const wrapper = container.querySelector(
        '[style*="width"]',
      ) as HTMLElement;
      expect(wrapper?.style.width).toBe('100%');
    });

    it('should render with custom width', () => {
      const { container } = render(
        <SimpleBarChart data={mockData} width="50%" />,
      );

      const wrapper = container.querySelector(
        '[style*="width"]',
      ) as HTMLElement;
      expect(wrapper?.style.width).toBe('50%');
    });

    it('should render with full height', () => {
      const { container } = render(<SimpleBarChart data={mockData} />);

      const wrapper = container.querySelector(
        '[style*="height"]',
      ) as HTMLElement;
      expect(wrapper?.style.height).toBe('100%');
    });
  });

  describe('Props Validation - Chart Data', () => {
    it('should pass correct data to Bar component', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.labels).toEqual(mockData.labels);
      expect(calls.data.datasets[0].data).toEqual(mockData.values);
      expect(calls.data.datasets[0].backgroundColor).toBe(
        mockData.backgroundColor,
      );
    });

    it('should apply default bar thickness when not provided', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].barThickness).toBe(32);
    });

    it('should apply custom bar thickness', () => {
      render(<SimpleBarChart data={mockData} barTickness={50} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].barThickness).toBe(50);
    });

    it('should apply border radius', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].borderRadius).toBe(4);
    });
  });

  describe('Props Validation - Options', () => {
    it('should set responsive to true', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.responsive).toBe(true);
    });

    it('should set maintainAspectRatio to false', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.maintainAspectRatio).toBe(false);
    });

    it('should set indexAxis to x', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.indexAxis).toBe('x');
    });

    it('should set borderColor to #FFF', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.borderColor.toUpperCase()).toBe('#FFF');
    });
  });

  describe('Props Validation - Layout Padding', () => {
    it('should apply default padding with axisType one', () => {
      render(<SimpleBarChart data={mockData} axisType="one" />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.layout.padding.top).toBe(80);
      expect(calls.options.layout.padding.left).toBe(10);
    });

    it('should apply different padding with axisType none', () => {
      render(<SimpleBarChart data={mockData} axisType="none" />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.layout.padding.left).toBe(16);
    });
  });

  describe('Props Validation - Plugins', () => {
    it('should disable legend', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.legend.display).toBe(false);
    });

    it('should disable tooltip', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.tooltip.enabled).toBe(false);
    });

    it('should configure datalabels', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.datalabels.display).toBe(true);
      expect(calls.options.plugins.datalabels.clamp).toBe(true);
      expect(calls.options.plugins.datalabels.color).toBe('#141414');
      expect(calls.options.plugins.datalabels.align).toBe('end');
      expect(calls.options.plugins.datalabels.anchor).toBe('end');
    });

    it('should configure zeroLabel plugin when enabled', () => {
      const pluginsOptions = {
        zeroLabel: { display: true },
      };

      render(
        <SimpleBarChart data={mockData} pluginsOptions={pluginsOptions} />,
      );

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.zeroLabel.display).toBe(true);
    });

    it('should configure zeroLabel plugin with suggestedMin', () => {
      const pluginsOptions = {
        zeroLabel: { display: true },
      };

      render(
        <SimpleBarChart
          data={mockData}
          pluginsOptions={pluginsOptions}
          suggestedMin={-10}
        />,
      );

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.zeroLabel.suggestedMin).toBe(-10);
    });

    it('should pass connector config to plugins', () => {
      const connector = {
        from: 'Jan',
        to: 'Feb',
        value: '10',
        backgroundColor: '#FF0000',
        textColor: '#000000',
        measure: '%',
      };

      const dataWithConnector: SimpleBarChartData = {
        ...mockData,
        connector,
      };

      render(<SimpleBarChart data={dataWithConnector} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.connector).toEqual(connector);
    });

    it('should register correct plugins', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const pluginIds = calls.plugins.map((p: any) => p.id);
      expect(pluginIds).toContain('connectorPlugin');
      expect(pluginIds).toContain('datalabels');
      expect(pluginIds).toContain('zeroLabelPlugin');
    });
  });

  describe('Props Validation - Scales', () => {
    it('should configure x-axis with default settings', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.x.offset).toBe(true);
      expect(calls.options.scales.x.grid.display).toBe(true);
      expect(calls.options.scales.x.grid.drawOnChartArea).toBe(false);
      expect(calls.options.scales.x.ticks.display).toBe(true);
    });

    it('should configure x-axis without grid when showGrid is false', () => {
      render(<SimpleBarChart data={mockData} showGrid={false} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.x.grid.display).toBe(false);
    });

    it('should configure x-axis ticks callback', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const callback = calls.options.scales.x.ticks.callback;

      expect(callback(0, 0)).toBe('Jan');
      expect(callback(1, 1)).toBe('Feb');
      expect(callback(4, 4)).toBe('May');
    });

    it('should configure y-axis with default settings', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.y.offset).toBe(false);
      expect(calls.options.scales.y.display).toBe(true);
      expect(calls.options.scales.y.beginAtZero).toBe(true);
    });

    it('should hide y-axis when axisType is none', () => {
      render(<SimpleBarChart data={mockData} axisType="none" />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.y.display).toBe(false);
    });

    it('should configure y-axis with custom min and max', () => {
      render(
        <SimpleBarChart
          data={mockData}
          suggestedMin={-10}
          suggestedMax={100}
        />,
      );

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.y.min).toBe(-10);
      expect(calls.options.scales.y.max).toBe(100);
    });

    it('should configure y-axis afterFit callback', () => {
      render(<SimpleBarChart data={mockData} axisType="one" />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const mockAxis = { width: 0 };

      calls.options.scales.y.afterFit(mockAxis);

      expect([30, 40]).toContain(mockAxis.width);
    });

    it('should set y-axis width to 0 when axisType is none', () => {
      render(<SimpleBarChart data={mockData} axisType="none" />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const mockAxis = { width: 0 };

      calls.options.scales.y.afterFit(mockAxis);

      expect(mockAxis.width).toBe(0);
    });
  });

  describe('Props Validation - onInit Callback', () => {
    it('should call onInit when chart is initialized', async () => {
      const onInit = jest.fn();
      const mockChartInstance = { id: 'test-chart' } as ChartJS<'bar'>;

      jest.spyOn(React, 'useRef').mockReturnValue({
        current: mockChartInstance,
      });

      render(<SimpleBarChart data={mockData} onInit={onInit} />);

      await waitFor(() => {
        expect(onInit).toHaveBeenCalledWith(mockChartInstance);
      });
    });

    it('should not call onInit when not provided', () => {
      render(<SimpleBarChart data={mockData} />);

      expect(screen.getByTestId('chart-bar')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty values array', () => {
      const emptyData: SimpleBarChartData = {
        values: [],
        labels: [],
      };

      render(<SimpleBarChart data={emptyData} />);

      expect(screen.getByTestId('chart-bar')).toBeInTheDocument();
    });

    it('should handle single data point', () => {
      const singleData: SimpleBarChartData = {
        values: [50],
        labels: ['Single'],
        backgroundColor: '#FF0000',
      };

      render(<SimpleBarChart data={singleData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].data).toEqual([50]);
    });

    it('should handle negative values', () => {
      const negativeData: SimpleBarChartData = {
        values: [-10, -20, -30],
        labels: ['A', 'B', 'C'],
      };

      render(<SimpleBarChart data={negativeData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].data).toEqual([-10, -20, -30]);
    });

    it('should handle mixed positive and negative values', () => {
      const mixedData: SimpleBarChartData = {
        values: [10, -20, 30, -40, 50],
        labels: ['A', 'B', 'C', 'D', 'E'],
      };

      render(<SimpleBarChart data={mixedData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].data).toEqual([10, -20, 30, -40, 50]);
    });

    it('should handle zero suggestedMax', () => {
      render(<SimpleBarChart data={mockData} suggestedMax={0} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.y.max).toBe(0);
    });

    it('should handle backgroundColor as array', () => {
      const colorArrayData: SimpleBarChartData = {
        values: [10, 20, 30],
        labels: ['A', 'B', 'C'],
        backgroundColor: ['#FF0000', '#00FF00', '#0000FF'],
      };

      render(<SimpleBarChart data={colorArrayData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].backgroundColor).toEqual([
        '#FF0000',
        '#00FF00',
        '#0000FF',
      ]);
    });

    it('should handle very large bar thickness', () => {
      render(<SimpleBarChart data={mockData} barTickness={1000} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets[0].barThickness).toBe(1000);
    });
  });

  describe('Behavior Assertions', () => {
    it('should use correct font family', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.datalabels.font.family).toBe(
        "'Work Sans', sans-serif",
      );
      expect(calls.options.scales.x.ticks.font.family).toBe(
        "'Work Sans', sans-serif",
      );
    });

    it('should use correct font sizes', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.datalabels.font.size).toBe(12);
      expect(calls.options.scales.x.ticks.font.size).toBe(12);
    });

    it('should use correct colors', () => {
      render(<SimpleBarChart data={mockData} />);

      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.datalabels.color).toBe('#141414');
    });
  });

  describe('Props Validation - extendYAxis and extendXAxis Plugins', () => {
    it('should configure extendYAxis plugin when enabled', () => {
      const pluginsOptions = {
        extendYAxis: { display: true },
      };
      render(
        <SimpleBarChart data={mockData} pluginsOptions={pluginsOptions} />,
      );
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.extendYAxis.display).toBe(true);
    });
    it('should default extendYAxis to false when not provided', () => {
      render(<SimpleBarChart data={mockData} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.extendYAxis.display).toBe(false);
    });
    it('should configure extendXAxis plugin when enabled', () => {
      const pluginsOptions = {
        extendXAxis: { display: true },
      };
      render(
        <SimpleBarChart data={mockData} pluginsOptions={pluginsOptions} />,
      );
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.extendXAxis.display).toBe(true);
    });
    it('should default extendXAxis to false when not provided', () => {
      render(<SimpleBarChart data={mockData} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.extendXAxis.display).toBe(false);
    });
    it('should register ExtendYAxisPlugin in plugins array', () => {
      render(<SimpleBarChart data={mockData} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const pluginIds = calls.plugins.map((p: any) => p.id);
      expect(pluginIds).toContain('extendYAxis');
    });
    it('should return empty string for y-axis tick value 0 when extendXAxis is enabled', () => {
      const pluginsOptions = {
        extendXAxis: { display: true },
      };
      render(
        <SimpleBarChart data={mockData} pluginsOptions={pluginsOptions} />,
      );
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const callback = calls.options.scales.y.ticks.callback;
      expect(callback(0)).toBe('');
    });
    it('should return value for non-zero y-axis tick when extendXAxis is enabled', () => {
      const pluginsOptions = {
        extendXAxis: { display: true },
      };
      render(
        <SimpleBarChart data={mockData} pluginsOptions={pluginsOptions} />,
      );
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const callback = calls.options.scales.y.ticks.callback;
      expect(callback(10)).toBe(10);
    });
    it('should return value for y-axis tick value 0 when extendXAxis is not enabled', () => {
      render(<SimpleBarChart data={mockData} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      const callback = calls.options.scales.y.ticks.callback;
      expect(callback(0)).toBe(0);
    });
  });

  describe('Props Validation - dataLabelsFormatter', () => {
    it('should apply custom dataLabelsFormatter', () => {
      const formatter = jest.fn((value: number) => `${value}%`);
      render(
        <SimpleBarChart data={mockData} dataLabelsFormatter={formatter} />,
      );
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.datalabels.formatter).toBe(formatter);
    });
    it('should not include formatter when dataLabelsFormatter is not provided', () => {
      render(<SimpleBarChart data={mockData} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.datalabels.formatter).toBeUndefined();
    });
  });

  describe('Props Validation - yStepSize', () => {
    it('should apply yStepSize to y-axis ticks', () => {
      render(<SimpleBarChart data={mockData} yStepSize={10} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.y.ticks.stepSize).toBe(10);
    });
    it('should not set stepSize when yStepSize is not provided', () => {
      render(<SimpleBarChart data={mockData} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.scales.y.ticks.stepSize).toBeUndefined();
    });
  });

  describe('Props Validation - dataTestId', () => {
    it('should apply data-testid when dataTestId prop is provided', () => {
      render(<SimpleBarChart data={mockData} dataTestId="my-chart" />);
      expect(screen.getByTestId('my-chart')).toBeInTheDocument();
    });
    it('should not apply data-testid when dataTestId is not provided', () => {
      const { container } = render(<SimpleBarChart data={mockData} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveAttribute('data-testid');
    });
  });

  describe('Props Validation - layoutPadding', () => {
    it('should apply custom layoutPadding', () => {
      const padding = { top: 25, left: 0, bottom: 0 };
      render(<SimpleBarChart data={mockData} layoutPadding={padding} />);
      const calls = (Bar as jest.Mock).mock.calls[0][0];
      expect(calls.options.layout.padding).toEqual(padding);
    });
  });
});

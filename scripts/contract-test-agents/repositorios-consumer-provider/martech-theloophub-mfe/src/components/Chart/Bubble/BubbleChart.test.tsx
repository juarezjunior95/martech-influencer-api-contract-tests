import React from 'react';
import { Bubble } from 'react-chartjs-2';

import { render, screen } from '@testing-library/react';

import { BubbleChart } from './BubbleChart';
import { Label } from './components/Label/Label';
import { getChartOptions } from './configs/chartOptions';
import { getPlugins } from './configs/plugins';
import { BubbleChartData } from './types';
import { generateDatasets } from './utils/utils';

jest.mock('react-chartjs-2', () => ({
  Bubble: jest.fn(() => <div data-testid="bubble-chart">BubbleChart</div>),
}));

jest.mock('components', () => ({
  VariationCaption: jest.fn(() => (
    <div data-testid="variation-caption">Caption</div>
  )),
}));

jest.mock('./components/Label/Label', () => ({
  Label: jest.fn(() => <div data-testid="label">Label</div>),
}));

jest.mock('./utils/utils', () => ({
  generateDatasets: jest.fn((data) => [
    {
      data: data.datasets[0]?.bubbles.map((b, i) => ({
        ...b,
        x: i,
      })),
    },
  ]),
}));

jest.mock('./configs/chartOptions', () => ({
  getChartOptions: jest.fn(() => ({ responsive: true })),
}));

jest.mock('./configs/plugins', () => ({
  getPlugins: jest.fn(() => []),
}));

describe('BubbleChart Component', () => {
  const mockData: BubbleChartData = {
    yAxis: {
      min: 0,
      max: 100,
    },
    info: {
      label: 'Test Chart',
    },
    backgroundChart: {
      backgrounds: [
        { from: 0, to: 50, color: '#FF0000' },
        { from: 50, to: 100, color: '#00FF00' },
      ],
    },
    label: [{ text: 'Label 1' }, { text: 'Label 2' }],
    caption: {
      title: 'Test Caption',
      subtitle: 'Test Subtitle',
      data: [
        { color: '#FF0000', value: '50', unit_of_measure: '%' },
        { color: '#00FF00', value: '50', unit_of_measure: '%' },
      ],
    },
    datasets: [
      {
        bubbles: [
          {
            y: 25,
            r: 10,
            tooltip: 'Bubble 1',
            backgroundColor: '#FF0000',
          },
          {
            y: 75,
            r: 15,
            tooltip: 'Bubble 2',
            backgroundColor: '#00FF00',
          },
        ],
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the Bubble chart component', () => {
      render(<BubbleChart data={mockData} />);

      expect(screen.getByTestId('bubble-chart')).toBeInTheDocument();
      expect(Bubble).toHaveBeenCalled();
    });

    it('should render Label component', () => {
      render(<BubbleChart data={mockData} />);

      expect(screen.getByTestId('label')).toBeInTheDocument();
    });

    it('should render VariationCaption component', () => {
      render(<BubbleChart data={mockData} />);

      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();
    });

    it('should render chart container', () => {
      const { container } = render(<BubbleChart data={mockData} />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Props Validation - Data Structure', () => {
    it('should pass correct datasets to Bubble component', () => {
      render(<BubbleChart data={mockData} />);

      const calls = (Bubble as jest.Mock).mock.calls[0][0];
      expect(calls.data.datasets).toBeDefined();
      expect(Array.isArray(calls.data.datasets)).toBe(true);
    });

    it('should pass chart options to Bubble component', () => {
      render(<BubbleChart data={mockData} />);

      const calls = (Bubble as jest.Mock).mock.calls[0][0];
      expect(calls.options).toBeDefined();
    });

    it('should pass plugins to Bubble component', () => {
      render(<BubbleChart data={mockData} />);

      const calls = (Bubble as jest.Mock).mock.calls[0][0];
      expect(calls.plugins).toBeDefined();
    });
  });

  describe('Props Validation - Y-Axis Configuration', () => {
    it('should handle yAxis max value greater than or equal to 100', () => {
      const dataWithLargeMax = {
        ...mockData,
        yAxis: { min: 0, max: 150 },
      };

      const { container } = render(<BubbleChart data={dataWithLargeMax} />);
      const chartBottom = container.querySelector(
        '[style*="padding"]',
      ) as HTMLElement;

      expect(chartBottom?.style.paddingLeft).toBe('7px');
    });

    it('should handle yAxis max value less than 100', () => {
      const dataWithSmallMax = {
        ...mockData,
        yAxis: { min: 0, max: 50 },
      };

      const { container } = render(<BubbleChart data={dataWithSmallMax} />);
      const chartBottom = container.querySelector(
        '[style*="padding"]',
      ) as HTMLElement;

      expect(chartBottom?.style.paddingLeft).toBe('0px');
    });
  });

  describe('Props Validation - Caption Configuration', () => {
    it('should pass caption data to VariationCaption', () => {
      render(<BubbleChart data={mockData} />);

      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();
    });

    it('should calculate gridColumnsCount based on datasets length', () => {
      const dataWithMultipleDatasets = {
        ...mockData,
        datasets: [
          {
            bubbles: [
              { y: 25, r: 10, tooltip: 'B1', backgroundColor: '#FF0000' },
            ],
          },
          {
            bubbles: [
              { y: 50, r: 12, tooltip: 'B2', backgroundColor: '#00FF00' },
            ],
          },
          {
            bubbles: [
              { y: 75, r: 14, tooltip: 'B3', backgroundColor: '#0000FF' },
            ],
          },
        ],
      };

      render(<BubbleChart data={dataWithMultipleDatasets} />);

      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();
    });
  });

  describe('Props Validation - Labels', () => {
    it('should pass labels to Label component', () => {
      render(<BubbleChart data={mockData} />);

      expect(Label).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: mockData.label,
        }),
        {},
      );
    });

    it('should handle empty labels array', () => {
      const dataWithoutLabels = {
        ...mockData,
        label: [],
      };

      render(<BubbleChart data={dataWithoutLabels} />);

      expect(screen.getByTestId('label')).toBeInTheDocument();
    });

    it('should handle undefined labels', () => {
      const dataWithoutLabels = {
        ...mockData,
        label: undefined,
      };

      render(<BubbleChart data={dataWithoutLabels} />);

      expect(screen.getByTestId('label')).toBeInTheDocument();
    });
  });

  describe('Props Validation - Background Chart', () => {
    it('should handle backgroundChart with borders', () => {
      const dataWithBorder = {
        ...mockData,
        backgroundChart: {
          ...mockData.backgroundChart,
          borderColorBubbleHover: '#000000',
        },
      };

      render(<BubbleChart data={dataWithBorder} />);

      expect(Bubble).toHaveBeenCalled();
    });

    it('should handle backgroundChart without border color', () => {
      const dataWithoutBorder = {
        ...mockData,
        backgroundChart: {
          backgrounds: mockData.backgroundChart.backgrounds,
        },
      };

      render(<BubbleChart data={dataWithoutBorder} />);

      expect(Bubble).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty datasets array', () => {
      const emptyData = {
        ...mockData,
        datasets: [],
      };

      render(<BubbleChart data={emptyData} />);

      expect(screen.getByTestId('bubble-chart')).toBeInTheDocument();
    });

    it('should handle single bubble in dataset', () => {
      const singleBubbleData = {
        ...mockData,
        datasets: [
          {
            bubbles: [
              { y: 50, r: 10, tooltip: 'Single', backgroundColor: '#FF0000' },
            ],
          },
        ],
      };

      render(<BubbleChart data={singleBubbleData} />);

      expect(Bubble).toHaveBeenCalled();
    });

    it('should handle bubbles with zero radius', () => {
      const zeroBubbleData = {
        ...mockData,
        datasets: [
          {
            bubbles: [
              { y: 50, r: 0, tooltip: 'Zero', backgroundColor: '#FF0000' },
            ],
          },
        ],
      };

      render(<BubbleChart data={zeroBubbleData} />);

      expect(Bubble).toHaveBeenCalled();
    });

    it('should handle yAxis with min equal to max', () => {
      const equalAxisData = {
        ...mockData,
        yAxis: { min: 50, max: 50 },
      };

      render(<BubbleChart data={equalAxisData} />);

      expect(Bubble).toHaveBeenCalled();
    });

    it('should handle multiple datasets', () => {
      const multiDatasetData = {
        ...mockData,
        datasets: [
          {
            bubbles: [
              { y: 25, r: 10, tooltip: 'B1', backgroundColor: '#FF0000' },
            ],
          },
          {
            bubbles: [
              { y: 50, r: 15, tooltip: 'B2', backgroundColor: '#00FF00' },
            ],
          },
          {
            bubbles: [
              { y: 75, r: 20, tooltip: 'B3', backgroundColor: '#0000FF' },
            ],
          },
        ],
      };

      render(<BubbleChart data={multiDatasetData} />);

      expect(Bubble).toHaveBeenCalled();
    });

    it('should handle bubbles with custom point styles', () => {
      const customStyleData = {
        ...mockData,
        datasets: [
          {
            bubbles: [
              {
                y: 50,
                r: 10,
                tooltip: 'Custom',
                backgroundColor: '#FF0000',
                pointStyle: 'triangle',
              },
            ],
          },
        ],
      };

      render(<BubbleChart data={customStyleData} />);

      expect(Bubble).toHaveBeenCalled();
    });

    it('should handle bubbles with hover colors', () => {
      const hoverColorData = {
        ...mockData,
        datasets: [
          {
            bubbles: [
              {
                y: 50,
                r: 10,
                tooltip: 'Hover',
                backgroundColor: '#FF0000',
                hoverBackgroundColor: '#00FF00',
              },
            ],
          },
        ],
      };

      render(<BubbleChart data={hoverColorData} />);

      expect(Bubble).toHaveBeenCalled();
    });
  });

  describe('Behavior Assertions', () => {
    it('should call generateDatasets with correct data', () => {
      render(<BubbleChart data={mockData} />);

      expect(generateDatasets).toHaveBeenCalledWith(mockData);
    });

    it('should call getChartOptions with correct data', () => {
      render(<BubbleChart data={mockData} />);

      expect(getChartOptions).toHaveBeenCalledWith(mockData);
    });

    it('should call getPlugins with correct data', () => {
      render(<BubbleChart data={mockData} />);

      expect(getPlugins).toHaveBeenCalledWith(mockData);
    });
  });

  describe('Layout and Structure', () => {
    it('should have correct container structure', () => {
      const { container } = render(<BubbleChart data={mockData} />);

      // Should have chart container and bottom section
      const children = container.firstChild?.childNodes;
      expect(children?.length).toBeGreaterThan(0);
    });

    it('should render chart and bottom section', () => {
      render(<BubbleChart data={mockData} />);

      expect(screen.getByTestId('bubble-chart')).toBeInTheDocument();
      expect(screen.getByTestId('label')).toBeInTheDocument();
      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();
    });
  });
});

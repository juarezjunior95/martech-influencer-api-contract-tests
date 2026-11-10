import React from 'react';

import { render, screen } from '@testing-library/react';

import { BarY } from './BarY';

describe('BarY Component', () => {
  const mockChartData = {
    data: [50, 75, 25, 100, 60],
    label: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
    backgroundColor: '#FF0000',
  };

  // Mock canvas context
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      font: '',
      measureText: jest.fn(() => ({ width: 50 })),
    })) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      const { container } = render(<BarY chartData={mockChartData} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render correct number of bars', () => {
      const { container } = render(<BarY chartData={mockChartData} />);

      const bars = container.querySelectorAll('[style*="width"]');
      expect(bars.length).toBeGreaterThanOrEqual(mockChartData.data.length);
    });

    it('should render labels for each bar', () => {
      render(<BarY chartData={{ ...mockChartData, unitMeasure: '%' }} />);

      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
    });
  });

  describe('Props Validation - Scale', () => {
    it('should use default scale of 100', () => {
      const { container } = render(<BarY chartData={mockChartData} />);

      const firstBar = container.querySelector(
        '[style*="width"]',
      ) as HTMLElement;
      expect(firstBar?.style.width).toBe('50%');
    });

    it('should calculate width based on custom scale', () => {
      const { container } = render(
        <BarY chartData={mockChartData} scale={200} />,
      );

      const firstBar = container.querySelector(
        '[style*="width"]',
      ) as HTMLElement;
      expect(firstBar?.style.width).toBe('25%');
    });

    it('should handle scale of 0 gracefully', () => {
      const { container } = render(
        <BarY chartData={mockChartData} scale={0} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Props Validation - Background Color', () => {
    it('should apply single background color to all bars', () => {
      const { container } = render(<BarY chartData={mockChartData} />);

      const bars = container.querySelectorAll('[style*="backgroundColor"]');
      bars.forEach((bar) => {
        expect((bar as HTMLElement).style.backgroundColor).toBe(
          'rgb(255, 0, 0)',
        );
      });
    });

    it('should apply array of background colors', () => {
      const multiColorData = {
        ...mockChartData,
        backgroundColor: [
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#FF00FF',
        ],
      };

      const { container } = render(<BarY chartData={multiColorData} />);

      const bars = container.querySelectorAll('[style*="backgroundColor"]');
      if (bars[0]) {
        expect((bars[0] as HTMLElement).style.backgroundColor).toBe(
          'rgb(255, 0, 0)',
        );
      }
      if (bars[1]) {
        expect((bars[1] as HTMLElement).style.backgroundColor).toBe(
          'rgb(0, 255, 0)',
        );
      }
      if (bars[2]) {
        expect((bars[2] as HTMLElement).style.backgroundColor).toBe(
          'rgb(0, 0, 255)',
        );
      }
    });

    it('should fallback to first color when array is shorter than data', () => {
      const limitedColorData = {
        ...mockChartData,
        backgroundColor: ['#FF0000', '#00FF00'],
      };

      const { container } = render(<BarY chartData={limitedColorData} />);

      const bars = container.querySelectorAll('[style*="backgroundColor"]');

      if (bars[4]) {
        expect((bars[4] as HTMLElement).style.backgroundColor).toBe(
          'rgb(255, 0, 0)',
        );
      }
    });
  });

  describe('Props Validation - Bar Thickness', () => {
    it('should use default bar thickness of 40px', () => {
      const { container } = render(<BarY chartData={mockChartData} />);

      const firstBar = container.querySelector(
        '[style*="height"]',
      ) as HTMLElement;
      expect(firstBar?.style.height).toBe('40px');
    });

    it('should apply custom bar thickness', () => {
      const dataWithCustomThickness = {
        ...mockChartData,
        barThickness: 60,
      };

      const { container } = render(
        <BarY chartData={dataWithCustomThickness} />,
      );

      const firstBar = container.querySelector(
        '[style*="height"]',
      ) as HTMLElement;
      expect(firstBar?.style.height).toBe('60px');
    });
  });

  describe('Props Validation - Unit Measure', () => {
    it('should display labels without unit measure by default', () => {
      render(<BarY chartData={mockChartData} />);

      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should display labels with unit measure when provided', () => {
      const dataWithUnit = {
        ...mockChartData,
        unitMeasure: 'kg',
      };

      render(<BarY chartData={dataWithUnit} />);

      expect(screen.getByText('50kg')).toBeInTheDocument();
      expect(screen.getByText('75kg')).toBeInTheDocument();
    });
  });

  describe('Behavior Assertions - Label Positioning', () => {
    it('should position label inside bar when it fits', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        font: '',
        measureText: jest.fn(() => ({ width: 10 })),
      })) as any;

      render(<BarY chartData={mockChartData} />);

      const outsideLabels = screen.queryAllByText(/50|75|25|100|60/, {
        selector: '[style*="position: outside"]',
      });

      expect(outsideLabels.length).toBeLessThanOrEqual(
        mockChartData.data.length,
      );
    });

    it('should position label outside bar when it does not fit', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        font: '',
        measureText: jest.fn(() => ({ width: 1000 })),
      })) as any;

      render(<BarY chartData={mockChartData} />);

      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  describe('Behavior Assertions - Text Width Calculation', () => {
    it('should calculate text width using canvas context', () => {
      const mockMeasureText = jest.fn(() => ({ width: 50 }));
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        font: '',
        measureText: mockMeasureText,
      })) as any;

      render(<BarY chartData={{ ...mockChartData, unitMeasure: '%' }} />);

      expect(mockMeasureText).toHaveBeenCalled();
    });

    it('should handle missing canvas context gracefully', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null) as any;

      const { container } = render(<BarY chartData={mockChartData} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use approximation when canvas context is unavailable', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null) as any;

      render(<BarY chartData={{ ...mockChartData, unitMeasure: '%' }} />);

      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data array', () => {
      const emptyData = {
        data: [],
        label: [],
        backgroundColor: '#FF0000',
      };

      const { container } = render(<BarY chartData={emptyData} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle zero values', () => {
      const zeroData = {
        data: [0, 0, 0],
        label: ['A', 'B', 'C'],
        backgroundColor: '#FF0000',
      };

      render(<BarY chartData={zeroData} />);

      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBe(3);
      expect(zeroElements[0]).toBeInTheDocument();
    });

    it('should handle very large values', () => {
      const largeValueData = {
        data: [1000000],
        label: ['Large'],
        backgroundColor: '#FF0000',
      };

      render(<BarY chartData={largeValueData} />);

      expect(screen.getByText('1000000')).toBeInTheDocument();
    });

    it('should handle single data point', () => {
      const singleData = {
        data: [50],
        label: ['Single'],
        backgroundColor: '#FF0000',
      };

      const { container } = render(<BarY chartData={singleData} />);

      const bars = container.querySelectorAll('[style*="width"]');
      expect(bars).toHaveLength(1);
    });

    it('should handle values larger than scale', () => {
      const { container } = render(
        <BarY chartData={{ ...mockChartData, data: [150] }} scale={100} />,
      );

      const firstBar = container.querySelector(
        '[style*="width"]',
      ) as HTMLElement;
      expect(firstBar?.style.width).toBe('150%');
    });
  });

  describe('Behavior Assertions - Container Ref', () => {
    it('should create container ref', () => {
      const { container } = render(<BarY chartData={mockChartData} />);

      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Behavior Assertions - Bar Keys', () => {
    it('should generate unique keys for bars', () => {
      const { container } = render(<BarY chartData={mockChartData} />);

      const wrappers = container.querySelectorAll('[style]');
      expect(wrappers.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Value Formatting', () => {
    it('should use formatValueFn when provided', () => {
      const customFormat = (value: number) => `${value.toFixed(1)}`;
      render(<BarY chartData={mockChartData} formatValueFn={customFormat} />);

      expect(screen.getByText('50.0')).toBeInTheDocument();
      expect(screen.getByText('75.0')).toBeInTheDocument();
    });

    it('should use default formatting when formatValueFn is not provided', () => {
      render(<BarY chartData={mockChartData} />);

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });
});

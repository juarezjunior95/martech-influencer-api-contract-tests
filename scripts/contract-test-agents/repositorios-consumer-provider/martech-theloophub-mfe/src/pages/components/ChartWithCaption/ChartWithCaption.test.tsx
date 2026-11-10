import React from 'react';

import { render, screen } from '@testing-library/react';
import { Legend, VariationCaption } from 'components';
import { getVariationColor } from 'utils/getColor';

import { mockChartData } from './__mocks/chartData';
import { ChartWithCaption } from './ChartWithCaption';
import { ChartData } from './types';

jest.mock('components', () => ({
  Legend: jest.fn(({ caption, dataTestId }: any) => (
    <div data-testid={dataTestId}>{caption.length} legends</div>
  )),
  VariationCaption: jest.fn(({ variationCaptionData, dataTestId }: any) => (
    <div data-testid={dataTestId}>{variationCaptionData?.length} rows</div>
  )),
}));

jest.mock('utils/getColor', () => ({
  getVariationColor: jest.fn(() => 'green'),
}));

const MockChartComponent = jest.fn(({ datasets, labels, dataTestId }: any) => (
  <div data-testid={dataTestId}>
    {datasets.length} datasets - {labels.length} labels
  </div>
));

describe('ChartWithCaption', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="test"
        />,
      );

      expect(screen.getByTestId('test-chart')).toBeInTheDocument();
    });

    it('should not render anything if chartData is undefined', () => {
      const { container } = render(
        <ChartWithCaption chartComponent={MockChartComponent} />,
      );
      expect(container.firstChild).toBeNull();
    });

    it('should not render anything if chartData is null', () => {
      const { container } = render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={null as unknown as ChartData}
        />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Data TestId', () => {
    it('should render with data-testid when provided', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="test"
        />,
      );

      // Main container
      expect(screen.getByTestId('chart-caption-test')).toBeInTheDocument();

      // Legend
      expect(screen.getByTestId('test-legend')).toBeInTheDocument();

      // Chart
      expect(screen.getByTestId('test-chart')).toBeInTheDocument();

      // VariationCaption
      expect(screen.getByTestId('test-caption')).toBeInTheDocument();
    });

    it('should render without data-testid when not provided', () => {
      const { container } = render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      const elementsWithDataTestId =
        container.querySelectorAll('[data-testid]');
      expect(elementsWithDataTestId.length).toBe(0);
    });

    it('should pass dataTestId to Legend when provided', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="custom"
        />,
      );

      expect(Legend).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'custom-legend',
        }),
        expect.anything(),
      );
    });

    it('should pass dataTestId to ChartComponent when provided', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="custom"
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'custom-chart',
        }),
        expect.anything(),
      );
    });

    it('should pass dataTestId to VariationCaption when provided', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="custom"
        />,
      );

      expect(VariationCaption).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'custom-caption',
        }),
        expect.anything(),
      );
    });
  });

  describe('Legend', () => {
    it('should render Legend when chartLegend exists and has items', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="test"
        />,
      );
      expect(screen.getByTestId('test-legend')).toHaveTextContent('2 legends');
    });

    it('should not render Legend when chartLegend is empty', () => {
      const dataWithoutLegend: ChartData = {
        ...mockChartData,
        chartLegend: [],
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithoutLegend}
          dataTestId="test"
        />,
      );

      expect(screen.queryByTestId('test-legend')).not.toBeInTheDocument();
    });

    it('should not render Legend when chartLegend is undefined', () => {
      const dataWithoutLegend: ChartData = {
        ...mockChartData,
        chartLegend: undefined,
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithoutLegend}
          dataTestId="test"
        />,
      );

      expect(screen.queryByTestId('test-legend')).not.toBeInTheDocument();
    });

    it('should pass correct props to Legend', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(Legend).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: mockChartData.chartLegend,
          legendPosition: 'right',
        }),
        expect.anything(),
      );
    });
  });

  describe('ChartComponent Props', () => {
    it('should pass datasets and labels to ChartComponent', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="test"
        />,
      );

      const chart = screen.getByTestId('test-chart');
      expect(chart).toHaveTextContent('1 datasets');
      expect(chart).toHaveTextContent('2 labels');
    });

    it('should pass default barThickness to ChartComponent', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              barThickness: 32,
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should pass custom barThickness to ChartComponent', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          barThickness={50}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              barThickness: 50,
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should pass comparison_data as roundedArrow', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          roundedArrow: mockChartData.comparison_data,
        }),
        expect.anything(),
      );
    });

    it('should pass tooltip prop to ChartComponent', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          tooltip={true}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          tooltip: true,
        }),
        expect.anything(),
      );
    });

    it('should pass tooltip as false by default', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          tooltip: false,
        }),
        expect.anything(),
      );
    });

    it('should pass options prop to ChartComponent', () => {
      const customOptions = { responsive: true, maintainAspectRatio: false };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          options={customOptions}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          options: customOptions,
        }),
        expect.anything(),
      );
    });

    it('should pass datalabelWithVariation prop to ChartComponent', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          datalabelWithVariation={false}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datalabelWithVariation: false,
        }),
        expect.anything(),
      );
    });

    it('should pass datalabelWithVariation as true by default', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datalabelWithVariation: true,
        }),
        expect.anything(),
      );
    });

    it('should use paddingTop from chartData if provided', () => {
      const dataWithPaddingTop: ChartData = {
        ...mockChartData,
        paddingTop: 100,
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithPaddingTop}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          paddingTop: 100,
        }),
        expect.anything(),
      );
    });

    it('should use default paddingTop of 80 if not provided in chartData', () => {
      const dataWithoutPaddingTop: ChartData = {
        ...mockChartData,
        paddingTop: undefined,
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithoutPaddingTop}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          paddingTop: 80,
        }),
        expect.anything(),
      );
    });

    it('should use backgroundColor from chartData when available', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              backgroundColor: mockChartData.backgroundColor,
            }),
          ]),
        }),
        expect.anything(),
      );
    });
  });

  describe('VariationCaption', () => {
    it('should render VariationCaption with correct number of rows', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          dataTestId="test"
        />,
      );
      expect(screen.getByTestId('test-caption')).toHaveTextContent('1 rows');
    });

    it('should pass correct props to VariationCaption', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(VariationCaption).toHaveBeenCalledWith(
        expect.objectContaining({
          gridColumnsCount: 2,
          paddingLeft: 42,
          paddingRight: 0,
          headerMarginLeft: -26,
          columnGap: 0,
          rowGap: 0,
        }),
        expect.anything(),
      );
    });

    it('should pass custom padding props to VariationCaption', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          paddingLeft={100}
          paddingRight={50}
          headerMarginLeft={10}
          columnGap={8}
        />,
      );

      expect(VariationCaption).toHaveBeenCalledWith(
        expect.objectContaining({
          paddingLeft: 100,
          paddingRight: 50,
          headerMarginLeft: 10,
          columnGap: 8,
        }),
        expect.anything(),
      );
    });

    it('should call getVariationColor for each variation', () => {
      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      expect(getVariationColor).toHaveBeenCalledWith('down');
    });

    it('should handle empty variationsGroup gracefully', () => {
      const dataWithEmptyVariations: ChartData = {
        ...mockChartData,
        variation_caption: {
          title: 'Comparison',
          subtitle: 'vs LY',
          variationsRows: {
            kpi: {
              data: [
                {
                  variationsGroup: null,
                },
              ],
            },
          },
        },
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithEmptyVariations}
          dataTestId="test"
        />,
      );

      expect(screen.getByTestId('test-caption')).toBeInTheDocument();
    });

    it('should use empty string for title when row value title is "empty"', () => {
      const dataWithEmptyTitle: ChartData = {
        ...mockChartData,
        variation_caption: {
          title: 'Comparison',
          subtitle: 'vs LY',
          variationsRows: {
            kpi: {
              title: 'empty',
              data: [
                {
                  variationsGroup: [
                    {
                      variation: -0.6,
                      direction: 'down',
                      unit_of_measure: 'pp',
                    },
                  ],
                },
              ],
            },
          },
        },
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithEmptyTitle}
        />,
      );

      expect(VariationCaption).toHaveBeenCalledWith(
        expect.objectContaining({
          variationCaptionData: expect.arrayContaining([
            expect.objectContaining({
              label: '\u200B',
            }),
          ]),
        }),
        expect.anything(),
      );
    });
  });

  describe('Default Props', () => {
    it('should use default height of 294px', () => {
      const { container } = render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
        />,
      );

      const chartContainer = container.querySelector(
        '[style*="height: 294px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });

    it('should use custom height when provided', () => {
      const { container } = render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={mockChartData}
          height="400px"
        />,
      );

      const chartContainer = container.querySelector(
        '[style*="height: 400px"]',
      );
      expect(chartContainer).toBeInTheDocument();
    });
  });

  describe('Dataset Mapping', () => {
    it('should handle datasets without optional properties', () => {
      const minimalData: ChartData = {
        ...mockChartData,
        datasets: [
          {
            data: [10, 20],
            type: 'bar',
            label: 'Minimal',
          },
        ],
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={minimalData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              data: [10, 20],
              label: 'Minimal',
              type: 'bar',
              borderColor: [],
            }),
          ]),
        }),
        expect.anything(),
      );
    });

    it('should handle empty datasets array', () => {
      const emptyDatasetsData: ChartData = {
        ...mockChartData,
        datasets: [],
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={emptyDatasetsData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: [],
        }),
        expect.anything(),
      );
    });

    it('should handle empty labels array', () => {
      const emptyLabelsData: ChartData = {
        ...mockChartData,
        labels: [],
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={emptyLabelsData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: [],
        }),
        expect.anything(),
      );
    });

    it('should pass formattedData when available in dataset', () => {
      const dataWithFormattedData: ChartData = {
        ...mockChartData,
        datasets: [
          {
            data: [10, 20],
            formattedData: ['10%', '20%'],
            type: 'bar',
            label: 'Formatted',
            backgroundColor: ['#fff'],
          },
        ],
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithFormattedData}
        />,
      );

      expect(MockChartComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              formattedData: ['10%', '20%'],
            }),
          ]),
        }),
        expect.anything(),
      );
    });
  });

  describe('Multiple Variation Rows', () => {
    it('should handle multiple variation rows correctly', () => {
      const dataWithMultipleRows: ChartData = {
        ...mockChartData,
        variation_caption: {
          title: 'Comparison',
          subtitle: 'vs LY',
          variationsRows: {
            row1: {
              title: 'Row 1',
              data: [
                {
                  variationsGroup: [
                    { variation: 1, direction: 'up', unit_of_measure: '%' },
                  ],
                },
              ],
            },
            row2: {
              title: 'Row 2',
              data: [
                {
                  variationsGroup: [
                    { variation: -1, direction: 'down', unit_of_measure: '%' },
                  ],
                },
              ],
            },
          },
        },
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithMultipleRows}
          dataTestId="test"
        />,
      );

      expect(screen.getByTestId('test-caption')).toHaveTextContent('2 rows');
    });

    it('should only show title and subtitle for the first variation row', () => {
      const dataWithMultipleRows: ChartData = {
        ...mockChartData,
        variation_caption: {
          title: 'Main Title',
          subtitle: 'Main Subtitle',
          variationsRows: {
            row1: {
              title: 'Row 1',
              data: [
                {
                  variationsGroup: [
                    { variation: 1, direction: 'up', unit_of_measure: '%' },
                  ],
                },
              ],
            },
            row2: {
              title: 'Row 2',
              data: [
                {
                  variationsGroup: [
                    { variation: -1, direction: 'down', unit_of_measure: '%' },
                  ],
                },
              ],
            },
          },
        },
      };

      render(
        <ChartWithCaption
          chartComponent={MockChartComponent}
          chartData={dataWithMultipleRows}
        />,
      );

      const callArgs = (VariationCaption as jest.Mock).mock.calls[0][0];
      const variationData = callArgs.variationCaptionData;

      expect(variationData[0].title).toBe('Main Title');
      expect(variationData[0].subtitle).toBe('Main Subtitle');
      expect(variationData[1].title).toBe('');
      expect(variationData[1].subtitle).toBe('');
    });
  });
});

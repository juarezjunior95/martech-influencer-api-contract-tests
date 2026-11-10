import React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TableCellType } from '../../../types';
import { ChartRenderer } from './ChartRenderer';

jest.mock('components/Chart', () => ({
  WithStandartDeviation: ({ labels, datasets, min, max, dataTestId }: any) => (
    <div data-testid={dataTestId || 'standart-deviation-chart'}>
      <div data-testid="labels">{JSON.stringify(labels)}</div>
      <div data-testid="datasets">{JSON.stringify(datasets)}</div>
      <div data-testid="min">{min}</div>
      <div data-testid="max">{max}</div>
    </div>
  ),
}));

jest.mock('components/Chart/Bar/Waterfall', () => ({
  Waterfall: ({ size, labels, values, colors, options, dataTestId }: any) => (
    <div data-testid={dataTestId || 'waterfall-chart'}>
      <div data-testid="size">{size}</div>
      <div data-testid="labels">{JSON.stringify(labels)}</div>
      <div data-testid="values">{JSON.stringify(values)}</div>
      <div data-testid="colors">{JSON.stringify(colors)}</div>
      <div data-testid="options">{JSON.stringify(options)}</div>
    </div>
  ),
}));

jest.mock('components/Table/components', () => ({
  SingleBarWithVariation: ({
    chartData,
    variation,
    posKpi,
    columnMaxValue,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'single-bar-chart'}>
      <div data-testid="chart-data">{JSON.stringify(chartData)}</div>
      <div data-testid="variation">{JSON.stringify(variation)}</div>
      <div data-testid="pos-kpi">{posKpi}</div>
      <div data-testid="column-max-value">{columnMaxValue}</div>
    </div>
  ),
}));

describe('ChartRenderer', () => {
  describe('single-bar chart type', () => {
    it('should render SingleBarWithVariation for single-bar type', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100, 200, 300],
          backgroundColor: ['#FF0000'],
          labels: ['Label 1'],
          chartUnitMeasure: '%',
        },
        variation: 10,
        variationMeasure: '%',
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();
    });

    it('should pass correct chartData to SingleBarWithVariation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100, 200, 300],
          backgroundColor: ['#FF0000'],
          labels: ['Label 1'],
          chartUnitMeasure: '%',
        },
        variation: 10,
        variationMeasure: '%',
      };

      render(<ChartRenderer config={config} />);

      const chartData = screen.getByTestId('chart-data');
      expect(chartData).toHaveTextContent('"data":[100,200,300]');
      expect(chartData).toHaveTextContent('"label":["Label 1"]');
      expect(chartData).toHaveTextContent('"unitMeasure":"%"');
    });

    it('should set direction to green when variation is positive', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} />);

      const variation = screen.getByTestId('variation');
      expect(variation).toHaveTextContent('"direction":"green"');
    });

    it('should set direction to red when variation is negative', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: -10,
      };

      render(<ChartRenderer config={config} />);

      const variation = screen.getByTestId('variation');
      expect(variation).toHaveTextContent('"direction":"red"');
    });

    it('should set direction to red when variation is zero', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 0,
      };

      render(<ChartRenderer config={config} />);

      const variation = screen.getByTestId('variation');
      expect(variation).toHaveTextContent('"direction":"red"');
    });

    it('should pass empty string for variationMeasure when not provided', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} />);

      const variation = screen.getByTestId('variation');
      expect(variation).toHaveTextContent('"unitOfMeasure":""');
    });

    it('should pass posKpi to SingleBarWithVariation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} posKpi="test-kpi" />);

      expect(screen.getByTestId('pos-kpi')).toHaveTextContent('test-kpi');
    });

    it('should pass columnMaxValue to SingleBarWithVariation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} columnMaxValue={500} />);

      expect(screen.getByTestId('column-max-value')).toHaveTextContent('500');
    });
  });

  describe('waterfall chart type', () => {
    it('should render Waterfall for waterfall type', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100, 200, -50, 150],
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });

    it('should pass correct props to Waterfall', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100, 200, -50, 150],
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);
      expect(screen.getByTestId('size')).toHaveTextContent('small');
    });

    it('should pass labels to Waterfall', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100, 200],
          labels: ['Label 1', 'Label 2'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      const labels = screen.getByTestId('labels');
      expect(labels).toHaveTextContent('["Label 1","Label 2"]');
    });

    it('should pass values to Waterfall', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100, 200, -50],
          labels: ['Q1', 'Q2', 'Q3'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      const values = screen.getByTestId('values');
      expect(values).toHaveTextContent('[100,200,-50]');
    });

    it('should pass colors to Waterfall', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100],
          labels: ['Q1'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      const colors = screen.getByTestId('colors');
      expect(colors).toHaveTextContent('"first":"#D0D4D7"');
      expect(colors).toHaveTextContent('"last":"#4C5965"');
      expect(colors).toHaveTextContent('"positive":"#49764B"');
      expect(colors).toHaveTextContent('"negative":"#A20A0A"');
    });

    it('should render N/A when waterfall has no data', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: undefined,
          labels: ['Q1'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });

    it('should render N/A when waterfall has no labels', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100],
          labels: undefined,
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.queryByTestId('waterfall-chart')).not.toBeInTheDocument();
    });
  });

  describe('standart-deviation chart type', () => {
    it('should render WithStandartDeviation for standart-deviation type', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100, 110, 120],
          labels: ['Point 1', 'Point 2', 'Point 3'],
          variationMeasure: '%',
          min: 90,
          max: 130,
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(
        screen.getByTestId('standart-deviation-chart'),
      ).toBeInTheDocument();
    });

    it('should pass labels to WithStandartDeviation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100],
          labels: ['Label 1', 'Label 2'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      const labels = screen.getByTestId('labels');
      expect(labels).toHaveTextContent('["Label 1","Label 2"]');
    });

    it('should pass datasets with unitOfMeasure to WithStandartDeviation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100],
          variationMeasure: 'pts',
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      const datasets = screen.getByTestId('datasets');
      expect(datasets).toHaveTextContent('"unitOfMeasure":"pts"');
    });

    it('should set type to null in datasets', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      const datasets = screen.getByTestId('datasets');
      expect(datasets).toHaveTextContent('"type":null');
    });

    it('should pass min value to WithStandartDeviation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100],
          min: 50,
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByTestId('min')).toHaveTextContent('50');
    });

    it('should pass max value to WithStandartDeviation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100],
          max: 200,
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByTestId('max')).toHaveTextContent('200');
    });

    it('should pass all chartData properties to datasets', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100, 110, 120],
          backgroundColor: ['#FF0000'],
          labels: ['A', 'B', 'C'],
          variationMeasure: '%',
        },
      };

      render(<ChartRenderer config={config} />);

      const datasets = screen.getByTestId('datasets');
      expect(datasets).toHaveTextContent('"data":[100,110,120]');
      expect(datasets).toHaveTextContent('"backgroundColor":["#FF0000"]');
    });
  });

  describe('unknown chart type', () => {
    it('should render N/A for unknown chart type', () => {
      const config: TableCellType = {
        chartData: {
          type: 'unknown-type' as any,
          data: [100],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should render N/A when chartData type is undefined', () => {
      const config: TableCellType = {
        chartData: {
          type: undefined as any,
          data: [100],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should render N/A when chartData type is null', () => {
      const config: TableCellType = {
        chartData: {
          type: null as any,
          data: [100],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should render N/A when chartData type is empty string', () => {
      const config: TableCellType = {
        chartData: {
          type: '' as any,
          data: [100],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined posKpi', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} posKpi={undefined} />);

      expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();
    });

    it('should handle undefined columnMaxValue', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} columnMaxValue={undefined} />);

      expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();
    });

    it('should handle very large positive variation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 999999,
      };

      render(<ChartRenderer config={config} />);

      const variation = screen.getByTestId('variation');
      expect(variation).toHaveTextContent('"direction":"green"');
      expect(variation).toHaveTextContent('"variation":999999');
    });

    it('should handle very large negative variation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: -999999,
      };

      render(<ChartRenderer config={config} />);

      const variation = screen.getByTestId('variation');
      expect(variation).toHaveTextContent('"direction":"red"');
      expect(variation).toHaveTextContent('"variation":-999999');
    });

    it('should handle undefined variation', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: undefined,
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();
    });

    it('should return null when single-bar has no finite numeric data', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      const { container } = render(<ChartRenderer config={config} />);

      expect(screen.queryByTestId('single-bar-chart')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });

    it('should handle string data array', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: ['100', '200'] as any,
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();
    });

    it('should handle mixed data types in data array', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100, '200', null, undefined] as any,
          labels: ['A', 'B', 'C', 'D'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} />);

      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });
  });

  describe('re-rendering', () => {
    it('should update when config changes', () => {
      const initialConfig: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      const { rerender } = render(<ChartRenderer config={initialConfig} />);

      expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();

      const newConfig: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100],
          labels: ['Q1'],
          backgroundColor: ['#FF0000'],
        },
      };

      rerender(<ChartRenderer config={newConfig} />);

      expect(screen.queryByTestId('single-bar-chart')).not.toBeInTheDocument();
      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });

    it('should update when switching to N/A', () => {
      const initialConfig: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      const { rerender } = render(<ChartRenderer config={initialConfig} />);

      expect(screen.getByTestId('single-bar-chart')).toBeInTheDocument();

      const newConfig: TableCellType = {
        chartData: {
          type: 'unknown' as any,
          data: [100],
          backgroundColor: ['#FF0000'],
        },
      };

      rerender(<ChartRenderer config={newConfig} />);

      expect(screen.queryByTestId('single-bar-chart')).not.toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('data-testid', () => {
    it('should render single-bar chart with data-testid when provided', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      render(<ChartRenderer config={config} dataTestId="test-chart" />);

      expect(
        screen.getByTestId('chart-single-bar-test-chart'),
      ).toBeInTheDocument();
    });

    it('should render waterfall chart with data-testid when provided', () => {
      const config: TableCellType = {
        chartData: {
          type: 'waterfall',
          data: [100],
          labels: ['Q1'],
          backgroundColor: ['#FF0000'],
        },
      };

      render(<ChartRenderer config={config} dataTestId="test-waterfall" />);

      expect(
        screen.getByTestId('chart-waterfall-test-waterfall'),
      ).toBeInTheDocument();
    });

    it('should render standart-deviation chart with data-testid when provided', () => {
      const config: TableCellType = {
        chartData: {
          type: 'standart-deviation',
          data: [100],
          labels: ['Q1'],
          backgroundColor: ['#FF0000'],
          min: 0,
          max: 200,
          variationMeasure: '%',
        },
      };

      render(<ChartRenderer config={config} dataTestId="test-deviation" />);

      expect(
        screen.getByTestId('chart-standart-deviation-test-deviation'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when not provided', () => {
      const config: TableCellType = {
        chartData: {
          type: 'single-bar',
          data: [100],
          backgroundColor: ['#FF0000'],
        },
        variation: 10,
      };

      const { container } = render(<ChartRenderer config={config} />);

      // Should not have custom chart-single-bar-*, chart-waterfall-*, etc.
      expect(
        container.querySelector('[data-testid^="chart-single-bar-"]'),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-testid^="chart-waterfall-"]'),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-testid^="chart-standart-deviation-"]'),
      ).not.toBeInTheDocument();
    });
  });
});

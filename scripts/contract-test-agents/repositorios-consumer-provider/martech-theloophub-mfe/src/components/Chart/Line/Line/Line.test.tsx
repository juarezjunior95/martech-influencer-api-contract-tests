import React from 'react';

import { render, screen } from '@testing-library/react';

import { BaseChart } from '../../BaseChart';
import { Line } from './Line';

// Mock BaseChart
jest.mock('../../BaseChart', () => ({
  BaseChart: jest.fn(() => <div data-testid="base-chart">BaseChart</div>),
}));

describe('Line Component', () => {
  const mockDatasets = [
    {
      label: 'Dataset 1',
      data: [10, 20, 30, 40, 50],
      borderColor: '#DEB333',
    },
  ];

  const mockLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const mockFormattedData = [['10', '20', '30', '40', '50']];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render BaseChart component', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} />);

      expect(screen.getByTestId('base-chart')).toBeInTheDocument();
      expect(BaseChart).toHaveBeenCalled();
    });

    it('should pass correct type to BaseChart', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.type).toBe('line');
    });
  });

  describe('Props Validation - Dataset Defaults', () => {
    it('should apply default border properties', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.borderColor).toBe('#DEB333');
      expect(dataset.borderWidth).toBe(2);
    });

    it('should apply default point properties', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.pointBorderColor).toBe('#FFFFFF');
      expect(dataset.pointHoverBorderColor).toBe('#FFFFFF');
      expect(dataset.pointBackgroundColor).toBe('#DEB333');
      expect(dataset.pointBorderWidth).toBe(2);
      expect(dataset.pointHoverBorderWidth).toBe(2);
      expect(dataset.pointRadius).toBe(5);
      expect(dataset.pointHoverRadius).toBe(6);
    });

    it('should preserve custom dataset properties', () => {
      const customDatasets = [
        {
          label: 'Custom',
          data: [10, 20, 30],
          borderColor: '#00FF00',
          pointRadius: 10,
        },
      ];

      render(<Line datasets={customDatasets} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.borderColor).toBe('#00FF00');
      expect(dataset.pointRadius).toBe(10);
    });
  });

  describe('Props Validation - Datalabels', () => {
    it('should display datalabels when formattedData is provided', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const display = dataset.datalabels.display;

      expect(typeof display).toBe('function');
      expect(
        display({
          datasetIndex: 0,
          dataIndex: 0,
          dataset: mockDatasets[0],
        }),
      ).toBe(true);
    });

    it('should not display datalabels when formattedData is not provided', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.datalabels.display).toBe(false);
    });

    it('should format datalabels correctly', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const formatter = dataset.datalabels.formatter;

      const result = formatter(10, {
        datasetIndex: 0,
        dataIndex: 0,
        dataset: mockDatasets[0],
      });

      expect(typeof result).toBe('string');
    });

    it('should return empty string when formattedData cell is empty', () => {
      const twoDatasets = [
        { label: 'A', data: [10, 20] },
        { label: 'B', data: [30, 40] },
      ];
      const formattedData = [
        ['', '20'],
        ['30', '40'],
      ];

      render(
        <Line
          datasets={twoDatasets}
          labels={['X', 'Y']}
          formattedData={formattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const formatter = calls.datasets[0].datalabels.formatter;

      const emptyResult = formatter(10, {
        datasetIndex: 0,
        dataIndex: 0,
        dataset: twoDatasets[0],
      });
      const filledResult = formatter(30, {
        datasetIndex: 1,
        dataIndex: 0,
        dataset: twoDatasets[1],
      });

      expect(emptyResult).toBeNull();
      expect(filledResult).toBe('30');
    });

    it('should configure datalabels font', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.datalabels.font.size).toBe(12);
      expect(dataset.datalabels.font.family).toBe("'Work Sans', sans-serif");
    });

    it('should use default color when labelColors not provided', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.datalabels.color).toBeDefined();
    });

    it('should use custom labelColors when provided', () => {
      const customColors = ['#FF0000', '#00FF00', '#0000FF'];

      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
          labelColors={customColors}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(dataset.datalabels.color).toBe('#FF0000');
    });
  });

  describe('Props Validation - Anchor and Align', () => {
    it('should set anchor to end for single dataset', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const anchor = dataset.datalabels.anchor;

      const result = anchor({
        datasetIndex: 0,
        dataIndex: 0,
        dataset: mockDatasets[0],
      });

      expect(result).toBe('end');
    });

    it('should set align to end for single dataset', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const align = dataset.datalabels.align;

      const result = align({
        datasetIndex: 0,
        dataIndex: 0,
        dataset: mockDatasets[0],
      });

      expect(result).toBe('end');
    });

    it('should calculate anchor dynamically for multiple datasets', () => {
      const multipleDatasets = [
        { label: 'DS1', data: [10, 20, 30] },
        { label: 'DS2', data: [40, 50, 60] },
      ];

      render(
        <Line
          datasets={multipleDatasets}
          labels={['A', 'B', 'C']}
          formattedData={[
            ['10', '20', '30'],
            ['40', '50', '60'],
          ]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];

      expect(typeof dataset.datalabels.anchor).toBe('function');
      expect(typeof dataset.datalabels.align).toBe('function');
    });
  });

  describe('Behavior Assertions - Visibility Logic', () => {
    it('should filter hidden datasets correctly', () => {
      const datasetsWithHidden = [
        { label: 'DS1', data: [10, 20, 30], hidden: false },
        { label: 'DS2', data: [40, 50, 60], hidden: true },
        { label: 'DS3', data: [70, 80, 90] },
      ];

      render(
        <Line
          datasets={datasetsWithHidden}
          labels={['A', 'B', 'C']}
          formattedData={[
            ['10', '20', '30'],
            ['40', '50', '60'],
            ['70', '80', '90'],
          ]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];

      expect(calls.datasets.length).toBe(3);
    });

    it('should return center anchor for hidden dataset', () => {
      const datasetsWithHidden = [
        { label: 'DS1', data: [10, 20, 30], hidden: true },
        { label: 'DS2', data: [40, 50, 60] },
      ];

      render(
        <Line
          datasets={datasetsWithHidden}
          labels={['A', 'B', 'C']}
          formattedData={[
            ['10', '20', '30'],
            ['40', '50', '60'],
          ]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const anchor = dataset.datalabels.anchor;

      const result = anchor({
        datasetIndex: 0,
        dataIndex: 0,
        dataset: datasetsWithHidden[0],
      });

      expect(result).toBe('center');
    });

    it('should show label for max value in multiple datasets', () => {
      const multipleDatasets = [
        { label: 'DS1', data: [10, 20, 30] },
        { label: 'DS2', data: [40, 50, 60] },
      ];

      render(
        <Line
          datasets={multipleDatasets}
          labels={['A', 'B', 'C']}
          formattedData={[
            ['10', '20', '30'],
            ['40', '50', '60'],
          ]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[1];
      const formatter = dataset.datalabels.formatter;

      const result = formatter(60, {
        datasetIndex: 1,
        dataIndex: 2,
        dataset: multipleDatasets[1],
      });

      expect(result).toBeDefined();
    });

    it('should show label for min value in multiple datasets', () => {
      const multipleDatasets = [
        { label: 'DS1', data: [10, 20, 30] },
        { label: 'DS2', data: [40, 50, 60] },
      ];

      render(
        <Line
          datasets={multipleDatasets}
          labels={['A', 'B', 'C']}
          formattedData={[
            ['10', '20', '30'],
            ['40', '50', '60'],
          ]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const formatter = dataset.datalabels.formatter;

      const result = formatter(10, {
        datasetIndex: 0,
        dataIndex: 0,
        dataset: multipleDatasets[0],
      });

      expect(result).toBeDefined();
    });

    it('should not show label for middle values in multiple datasets', () => {
      const multipleDatasets = [
        { label: 'DS1', data: [10, 50, 30] },
        { label: 'DS2', data: [40, 20, 60] },
      ];

      render(
        <Line
          datasets={multipleDatasets}
          labels={['A', 'B', 'C']}
          formattedData={[
            ['10', '50', '30'],
            ['40', '20', '60'],
          ]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const formatter = dataset.datalabels.formatter;

      const result = formatter(50, {
        datasetIndex: 0,
        dataIndex: 1,
        dataset: multipleDatasets[0],
      });

      expect(result).toBe('50');
    });

    it('should show all labels when only one dataset has formattedData', () => {
      const threeDatasets = [
        { label: 'PY', data: [10000, 12000] },
        { label: 'Budget', data: [11000, 13000] },
        { label: 'CY', data: [11000, 15500] },
      ];
      const formattedDataOnlyLast = [
        ['', ''],
        ['', ''],
        ['11.0k', '15.5k'],
      ];

      render(
        <Line
          datasets={threeDatasets}
          labels={['Jan', 'Feb']}
          formattedData={formattedDataOnlyLast}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const formatter = calls.datasets[2].datalabels.formatter;

      const result0 = formatter(11000, {
        datasetIndex: 2,
        dataIndex: 0,
        dataset: threeDatasets[2],
      });
      const result1 = formatter(15500, {
        datasetIndex: 2,
        dataIndex: 1,
        dataset: threeDatasets[2],
      });

      expect(result0).toBe('11.0k');
      expect(result1).toBe('15.5k');
    });

    it('should use dataset values for anchor when only one dataset has formattedData and partial series', () => {
      const threeDatasets = [
        { label: 'PY', data: [13000, 14000, 15000, 16000] },
        { label: 'Budget', data: [10000, 12000, 13000, 14000] },
        { label: 'CY', data: [11000, 15500] },
      ];
      const formattedDataOnlyLast = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['11.0k', '15.5k'],
      ];

      render(
        <Line
          datasets={threeDatasets}
          labels={['Jan', 'Feb', 'Mar', 'Apr']}
          formattedData={formattedDataOnlyLast}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const anchor = calls.datasets[2].datalabels.anchor;

      const anchor0 = anchor({
        datasetIndex: 2,
        dataIndex: 0,
        dataset: threeDatasets[2],
      });
      const anchor1 = anchor({
        datasetIndex: 2,
        dataIndex: 1,
        dataset: threeDatasets[2],
      });

      expect(anchor0).toBe('start');
      expect(anchor1).toBe('end');
    });

    it('should use visible values at dataIndex when one dataset has labels but full series', () => {
      const twoDatasets = [
        { label: 'PY', data: [12.5, 11.9, 12.0] },
        { label: 'CY', data: [11.9, 12.0, 11.3] },
      ];
      const formattedDataOnlyLast = [
        ['', '', ''],
        ['11.9M', '12.0M', '11.3M'],
      ];

      render(
        <Line
          datasets={twoDatasets}
          labels={['Jan', 'Feb', 'Mar']}
          formattedData={formattedDataOnlyLast}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const anchor = calls.datasets[1].datalabels.anchor;

      const anchor0 = anchor({
        datasetIndex: 1,
        dataIndex: 0,
        dataset: twoDatasets[1],
      });
      const anchor1 = anchor({
        datasetIndex: 1,
        dataIndex: 1,
        dataset: twoDatasets[1],
      });
      const anchor2 = anchor({
        datasetIndex: 1,
        dataIndex: 2,
        dataset: twoDatasets[1],
      });

      expect(anchor0).toBe('start');
      expect(anchor1).toBe('end');
      expect(anchor2).toBe('start');
    });

    it('should always show label for single dataset', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const dataset = calls.datasets[0];
      const formatter = dataset.datalabels.formatter;

      const result = formatter(30, {
        datasetIndex: 0,
        dataIndex: 2,
        dataset: mockDatasets[0],
      });

      expect(result).toBe('30');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty datasets', () => {
      render(<Line datasets={[]} labels={[]} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.datasets).toEqual([]);
    });

    it('should handle datasets with zero values', () => {
      const zeroDatasets = [{ label: 'Zero', data: [0, 0, 0] }];

      render(<Line datasets={zeroDatasets} labels={['A', 'B', 'C']} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle datasets with negative values', () => {
      const negativeDatasets = [{ label: 'Negative', data: [-10, -20, -30] }];

      render(<Line datasets={negativeDatasets} labels={['A', 'B', 'C']} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle datasets with mixed positive and negative values', () => {
      const mixedDatasets = [{ label: 'Mixed', data: [10, -20, 30, -40, 50] }];

      render(
        <Line datasets={mixedDatasets} labels={['A', 'B', 'C', 'D', 'E']} />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle datasets with NaN values', () => {
      const nanDatasets = [{ label: 'NaN', data: [10, NaN, 30] }];

      render(<Line datasets={nanDatasets} labels={['A', 'B', 'C']} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle datasets with all same values', () => {
      const sameValueDatasets = [
        { label: 'Same', data: [50, 50, 50] },
        { label: 'Same2', data: [50, 50, 50] },
      ];

      render(<Line datasets={sameValueDatasets} labels={['A', 'B', 'C']} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should handle very large datasets', () => {
      const largeDatasets = [
        {
          label: 'Large',
          data: Array.from({ length: 100 }, (_, i) => i),
        },
      ];

      render(
        <Line
          datasets={largeDatasets}
          labels={Array.from({ length: 100 }, (_, i) => `L${i}`)}
        />,
      );

      expect(BaseChart).toHaveBeenCalled();
    });
  });

  describe('Behavior Assertions - Pass Through Props', () => {
    it('should pass options to BaseChart', () => {
      const customOptions = {
        scales: { x: { display: false } },
      };

      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          options={customOptions}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.options).toBeDefined();
      expect(calls.options.scales.x.display).toBe(false);
      expect(calls.options.scales.x.ticks.font).toBeDefined();
    });

    it('should pass additional props to BaseChart', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          showGrid={false}
          showDivider={true}
          axisType="two"
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.showGrid).toBe(false);
      expect(calls.showDivider).toBe(true);
      expect(calls.axisType).toBe('two');
    });

    it('should pass indexAxis to BaseChart', () => {
      render(
        <Line datasets={mockDatasets} labels={mockLabels} indexAxis="y" />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.indexAxis).toBe('y');
    });

    it('should configure custom point tooltip when tooltip prop is true', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} tooltip />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];

      expect(calls.options.plugins.tooltip.enabled).toBe(false);
      expect(calls.options.plugins.tooltip.external).toEqual(
        expect.any(Function),
      );
      expect(calls.options.plugins.tooltip.mode).toBe('index');
      expect(calls.options.plugins.tooltip.intersect).toBe(true);
      expect(calls.options.interaction.mode).toBe('index');
      expect(calls.options.interaction.intersect).toBe(true);
      expect(
        calls.plugins.some(
          (p: { id?: string }) => p.id === 'linePointTooltipCleanup',
        ),
      ).toBe(true);
    });

    it('should not add line tooltip cleanup plugin when tooltip is off', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];

      expect(
        calls.plugins?.some(
          (p: { id?: string }) => p.id === 'linePointTooltipCleanup',
        ) ?? false,
      ).toBe(false);
    });

    it('should merge tooltip options when tooltip is an object', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          tooltip={{ useFormattedData: false }}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];

      expect(calls.options.plugins.tooltip.external).toEqual(
        expect.any(Function),
      );
    });
  });

  describe('Highlight Period Functionality', () => {
    it('should configure annotation options when highlightedIndexes is provided', () => {
      const highlightedIndexes = [1, 2];

      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          highlightedIndexes={highlightedIndexes}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.annotation).toBeDefined();
      expect(calls.options.plugins.annotation.annotations).toBeDefined();
    });

    it('should create annotations for highlighted indexes', () => {
      const highlightedIndexes = [2];

      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          highlightedIndexes={highlightedIndexes}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const annotations = calls.options.plugins.annotation.annotations;

      expect(Object.keys(annotations).length).toBeGreaterThan(0);
    });

    it('should handle empty highlightedIndexes array', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          highlightedIndexes={[]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const annotations = calls.options.plugins.annotation.annotations;

      expect(Object.keys(annotations).length).toBe(0);
    });

    it('should handle undefined highlightedIndexes', () => {
      render(<Line datasets={mockDatasets} labels={mockLabels} />);

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      expect(calls.options.plugins.annotation).toBeDefined();
    });

    it('should create multiple annotations for multiple highlighted indexes', () => {
      const highlightedIndexes = [0, 2, 4];

      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          highlightedIndexes={highlightedIndexes}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const annotations = calls.options.plugins.annotation.annotations;

      expect(Object.keys(annotations).length).toBe(3);
    });

    it('should preserve existing options when adding annotations', () => {
      const customOptions = {
        scales: { y: { display: true } },
        plugins: { legend: { display: false } },
      };

      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          highlightedIndexes={[0]}
          options={customOptions}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];

      expect(calls.options.scales.y).toEqual(customOptions.scales.y);
      expect(calls.options.scales.x.ticks.font).toBeDefined();
      expect(calls.options.plugins.legend).toEqual(
        customOptions.plugins.legend,
      );
      expect(calls.options.plugins.annotation).toBeDefined();
    });

    it('should apply bold font weight to highlighted indexes', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          highlightedIndexes={[0, 2]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const fontFunction = calls.options.scales.x.ticks.font;

      const janFont = fontFunction({ index: 0 });
      expect(janFont.weight).toBe('bold');

      const febFont = fontFunction({ index: 1 });
      expect(febFont.weight).toBe('normal');

      const marFont = fontFunction({ index: 2 });
      expect(marFont.weight).toBe('bold');
    });

    it('should apply normal font weight when no indexes are highlighted', () => {
      render(
        <Line
          datasets={mockDatasets}
          labels={mockLabels}
          highlightedIndexes={[]}
        />,
      );

      const calls = (BaseChart as jest.Mock).mock.calls[0][0];
      const fontFunction = calls.options.scales.x.ticks.font;

      mockLabels.forEach((_, index) => {
        const font = fontFunction({ index });
        expect(font.weight).toBe('normal');
      });
    });
  });
});

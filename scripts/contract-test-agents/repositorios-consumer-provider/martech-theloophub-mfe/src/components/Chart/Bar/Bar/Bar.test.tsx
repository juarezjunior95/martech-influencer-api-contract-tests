import { render, screen } from '@testing-library/react';
import { ScriptableScaleContext } from 'chart.js';

import { BaseChart } from '../../BaseChart';
import { Bar } from './Bar';
import { DEFAULT_FONT, XSMALL_FONT } from './constants';
import { DataLabelContext } from './types';

jest.mock('../../BaseChart', () => ({
  BaseChart: jest.fn(() => <div data-testid="base-chart">BaseChart</div>),
}));

const getBaseChartProps = () => {
  const mock = BaseChart as jest.Mock;
  expect(mock).toHaveBeenCalled();
  return mock.mock.calls[mock.mock.calls.length - 1][0];
};

const datalabelsContext = (
  value: number,
  pixelFor0: number,
  pixelForValue: number,
): DataLabelContext => ({
  dataIndex: 0,
  datasetIndex: 0,
  dataset: { data: [value] },
  chart: {
    scales: {
      y: {
        getPixelForValue: (v: number) => (v === 0 ? pixelFor0 : pixelForValue),
      },
    },
  },
});

describe('Bar Component', () => {
  const mockDatasets = [
    {
      label: 'Dataset 1',
      data: [10, 20, 30, -15, 25],
      backgroundColor: '#FF0000',
    },
  ];

  const mockLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const mockFormattedData = [['10', '20', '30', '-15', '25']];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render BaseChart', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} />);

      expect(screen.getByTestId('base-chart')).toBeInTheDocument();
      expect(BaseChart).toHaveBeenCalled();
    });

    it('should pass type bar to BaseChart', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} />);

      expect(getBaseChartProps()).toEqual(
        expect.objectContaining({
          type: 'bar',
        }),
      );
    });

    it('should register Connector and RoundedArrow plugins', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} />);

      const { plugins } = getBaseChartProps();
      const pluginIds = plugins.map((p: { id: string }) => p.id);

      expect(pluginIds).toContain('connectorPlugin');
      expect(pluginIds).toContain('roundedArrow');
    });
  });

  describe('Props Validation - Size', () => {
    it('should use medium bar thickness by default', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} />);

      expect(getBaseChartProps().datasets[0].barThickness).toBe(40);
    });

    it('should use small bar thickness when size is small', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} size="small" />);

      expect(getBaseChartProps().datasets[0].barThickness).toBe(32);
    });

    it('should use large bar thickness when size is large', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} size="large" />);

      expect(getBaseChartProps().datasets[0].barThickness).toBe(48);
    });

    it('should use xsmall bar thickness and datalabel font when size is xsmall', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} size="xsmall" />);

      const dataset = getBaseChartProps().datasets[0];

      expect(dataset.barThickness).toBe(28);
      expect(dataset.datalabels.font).toEqual(XSMALL_FONT);
    });

    it('should use default datalabel font when size is not xsmall', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} size="large" />);

      expect(getBaseChartProps().datasets[0].datalabels.font).toEqual(
        DEFAULT_FONT,
      );
    });
  });

  describe('Props Validation - MaxSize', () => {
    it('should set maxBarThickness to barSize[size] when maxSize is none', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          size="medium"
          maxSize="none"
        />,
      );

      expect(getBaseChartProps().datasets[0].maxBarThickness).toBe(40);
    });

    it('should double large bar thickness for maxBarThickness by default', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} />);

      expect(getBaseChartProps().datasets[0].maxBarThickness).toBe(96);
    });
  });

  describe('Props Validation - IndexAxis', () => {
    it('should set top layout padding to 80 when indexAxis is x', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} indexAxis="x" />);

      expect(getBaseChartProps().options.layout.padding.top).toBe(80);
    });

    it('should set top layout padding to 0 when indexAxis is y', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} indexAxis="y" />);

      expect(getBaseChartProps().options.layout.padding.top).toBe(0);
    });
  });

  describe('Props Validation - Datalabels', () => {
    it('should set display to auto when formattedData is non-empty and alwaysShowDataLabels is false', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      expect(getBaseChartProps().datasets[0].datalabels.display).toBe('auto');
    });

    it('should set display to true when formattedData is non-empty and alwaysShowDataLabels is true', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
          alwaysShowDataLabels
        />,
      );

      expect(getBaseChartProps().datasets[0].datalabels.display).toBe(true);
    });

    it('should set display to false when formattedData is empty', () => {
      render(
        <Bar datasets={mockDatasets} labels={mockLabels} formattedData={[]} />,
      );

      expect(getBaseChartProps().datasets[0].datalabels.display).toBe(false);
    });

    it('should format labels from formattedData by dataset and data index', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const formatter = getBaseChartProps().datasets[0].datalabels.formatter;

      expect(
        formatter(10, {
          datasetIndex: 0,
          dataIndex: 0,
        } as DataLabelContext),
      ).toBe('10');
    });

    it('should return empty string when formatted cell is missing', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
        />,
      );

      const formatter = getBaseChartProps().datasets[0].datalabels.formatter;

      expect(
        formatter(10, {
          datasetIndex: 0,
          dataIndex: 99,
        } as DataLabelContext),
      ).toBe('');
    });

    it('should use external palette when datalabelsPosition is external', () => {
      const customColors = { internal: '#FFFFFF', external: '#000000' };

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
          labelColors={customColors}
        />,
      );

      const colorFn = getBaseChartProps().datasets[0].datalabels.color;

      expect(colorFn({} as DataLabelContext)).toBe(customColors.external);
    });

    it('should use internal palette for internal position when bar is not small', () => {
      const customColors = { internal: '#111111', external: '#EEEEEE' };

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          formattedData={mockFormattedData}
          datalabelsPosition="internal"
          labelColors={customColors}
        />,
      );

      const colorFn = getBaseChartProps().datasets[0].datalabels.color;
      const ctx = datalabelsContext(50, 200, 100);

      expect(colorFn(ctx)).toBe(customColors.internal);
    });
  });

  describe('Props Validation - Striped Pattern', () => {
    it('should pass stripedIndexes as pattern flags', () => {
      const stripedIndexes = [0, 2, 4];

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          stripedIndexes={stripedIndexes}
        />,
      );

      expect(getBaseChartProps().datasets[0].pattern.flags).toEqual(
        stripedIndexes,
      );
    });

    it('should use empty pattern flags by default', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} />);

      expect(getBaseChartProps().datasets[0].pattern.flags).toEqual([]);
    });
  });

  describe('Props Validation - Border Radius', () => {
    it('should expose borderRadius as a function', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} indexAxis="x" />);

      const { borderRadius } = getBaseChartProps().datasets[0];

      expect(borderRadius).toEqual(expect.any(Function));
    });

    it('should round top corners for positive values on x-axis', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} indexAxis="x" />);

      const borderRadius = getBaseChartProps().datasets[0].borderRadius;

      expect(
        borderRadius({
          dataset: { data: [10] },
          dataIndex: 0,
        } as DataLabelContext),
      ).toEqual({
        topLeft: 4,
        topRight: 4,
        bottomLeft: 0,
        bottomRight: 0,
      });
    });

    it('should round bottom corners for negative values on x-axis', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} indexAxis="x" />);

      const borderRadius = getBaseChartProps().datasets[0].borderRadius;

      expect(
        borderRadius({
          dataset: { data: [-10] },
          dataIndex: 0,
        } as DataLabelContext),
      ).toEqual({
        topLeft: 0,
        topRight: 0,
        bottomLeft: 4,
        bottomRight: 4,
      });
    });
  });

  describe('Props Validation - Plugins Config', () => {
    it('should pass connector config into options.plugins', () => {
      const connectorConfig = {
        from: 'Jan',
        to: 'Feb',
        value: '10',
      };

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          connector={connectorConfig}
        />,
      );

      expect(getBaseChartProps().options.plugins.connector).toEqual(
        connectorConfig,
      );
    });

    it('should pass roundedArrow config into options.plugins', () => {
      const roundedArrowConfig = {
        comparison: 10,
        unit_of_measure: 'USD',
        direction: 'up' as const,
      };

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          roundedArrow={roundedArrowConfig}
        />,
      );

      expect(getBaseChartProps().options.plugins.roundedArrow).toEqual(
        roundedArrowConfig,
      );
    });
  });

  describe('Props Validation - Custom Options', () => {
    it('should merge custom chart options over defaults', () => {
      const customOptions = {
        animation: { duration: 500 },
        scales: {
          x: { display: false },
        },
      };

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          options={customOptions}
        />,
      );

      expect(getBaseChartProps().options).toEqual(
        expect.objectContaining({
          layout: expect.any(Object),
          plugins: expect.any(Object),
          animation: customOptions.animation,
          scales: customOptions.scales,
        }),
      );
    });
  });

  describe('Props Validation - Dataset Defaults', () => {
    it('should apply default background when dataset omits backgroundColor', () => {
      const datasetsWithoutColor = [
        {
          label: 'Dataset',
          data: [10, 20, 30],
        },
      ];

      render(<Bar datasets={datasetsWithoutColor} labels={mockLabels} />);

      expect(getBaseChartProps().datasets[0].backgroundColor).toBe('#EDCD20');
    });

    it('should apply default border width and color', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} />);

      const dataset = getBaseChartProps().datasets[0];

      expect(dataset.borderWidth).toBe(0);
      expect(dataset.borderColor).toBe('transparent');
    });

    it('should preserve custom dataset properties over defaults', () => {
      const customDataset = [
        {
          label: 'Custom',
          data: [10, 20],
          backgroundColor: '#00FF00',
          borderWidth: 2,
          customProp: 'test',
        },
      ];

      render(<Bar datasets={customDataset} labels={['A', 'B']} />);

      const dataset = getBaseChartProps().datasets[0];

      expect(dataset.backgroundColor).toBe('#00FF00');
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.customProp).toBe('test');
    });
  });

  describe('Props Validation - Label Background Color', () => {
    it('should set datalabels backgroundColor from string prop', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          labelBackgroundColor="#ABCDEF"
        />,
      );

      expect(getBaseChartProps().datasets[0].datalabels.backgroundColor).toBe(
        '#ABCDEF',
      );
    });
  });

  describe('Props Validation - Highlight Labels', () => {
    const tickFontContext = (label: string): ScriptableScaleContext =>
      ({
        chart: {} as ScriptableScaleContext['chart'],
        scale: {} as ScriptableScaleContext['scale'],
        index: 0,
        tick: { label } as ScriptableScaleContext['tick'],
      }) as ScriptableScaleContext;

    it('should use bold weight when tick label is listed in highlightLabels', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          highlightLabels={['Jan']}
        />,
      );

      const fontFn = getBaseChartProps().options.scales.x.ticks.font;
      const font = fontFn(tickFontContext('Jan'));

      expect(font.weight).toBe('bold');
    });

    it('should use normal weight when tick label is not highlighted', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          highlightLabels={['Feb']}
        />,
      );

      const fontFn = getBaseChartProps().options.scales.x.ticks.font;
      const font = fontFn(tickFontContext('Jan'));

      expect(font.weight).toBe('normal');
    });
  });

  describe('Behavior Assertions', () => {
    it('should pass fractionDigits and dataTestId to BaseChart', () => {
      const fractionDigits = { xAxis: 2, yAxis: 3, y1Axis: 1 };

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          fractionDigits={fractionDigits}
          dataTestId="bar-chart"
        />,
      );

      const props = getBaseChartProps();

      expect(props.fractionDigits).toEqual(fractionDigits);
      expect(props.dataTestId).toBe('bar-chart');
    });

    it('should pass highlightLabels to BaseChart', () => {
      const highlightLabels = ['Jan', 'Mar'];

      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          highlightLabels={highlightLabels}
        />,
      );

      expect(getBaseChartProps().highlightLabels).toEqual(highlightLabels);
    });

    it('should pass all extra props to BaseChart', () => {
      render(
        <Bar
          datasets={mockDatasets}
          labels={mockLabels}
          showGrid={false}
          showDivider
          axisType="two"
        />,
      );

      const props = getBaseChartProps();

      expect(props.showGrid).toBe(false);
      expect(props.showDivider).toBe(true);
      expect(props.axisType).toBe('two');
    });

    it('should pass indexAxis correctly', () => {
      render(<Bar datasets={mockDatasets} labels={mockLabels} indexAxis="y" />);

      expect(getBaseChartProps().indexAxis).toBe('y');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty datasets', () => {
      render(<Bar datasets={[]} labels={[]} />);

      expect(getBaseChartProps().datasets).toEqual([]);
    });

    it('should handle datasets with only zeros', () => {
      const zeroDataset = [{ label: 'Zero', data: [0, 0, 0] }];

      render(<Bar datasets={zeroDataset} labels={['A', 'B', 'C']} />);

      expect(BaseChart).toHaveBeenCalled();
    });

    it('should preserve mixed sign data in the merged dataset', () => {
      const mixedDataset = [{ label: 'Mixed', data: [10, -5, 15, -20, 0] }];

      render(
        <Bar datasets={mixedDataset} labels={['A', 'B', 'C', 'D', 'E']} />,
      );

      expect(getBaseChartProps().datasets[0].data).toEqual([
        10, -5, 15, -20, 0,
      ]);
    });

    it('should omit labels on BaseChart when labels prop is not passed', () => {
      render(<Bar datasets={mockDatasets} />);

      expect(getBaseChartProps().labels).toBeUndefined();
    });

    it('should map each input dataset to an output dataset', () => {
      const multipleDatasets = [
        { label: 'Dataset 1', data: [10, 20] },
        { label: 'Dataset 2', data: [30, 40] },
        { label: 'Dataset 3', data: [50, 60] },
      ];

      render(<Bar datasets={multipleDatasets} labels={['A', 'B']} />);

      expect(getBaseChartProps().datasets).toHaveLength(3);
    });
  });
});

import { WithStandartDeviation } from 'components/Chart';
import { Waterfall } from 'components/Chart/Bar/Waterfall';
import { SingleBarWithVariation } from 'components/Table/components';
import { TableCellType } from 'components/Table/types';
import { parseFiniteNumber } from 'utils/format';

interface ChartRendererProps {
  config: TableCellType;
  posKpi?: string;
  columnMaxValue?: number;
  dataTestId?: string;
  chartBackground?: string | string[];
  formatValueFn?: (value: number) => string;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  config,
  posKpi,
  columnMaxValue,
  dataTestId,
  chartBackground,
  formatValueFn,
}) => {
  const backgroundColor =
    chartBackground || config.chartData.backgroundColor || '#FFE478F7';
  if (config.chartData.type === 'single-bar') {
    const finiteData = (config.chartData.data as unknown[])
      .map(parseFiniteNumber)
      .filter((n): n is number => n !== null);
    if (!finiteData.length) return null;

    const variationForColor = parseFiniteNumber(config.variation);
    const direction: 'green' | 'red' =
      variationForColor !== null && variationForColor > 0 ? 'green' : 'red';

    return (
      <SingleBarWithVariation
        chartData={{
          data: finiteData,
          backgroundColor: backgroundColor,
          label: config.chartData.labels,
          unitMeasure: config.chartData.chartUnitMeasure,
        }}
        variation={{
          variation: config.variation,
          direction,
          unitOfMeasure: config.variationMeasure || '',
        }}
        posKpi={posKpi}
        columnMaxValue={columnMaxValue}
        dataTestId={dataTestId ? `chart-single-bar-${dataTestId}` : undefined}
        formatValueFn={formatValueFn}
      />
    );
  }

  if (
    config.chartData.type === 'waterfall' &&
    config.chartData.data &&
    config.chartData.labels
  ) {
    return (
      <Waterfall
        size="small"
        labels={config.chartData.labels}
        values={config.chartData.data as number[]}
        showLabels={true}
        indexAxis="y"
        colors={{
          first: '#D0D4D7',
          last: '#4C5965',
          positive: '#49764B',
          negative: '#A20A0A',
        }}
        dataTestId={dataTestId ? `chart-waterfall-${dataTestId}` : undefined}
      />
    );
  }

  if (config.chartData.type === 'standart-deviation') {
    return (
      <WithStandartDeviation
        labels={config.chartData.labels}
        datasets={[
          {
            ...config.chartData,
            backgroundColor: backgroundColor,
            unitOfMeasure: config.chartData.variationMeasure,
            type: null,
          } as any,
        ]}
        min={config.chartData.min}
        max={config.chartData.max}
        dataTestId={
          dataTestId ? `chart-standart-deviation-${dataTestId}` : undefined
        }
      />
    );
  }

  return <>N/A</>;
};

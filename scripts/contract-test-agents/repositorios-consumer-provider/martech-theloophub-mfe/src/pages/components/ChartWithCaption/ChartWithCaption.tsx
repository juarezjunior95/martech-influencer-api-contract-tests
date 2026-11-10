import { Legend, VariationCaption } from 'components';
import type { RoudedArrowProps } from 'components/Chart/plugins';
import {
  VariationCaptionData,
  VariationValue,
} from 'components/VariationCaption/types';
import { getVariationColor } from 'utils/getColor';

import {
  ChartData,
  VariationGroup,
  VariationRow,
  VariationRowData,
} from './types';

interface BarChartWithCaptionProps {
  chartComponent: any;
  chartData?: ChartData;
  hiddenColumnIndices?: number[];
  height?: string;
  barThickness?: number | 'flex';
  paddingLeft?: number;
  paddingRight?: number;
  headerMarginLeft?: number;
  columnGap?: number;
  tooltip?: boolean;
  options?: any;
  datalabelWithVariation?: boolean;
  dataTestId?: string;
}

const filterByHiddenIndices = <T,>(
  arr: T[],
  hiddenIndices: number[] | undefined,
): T[] => {
  if (!hiddenIndices?.length) return arr;
  const set = new Set(hiddenIndices);
  return arr.filter((_, i) => !set.has(i));
};

const getRoundedArrowWithRemappedIndex = (
  comparisonData: RoudedArrowProps | undefined,
  hiddenIndices: number[] | undefined,
  totalColumns: number,
): RoudedArrowProps | undefined => {
  if (!comparisonData) return undefined;
  if (!hiddenIndices?.length) return comparisonData;

  const visibleIndices = Array.from(
    { length: totalColumns },
    (_, i) => i,
  ).filter((i) => !hiddenIndices.includes(i));
  const originalStart = comparisonData.startBarIndex ?? 0;
  if (hiddenIndices.includes(originalStart)) return undefined;
  const newStartBarIndex = visibleIndices.indexOf(originalStart);
  if (newStartBarIndex === -1) return undefined;
  return { ...comparisonData, startBarIndex: newStartBarIndex };
};

export const ChartWithCaption = ({
  chartComponent: ChartComponent,
  chartData,
  hiddenColumnIndices = [],
  height = '294px',
  barThickness = 32,
  paddingLeft = 42,
  paddingRight = 0,
  headerMarginLeft = -26,
  columnGap = 0,
  tooltip = false,
  options = {},
  datalabelWithVariation = true,
  dataTestId,
}: BarChartWithCaptionProps) => {
  if (!chartData) return null;

  const normalizeToArray = <T,>(value: T | T[] | undefined | null): T[] => {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value] as T[];
  };

  const mapVariationGroup = (group: VariationGroup): VariationValue => ({
    value: String(group.variation),
    unit_of_measure: group.unit_of_measure,
    color: getVariationColor(group.direction),
  });

  const mapVariationsGroups = (
    variationsGroup?: VariationGroup[],
  ): VariationValue[] =>
    Array.isArray(variationsGroup)
      ? variationsGroup.map(mapVariationGroup)
      : [];

  const getVariationCaptionData = (
    rowData?: VariationRowData | VariationRowData[],
  ): VariationValue[][] => {
    const normalizedData = normalizeToArray(rowData);
    return normalizedData.map(({ variationsGroup }) =>
      mapVariationsGroups(variationsGroup),
    );
  };

  const getRowLabel = (title?: string): string =>
    title === 'empty' ? '\u200B' : (title ?? '');

  const variationCaptionData = (): VariationCaptionData[] => {
    const variationsRows = chartData.variation_caption?.variationsRows;
    if (!variationsRows) {
      return [];
    }

    return Object.entries(variationsRows).map(
      ([_, value]: [string, VariationRow], index) => {
        const rowData = getVariationCaptionData(value?.data);
        const filteredRowData = rowData.map((row) =>
          filterByHiddenIndices(row, hiddenColumnIndices),
        );
        return {
          title: index === 0 ? (chartData.variation_caption?.title ?? '') : '',
          subtitle:
            index === 0 ? (chartData.variation_caption?.subtitle ?? '') : '',
          label: getRowLabel(value?.title),
          data: filteredRowData,
        };
      },
    );
  };

  const normalizedLabels = normalizeToArray(chartData.labels);

  const filteredLabels = filterByHiddenIndices(
    normalizedLabels,
    hiddenColumnIndices,
  );

  const roundedArrow = getRoundedArrowWithRemappedIndex(
    chartData.comparison_data,
    hiddenColumnIndices,
    normalizedLabels.length,
  );

  return (
    <div
      style={{ maxWidth: '100%', position: 'relative' }}
      data-testid={dataTestId ? `chart-caption-${dataTestId}` : undefined}
    >
      {chartData?.chartLegend?.length > 0 && (
        <div style={{ position: 'absolute', top: 0, right: 8 }}>
          <Legend
            caption={chartData.chartLegend}
            legendPosition="right"
            dataTestId={dataTestId ? `${dataTestId}-legend` : undefined}
          />
        </div>
      )}
      <div style={{ height, maxWidth: '100%' }}>
        <ChartComponent
          datasets={chartData?.datasets?.map((dataset) => {
            const data = normalizeToArray(dataset.data);
            const formattedData = dataset?.formattedData
              ? normalizeToArray(dataset.formattedData)
              : undefined;
            const bgColors =
              chartData.backgroundColor || dataset.backgroundColor || [];
            const borderColors = normalizeToArray(dataset.borderColor || []);
            return {
              data: filterByHiddenIndices(data, hiddenColumnIndices),
              backgroundColor: Array.isArray(bgColors)
                ? filterByHiddenIndices(bgColors, hiddenColumnIndices)
                : bgColors,
              borderColor: filterByHiddenIndices(
                borderColors,
                hiddenColumnIndices,
              ),
              label: dataset.label || '',
              formattedData: formattedData
                ? filterByHiddenIndices(formattedData, hiddenColumnIndices)
                : undefined,
              type: dataset.type || 'bar',
              barThickness,
            };
          })}
          roundedArrow={roundedArrow}
          labels={filteredLabels}
          paddingTop={chartData?.paddingTop || 80}
          tooltip={tooltip}
          options={options}
          datalabelWithVariation={datalabelWithVariation}
          dataTestId={dataTestId ? `${dataTestId}-chart` : undefined}
        />
      </div>
      <VariationCaption
        variationCaptionData={variationCaptionData()}
        gridColumnsCount={filteredLabels.length}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        headerMarginLeft={headerMarginLeft}
        columnGap={columnGap}
        rowGap={0}
        dataTestId={dataTestId ? `${dataTestId}-caption` : undefined}
      />
    </div>
  );
};

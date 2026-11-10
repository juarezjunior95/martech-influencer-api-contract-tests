import { useMemo } from 'react';

import { ChartDataset, ChartOptions } from 'chart.js';
import { Bar, VariationCaption } from 'components';
import {
  createHorizontalDashedLinePlugin,
  DatalabelWithVariation,
  LabelIcon,
} from 'components/Chart/plugins';
import NoDataYet from 'components/NoDataYet/NoDataYet';
import { ResourceAllocationData } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';
import { processVariationCaptionData } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils';
import { formatNumberWithSuffix } from 'utils/format';

import * as constants from './constants';
import { StyledEmptyState } from './RankingChart.styles';

const BASE_PLUGINS = [DatalabelWithVariation, LabelIcon];

interface RankingChartProps {
  data: ResourceAllocationData;
  labelIconTooltip?: string;
  horizontalDashedLineTooltip?: string;
  chartHeight?: string;
  dataTestId?: string;
}

export const RankingChart = ({
  data,
  labelIconTooltip,
  horizontalDashedLineTooltip,
  chartHeight = constants.CHART_HEIGHT,
  dataTestId,
}: RankingChartProps) => {
  const chartData =
    data && typeof data === 'object' && !data.datasets
      ? (Object.values(data)[0] as ResourceAllocationData)
      : data;

  const guidelineMax = chartData?.horizontalDashedLine?.length
    ? Math.max(...chartData.horizontalDashedLine.map((g) => g.value))
    : constants.Y_AXIS_ZERO;

  const plugins = useMemo(
    () => [
      ...BASE_PLUGINS,
      ...(chartData?.horizontalDashedLine?.length
        ? [
            createHorizontalDashedLinePlugin(
              chartData.horizontalDashedLine,
              horizontalDashedLineTooltip,
            ),
          ]
        : []),
    ],
    [chartData?.horizontalDashedLine, horizontalDashedLineTooltip],
  );

  if (
    !chartData ||
    chartData.empty ||
    !chartData.datasets ||
    !Array.isArray(chartData.datasets)
  ) {
    return (
      <div
        style={{ height: constants.EMPTY_STATE_HEIGHT }}
        data-testid={
          dataTestId
            ? `${dataTestId}-ranking-chart-empty-state-wrapper`
            : undefined
        }
      >
        <StyledEmptyState>
          <NoDataYet
            dataTestId={
              dataTestId ? `${dataTestId}-ranking-chart-no-data-yet` : undefined
            }
          />
        </StyledEmptyState>
      </div>
    );
  }

  const formattedData =
    chartData.formattedData ||
    chartData.datasets.map((dataset) => dataset.formattedData || []);

  const hasPercentage = chartData.hasPercentage ?? false;

  const datasets = chartData.datasets.map((dataset, index) => ({
    data: dataset.data || [],
    backgroundColor: dataset.backgroundColor,
    ...(index === 0 && {
      icons: chartData.icons || [],
      labelIconTooltip: labelIconTooltip || '',
    }),
  })) as ChartDataset<'bar'>[];

  const options: ChartOptions<'bar'> = {
    layout: {
      padding: {
        top: constants.LAYOUT_PADDING_TOP,
        right: constants.LAYOUT_PADDING_RIGHT,
      },
    },
    plugins: {
      datalabels: { display: false },
      datalabelWithVariation: {
        separator: constants.DATALABEL_SEPARATOR,
        label: {
          display: false,
          font: constants.DATALABEL_FONT,
          fontBold: constants.DATALABEL_FONT_BOLD,
          textBaseline: constants.DATALABEL_TEXT_BASELINE,
          position: constants.DATALABEL_POSITION,
          color: {
            inside: constants.LABEL_COLOR_DEFAULT,
            outside: constants.LABEL_COLOR_DEFAULT,
            white: constants.LABEL_COLOR_WHITE,
          },
        },
        variation: {
          font: constants.DATALABEL_FONT,
          fontBold: constants.DATALABEL_FONT_BOLD,
          textBaseline: constants.DATALABEL_TEXT_BASELINE,
          color: {
            up: constants.COLOR_VARIATION_UP,
            down: constants.COLOR_VARIATION_DOWN,
          },
        },
        background: constants.DATALABEL_BACKGROUND,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawOnChartArea: false,
          tickWidth: constants.X_AXIS_TICK_WIDTH,
        },
        border: {
          color: constants.BORDER_COLOR,
        },
        ticks: {
          color: constants.TICKS_COLOR,
          padding: constants.X_AXIS_TICKS_PADDING,
          maxTicksLimit: constants.X_AXIS_MAX_TICKS_LIMIT,
          callback: (_, index) => {
            const label = chartData.labels?.[index];
            if (!label) return '';
            return String(label).split(' ');
          },
        },
      },
      y: {
        grid: {
          drawOnChartArea: true,
          drawTicks: true,
          display: true,
          tickColor: (context: { index: number }) =>
            context.index === 0 ? 'transparent' : constants.BORDER_COLOR,
          color: () => constants.GRID_COLOR,
          tickWidth: constants.Y_AXIS_GRID_TICK_WIDTH,
          lineWidth: constants.Y_AXIS_GRID_LINE_WIDTH,
        },
        suggestedMin: Math.min(
          chartData.suggestedMin ?? constants.Y_AXIS_ZERO,
          constants.Y_AXIS_ZERO,
        ),
        suggestedMax:
          Math.max(guidelineMax, chartData.suggestedMax ?? 0) || undefined,
        ticks: {
          color: constants.TICKS_COLOR,
          maxTicksLimit: constants.Y_AXIS_MAX_TICKS_LIMIT,
          callback: (value, index) => {
            if (index === 0) return '';
            const formattedValue = formatNumberWithSuffix(
              +value,
              constants.VALUE_FORMAT_MIN_DECIMALS,
              constants.VALUE_FORMAT_MAX_DECIMALS,
            ).value;
            return hasPercentage ? `${formattedValue}%` : formattedValue;
          },
        },
        border: {
          color: constants.BORDER_COLOR,
        },
        beginAtZero: true,
        afterFit: (axis) => {
          axis.width = constants.Y_AXIS_WIDTH;
        },
      },
    },
  };

  const variationCaptionData =
    chartData.variationCaptionData ||
    chartData.variation_caption?.flatMap((caption) =>
      Object.entries(caption?.variationsRows || {}).map(([, value], index) => ({
        title: index === 0 ? caption.title : '',
        subtitle: index === 0 ? caption.subtitle : '',
        label: value.title === 'empty' ? ' ' : value.title,
        data: processVariationCaptionData(value?.data),
      })),
    ) ||
    [];

  return (
    <div
      style={{
        borderTop: `1px solid ${constants.BORDER_TOP_COLOR}`,
        height: 'auto',
        position: 'relative',
      }}
      data-testid={dataTestId ? `${dataTestId}-ranking-chart` : undefined}
    >
      <div
        style={{ height: chartHeight }}
        data-testid={
          dataTestId ? `${dataTestId}-ranking-chart-wrapper` : undefined
        }
      >
        <Bar
          datasets={datasets}
          labels={chartData.labels || []}
          formattedData={formattedData}
          size="small"
          baseChartColors={chartData?.datasets?.[0]?.baseChartColor || []}
          plugins={plugins}
          options={options}
          showGrid
          indexAxis="x"
          dataTestId={
            dataTestId ? `${dataTestId}-ranking-chart-bar` : undefined
          }
        />
      </div>
      <VariationCaption
        variationCaptionData={variationCaptionData}
        gridColumnsCount={chartData?.labels?.length || 0}
        paddingLeft={constants.VARIATION_CAPTION_PADDING_LEFT}
        paddingRight={constants.VARIATION_CAPTION_PADDING_RIGHT}
        columnGap={constants.VARIATION_CAPTION_COLUMN_GAP}
        rowGap={constants.VARIATION_CAPTION_ROW_GAP}
        dataTestId={
          dataTestId ? `${dataTestId}-ranking-chart-caption` : undefined
        }
      />
    </div>
  );
};

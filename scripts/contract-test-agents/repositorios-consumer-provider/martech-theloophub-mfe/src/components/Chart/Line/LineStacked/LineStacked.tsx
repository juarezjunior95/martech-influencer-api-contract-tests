import React from 'react';
import { Chart } from 'react-chartjs-2';

import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  CustomGrid,
  RoudedArrowProps,
  RoundedArrow,
  StripedBackground,
  VerticalGuidelines,
} from 'components/Chart/plugins';
import { getChartSuggestedMinMax } from 'components/Chart/utils';
import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { theme } from 'theme';
import { formatNumberWithSuffix } from 'utils/format';
import { getFullMonthName } from 'utils/tooltipTextFormat';

import { getDatalabelsConfig } from './utils';

interface BarProps {
  datasets: ChartDataset<'line'>[];
  roundedArrow?: RoudedArrowProps;
  labels?: string[];
  indexAxis?: 'x' | 'y';
  tooltip?: boolean;
  options?: ChartOptions<'line'>;
  customGrid?: boolean;
  dataTestId?: string;
}

export const LineStacked: React.FC<BarProps> = ({
  datasets,
  labels,
  roundedArrow,
  indexAxis = 'x',
  tooltip = false,
  options: customOptions = {},
  customGrid = false,
  dataTestId,
}) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);

  const stacked = datasets.some((dataset) => (dataset.type as any) === 'bar');

  const { min, max } = getChartSuggestedMinMax(
    datasets.flatMap((dataset) => dataset.data),
  );
  const borderColor = theme.colors.charts.border.neutrals[40];

  const data: ChartData<'line'> = {
    labels,
    datasets: datasets.map((dataset, index) => {
      const datalabelsConfig = getDatalabelsConfig(dataset, datasets, index);
      let borderSkipped: boolean | 'bottom' | 'top' = false;

      if ((dataset.type as any) === 'bar') {
        dataset.borderColor = 'transparent';

        if (index === 1) borderSkipped = 'top';
        if (index === 0) borderSkipped = 'bottom';
      }

      return {
        backgroundColor: dataset.backgroundColor || [],
        pointRadius: 4,
        pointBorderWidth: 1,
        datalabels: datalabelsConfig as any,
        pointBackgroundColor: dataset.borderColor,
        tension: 0,
        order: dataset.type === 'line' ? 1 : 2,
        borderColor: dataset.borderColor || 'transparent',
        borderRadius: dataset.type === 'line' ? 0 : 4,
        borderWidth: dataset.type === 'line' ? 3 : 2,
        borderSkipped,
        ...dataset,
      };
    }) as ChartDataset<'line'>[],
  };
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    indexAxis,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    layout: {
      padding: {
        top: 80,
        left: 10,
        right: (customOptions?.layout?.padding as any)?.right || 0,
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      datalabelWithVariation: {
        separator: { yAxis: '|', xAxis: '-' },
        label: {
          font: "normal 12px 'Work Sans'",
          fontBold: "bold 12px 'Work Sans'",
          textBaseline: 'bottom',
          position: 'top',
          color: {
            inside: theme.colors.txt.default,
            outside: theme.colors.txt.default,
            white: '#E2E7EA',
          },
        },
        variation: {
          font: "normal 12px 'Work Sans'",
          fontBold: "bold 12px 'Work Sans'",
          textBaseline: 'bottom',
          color: {
            up: theme.colors.charts.txt.status.increase,
            down: theme.colors.charts.txt.status.decrease,
          },
        },
        background: '#FFF',
      },
      tooltip: {
        enabled: !!tooltip,
        callbacks: {
          labelPointStyle: () => {
            return {
              pointStyle: 'line',
              rotation: 0,
            };
          },
          title: (tooltip) => {
            const title = tooltip[0].label;
            return (
              getFullMonthName(title, Number(applied?.time_frame)) || title
            );
          },
        },
        usePointStyle: true,
      },
      verticalGuidelines: { displayAxisX: true },
      roundedArrow,
    },
    scales: {
      x: {
        stacked,
        grid: { display: true, drawOnChartArea: false, tickWidth: 0 },
        border: { color: borderColor },
        beginAtZero: true,
        offset: true,
        ticks: {
          autoSkip: false,
          callback: (value, index) => String(labels?.[index] ?? ''),
          font: (context) => ({
            weight: String(applied?.time_frame).includes(
              context.tick?.label as string,
            )
              ? 'bold'
              : 'normal',
            size: 12,
            family: "'Work Sans', sans-serif",
          }),
          maxTicksLimit: 4,
          padding: 12,
          align: 'center',
          display: true,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        stacked,
        grid: {
          drawOnChartArea: true,
          drawTicks: true,
          display: !customGrid,
          tickColor: (context) => {
            return context.index === 0 ? 'transparent' : borderColor;
          },
          color: (context) => {
            const isAlignZeroY = false;

            if (isAlignZeroY && context.tick.value === 0) {
              return theme.colors.charts.bg.neutrals[40];
            }
            return theme.colors.charts.bg.neutrals[5];
          },
          tickWidth: 2,
          lineWidth: 1,
        },
        suggestedMin: customOptions?.scales?.y.suggestedMin || min * 1.2,
        suggestedMax: customOptions?.scales?.y.suggestedMax || max * 1.2,
        ticks: {
          color: theme.colors.txt.secondary,
          font: {
            size: 12,
            family: "'Work Sans', sans-serif",
            style: 'normal',
          },
          maxTicksLimit: 7,
          callback: (value, index) => {
            const isPercentageY = false;

            if (index === 0) return '';

            const numValue = +value;
            if (isPercentageY) {
              return `${numValue}%`;
            }

            const decimals = numValue % 1 === 0 ? [0, 1] : [1, 2];
            return formatNumberWithSuffix(numValue, decimals[0], decimals[1])
              .value;
          },
        },

        border: { color: borderColor },
        beginAtZero: false,
        afterFit: function (axis) {
          axis.width = indexAxis === 'y' ? 80 : 35;
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }} data-testid={dataTestId}>
      <Chart
        type={stacked ? 'bar' : 'line'}
        data={data}
        options={options}
        plugins={[
          RoundedArrow,
          VerticalGuidelines,
          ChartDataLabels,
          StripedBackground,
          CustomGrid,
        ]}
      />
    </div>
  );
};

import React from 'react';
import { Bar } from 'react-chartjs-2';

import { ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { registerChartModules } from 'components/Chart/register';
import { theme } from 'theme';

import { RankedContainerData } from '../../types';
import {
  StyledChartWrapper,
  StyledContainer,
  StyledContent,
  StyledLegend,
  StyledLegendColor,
  StyledLegendItem,
  StyledLegendLabel,
} from './RankedVerticalBar.styles';
import { getBarColors as defaultGetBarColors } from './utils';

registerChartModules();

interface RankedVerticalBarProps {
  data: RankedContainerData;
  title?: string;
  dataTestId?: string;
  isExport?: boolean;
  getBarColors?: (source: string[]) => string[];
  barThickness?: number;
}

export const RankedVerticalBar: React.FC<RankedVerticalBarProps> = ({
  data,
  title,
  dataTestId,
  isExport = false,
  getBarColors = defaultGetBarColors,
  barThickness = 40,
}) => {
  const datasets = data.datasets;

  const unitMeasures = Array.isArray(datasets[1]?.unitMeasure)
    ? datasets[1].unitMeasure
    : [];

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const unit = unitMeasures[context.dataIndex] ?? '';
            return `${value}${unit}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: theme.colors.txt.default,
        font: {
          weight: 'normal',
          family: "'Work Sans', sans-serif",
          size: 12,
        },
        formatter: (value: number, context) => {
          const index = context.dataIndex;
          const unit = unitMeasures?.[index] ?? '';
          return `${value}${unit}`;
        },
        anchor: 'center',
        align: 'center',
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: theme.colors.txt.secondary,
          font: {
            size: 12,
            family: "'Work Sans', sans-serif",
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  };

  const chartData = {
    ...data,
    datasets: [
      {
        data: datasets[0].data,
        barThickness: barThickness,
        backgroundColor: getBarColors(datasets[2]?.source),
        borderRadius: 4,
      },
    ],
  };

  return (
    <StyledContainer
      isExport={isExport}
      data-testid={dataTestId ? `ranked-vertical-bar-${dataTestId}` : undefined}
    >
      <StyledContent
        data-testid={dataTestId ? `ranked-content-${dataTestId}` : undefined}
      >
        {data.legend && (
          <StyledLegend
            data-testid={dataTestId ? `ranked-legend-${dataTestId}` : undefined}
          >
            {data.legend.items.map((item, index) => (
              <StyledLegendItem
                key={`${item.label}-${item.color}`}
                data-testid={
                  dataTestId
                    ? `ranked-legend-item-${index}-${dataTestId}`
                    : undefined
                }
              >
                <StyledLegendColor
                  style={{ backgroundColor: item.color }}
                  data-testid={
                    dataTestId
                      ? `ranked-legend-color-${index}-${dataTestId}`
                      : undefined
                  }
                />
                <StyledLegendLabel
                  data-testid={
                    dataTestId
                      ? `ranked-legend-label-${index}-${dataTestId}`
                      : undefined
                  }
                >
                  {item.label}
                </StyledLegendLabel>
              </StyledLegendItem>
            ))}
          </StyledLegend>
        )}
        <StyledChartWrapper
          data-testid={
            dataTestId ? `ranked-chart-wrapper-${dataTestId}` : undefined
          }
        >
          <Bar options={options} data={chartData} plugins={[ChartDataLabels]} />
        </StyledChartWrapper>
      </StyledContent>
    </StyledContainer>
  );
};

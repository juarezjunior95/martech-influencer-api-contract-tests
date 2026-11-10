import React from 'react';
import { Chart as ReactChart } from 'react-chartjs-2';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { registerChartModules } from 'components/Chart/register';

import { ChartData } from '../../../../models/ChartData';
import { variationColorMap } from '../constants';

registerChartModules();

export const WithStandartDeviation = ({
  labels,
  datasets,
  min = 0,
  max = 100,
}: ChartData): React.ReactElement => {
  return (
    <ReactChart
      type="bar"
      data={{ labels, datasets }}
      plugins={[ChartDataLabels]}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        datasets: {
          bar: {
            maxBarThickness: 32,
            borderRadius: 4,
          },
        },
        scales: {
          x: {
            min: 0,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false,
            },
          },
          y: {
            min,
            max,
            type: 'log2Scale',
            grid: {
              color: (context) => {
                return context.tick.value == 0 ? '#828f9b' : 'transparent';
              },
            },
            ticks: {
              display: false,
              callback: function (value) {
                if (value === 0) return '0';
                return value;
              },
            },
            border: {
              display: false,
            },
          } as any,
        },
        plugins: {
          legend: {
            display: false,
          },

          datalabels: {
            font: {
              family: 'Work Sans',
            },
            anchor: (context) =>
              +datasets[context.datasetIndex].data[context.dataIndex] >= 0
                ? 'end'
                : 'start',
            align: ({ datasetIndex, dataIndex }) =>
              +datasets[datasetIndex].data[dataIndex] >= 0 ? 'end' : 'start',

            offset: -3,
            color(context) {
              const variationDirection =
                datasets[context.datasetIndex]?.variationDirection?.[
                  context.dataIndex
                ];
              const variationColor =
                datasets[context.datasetIndex]?.variationColor?.[
                  context.dataIndex
                ];

              return variationColorMap[variationDirection] || variationColor;
            },
            formatter: (_, { datasetIndex, dataIndex }) =>
              `${datasets[datasetIndex].data[dataIndex]}${datasets[datasetIndex].unitOfMeasure}`,
          },
        },
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
      }}
    />
  );
};

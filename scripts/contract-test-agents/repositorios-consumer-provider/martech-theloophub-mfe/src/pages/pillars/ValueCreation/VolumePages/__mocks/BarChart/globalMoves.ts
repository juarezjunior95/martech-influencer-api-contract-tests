import { BarChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

export const GlobalMovesBarChartMock: BarChartKpiData = {
  period: 'YTD',
  datasets: [
    {
      data: [198300, 247300, 312500, 318200, 320000],
      backgroundColor: ['#eddab1', '#eddab1', '#eddab1', '#eddab1', '#d1a33c'],
    },
  ],
  labels: ['2022', '2023', '2024', "BU'25", '2025'],
  formattedData: [['198.3k', '247.3k', '312.5k', '318.2k', '320.0k']],
  stripedIndexes: [3],
  roundedArrow: {
    comparison: 1,
    direction: 'up',
    unit_of_measure: '%',
  },
  comparisonLine: {
    data: [
      {
        title: 'vs LY',
        data: [
          {
            value: '-12.5',
            measure: '%',
            color: '#A20A0A',
          },
          {
            value: '-12.5',
            measure: '%',
            color: '#A20A0A',
          },
          {
            value: '-12.5',
            measure: '%',
            color: '#A20A0A',
          },
          {
            value: '-',
          },
          {
            value: '-12.5',
            measure: '%',
            color: '#A20A0A',
          },
        ],
      },
    ],
  },
};

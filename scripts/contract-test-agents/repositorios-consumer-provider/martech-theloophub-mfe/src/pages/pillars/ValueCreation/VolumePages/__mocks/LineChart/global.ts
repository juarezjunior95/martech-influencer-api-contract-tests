import { LineChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

export const GlobalChartMock: LineChartKpiData = {
  period: 'MTD',
  datasets: [
    {
      data: [
        13000, 14000, 15000, 7000, 8000, 6500, 7000, 7500, 8000, 8500, 9000,
        9500,
      ],
      pointBackgroundColor: '#EDDAB1',
      borderColor: '#EDDAB1',
      label: 'Previous Year',
    },
    {
      data: [10000, 12000, 13000, 15000, 16000, 17000, 18000, 19000],
      pointBackgroundColor: '#D1A33C',
      borderColor: '#D1A33C',
      label: 'Budget',
    },
    {
      data: [11000, 15500],
      pointBackgroundColor: '#f1d715',
      borderColor: '#f1d715',
      label: 'Current Year',
    },
  ],
  formattedData: [[], [], ['11.0k', '15.5k']],
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  highlightLabels: ['Aug'],
  comparisonLine: {
    data: [
      {
        title: 'vs LY',
        data: [
          { value: '2.4', measure: '%', color: '#49764B' },
          { value: '-3.5', measure: '%', color: '#A20A0A' },
          { value: '4.7', measure: '%', color: '#49764B' },
          { value: '-5.9', measure: '%', color: '#A20A0A' },
          { value: '6.8', measure: '%', color: '#49764B' },
          { value: '7.3', measure: '%', color: '#49764B' },
          { value: '8.1', measure: '%', color: '#49764B' },
          { value: '9.1', measure: '%', color: '#49764B' },
          { value: '-' },
          { value: '-' },
          { value: '-' },
          { value: '-' },
        ],
      },
    ],
  },
  legend: [
    {
      label: 'Previous Year',
      shape: 'thinPill' as const,
      color: '#EDDAB1',
    },
    {
      label: 'Budget',
      shape: 'thinPill' as const,
      color: '#f1d715',
    },
    {
      label: 'Current Year',
      shape: 'thinPill' as const,
      color: '#D1A33C',
    },
  ],
};

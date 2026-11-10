import { BarChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

export const brandsSlideBarChartMock: BarChartKpiData = {
  period: 'YTD',
  datasets: [
    {
      data: [198300, 198300, 247300, 312500, 318200, 320000],
      backgroundColor: [
        '#D9C5A3',
        '#D9C5A3',
        '#D9C5A3',
        '#D9C5A3',
        '#A0D8FF',
        '#EBB400',
      ],
    },
  ],
  labels: ['2022', '2023', '2024', '2025', '2026 BU', '2026'],
  formattedData: [['198.3k', '198.3k', '247.3k', '312.5k', '318.2k', '320.0k']],
  stripedIndexes: [4],
  legend: [
    { label: 'Previous Year', color: '#D9C5A3', shape: 'thinPill' },
    { label: 'Budget', color: '#A0D8FF', shape: 'thinPill' },
    { label: 'Current Year', color: '#EBB400', shape: 'thinPill' },
  ],
  comparisonLine: {
    data: [
      {
        title: 'vs LY',
        data: [
          { value: '-12.5', measure: '%', color: '#A20A0A' },
          { value: '-12.5', measure: '%', color: '#A20A0A' },
          { value: '-12.5', measure: '%', color: '#A20A0A' },
          { value: '-12.5', measure: '%', color: '#A20A0A' },
          { value: '-', measure: '%' },
          { value: '-12.5', measure: '%', color: '#A20A0A' },
        ],
      },
      {
        title: 'vs BU',
        data: [
          { value: '-5.0', measure: '%', color: '#A20A0A' },
          { value: '-5.0', measure: '%', color: '#A20A0A' },
          { value: '-5.0', measure: '%', color: '#A20A0A' },
          { value: '-5.0', measure: '%', color: '#A20A0A' },
          { value: '-', measure: '%' },
          { value: '1.0', measure: '%', color: '#0D6B0D' },
        ],
      },
    ],
  },
};

import { BigNumberSparkLineCardData } from 'pages/components';

export const bigNumberSparkLineCardsData: BigNumberSparkLineCardData[] = [
  {
    chartTitle: 'Total Distribution',
    chartPeriod: "Q3'25 - R12M",
    bigNumberData: [
      {
        bigNumber: {
          value: '21.1',
          measure: '%',
          trend: 'positive',
        },
        comparison: { label: 'vs', value: 'LY' },
        secondaryInfo: { label: '[ mm ]', value: '1,234.5' },
      },
    ],
    chartLineData: [1, 2, 1, 4, 3, 2, 1, 4],
  },
  {
    chartTitle: 'Total Megabrands Distribution',
    chartPeriod: "Nov'25 YTD",
    bigNumberData: [
      {
        bigNumber: {
          value: '4.1',
          measure: '%',
          trend: 'positive',
        },
        comparison: { label: 'vs', value: 'LY' },
        secondaryInfo: { label: '[ mm ]', value: '1,234.5' },
      },
    ],
    chartLineData: [17, 2, 1, 4, 3, 2, 1, 4],
  },
];

import { TableDataType } from 'components/Table/types';

export const GlobalPortfolioTableMock: TableDataType = {
  header: [
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'vs LY',
    },
    {
      id: 'mtd',
      title: 'MTD',
    },
    {
      id: 'l3m',
      title: 'L3M',
    },
    {
      id: 'ytd',
      title: 'YTD',
    },
  ],
  rows: [
    [
      {
        portfolio: {
          value: 'Megabrands',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        portfolio: {
          value: 'Expansion',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        portfolio: {
          value: 'Sustain',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        portfolio: {
          value: 'Tail',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        portfolio: {
          value: 'Total',
          subtitle: '(Beer + Adj)',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
    ],
  ],
};

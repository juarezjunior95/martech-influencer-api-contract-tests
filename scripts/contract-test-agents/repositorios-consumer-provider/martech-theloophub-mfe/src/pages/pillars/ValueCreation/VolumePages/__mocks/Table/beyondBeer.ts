import { TableDataType } from 'components/Table/types';

export const BeyondBeerTableMock: TableDataType = {
  header: [
    {
      id: 'priorities',
      title: 'Priorities',
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
        priorities: {
          value: 'Beats',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: 'Balanced Choices',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: 'Cutwater',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: 'Flying Fish',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: `Mike's`,
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: 'NUTRL',
        },
        mtd: {
          value: '-04.9',
          unitMeasure: '%',
          variationDirection: '#A20A0A',
        },
        l3m: {
          value: '-04.9',
          unitMeasure: '%',
          variationDirection: '#A20A0A',
        },
        ytd: { value: '14.8', unitMeasure: '%', variationDirection: '#49764B' },
      },
    ],
  ],
};

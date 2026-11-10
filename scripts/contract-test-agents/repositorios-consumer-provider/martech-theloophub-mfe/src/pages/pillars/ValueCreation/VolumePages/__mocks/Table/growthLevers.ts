import { TableDataType } from 'components/Table/types';

export const GrowthLeversTableMock: TableDataType = {
  header: [
    {
      id: 'growth_levers',
      title: 'Growth Levers',
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
        growth_levers: {
          value: 'Superior Core',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        growth_levers: {
          value: 'Lead Premium',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        growth_levers: {
          value: 'Global Brands',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        growth_levers: {
          value: 'Balanced Choices',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        growth_levers: {
          value: 'Non Alc Beer',
          aggregated: true,
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        growth_levers: {
          value: 'Beyond Beer',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
    ],
  ],
};

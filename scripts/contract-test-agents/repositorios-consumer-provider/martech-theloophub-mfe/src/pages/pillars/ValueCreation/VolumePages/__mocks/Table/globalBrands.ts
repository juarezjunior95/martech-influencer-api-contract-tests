import { TableDataType } from 'components/Table/types';

export const GlobalBrandsTableMock: TableDataType = {
  header: [
    {
      id: 'brands',
      title: 'Global Brands',
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
        brands: {
          value: 'Corona',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        brands: {
          value: 'Budweiser',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        brands: {
          value: 'Stella Artois',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        brands: {
          value: 'Michelob Ultra',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
    ],
  ],
};

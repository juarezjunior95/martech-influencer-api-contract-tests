import { TableDataType } from 'components/Table/types';

export const GlobalPrioritiesTableMock: TableDataType = {
  header: [
    { id: 'priorities', title: 'Priorities', subtitle: 'vs LY' },
    { id: 'mtd', title: 'Month' },
    { id: 'l3m', title: 'L3M' },
    { id: 'ytd', title: 'YTD' },
  ],
  rows: [
    [
      {
        priorities: {
          value: 'Corona Cero',
          image:
            'https://theloop.ab-inbev.com//sites/g/files/wnfebl11871/files/2025-09/corona%20cero.svg',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: 'Michelob Ultra Zero',
          image:
            'https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-01/Michelob.png',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: 'Stella Zero',
          image:
            'https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-01/Stella%20Artois.png',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: {
          value: 'Budweiser Zero',
          image:
            'https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2026-02/budweiser%20%282%29.svg',
        },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
      {
        priorities: { value: 'Total' },
        mtd: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        l3m: { value: '1.2', unitMeasure: '%', variationDirection: '#49764B' },
        ytd: { value: '1.2', unitMeasure: '%', variationDirection: '#A20A0A' },
      },
    ],
  ],
};

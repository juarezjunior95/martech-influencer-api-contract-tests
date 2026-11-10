import { TableDataType } from 'components/Table/types';

export const GlobalMarketsTableMock: TableDataType = {
  header: [
    { id: 'markets', title: 'Markets', subtitle: 'vs LY' },
    { id: 'mtd', title: 'Month' },
    { id: 'l3m', title: 'L3M' },
    { id: 'ytd', title: 'YTD' },
  ],
  rows: [
    [
      {
        markets: {
          value: 'Must Win',
          images: [
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/BRA.png',
              alt: 'Brazil',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/USA.png',
              alt: 'United States',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/MEX.png',
              alt: 'Mexico',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/CHN.png',
              alt: 'China',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/ZAF.png',
              alt: 'South Africa',
            },
          ],
        },
        mtd: { value: '845.8', unitMeasure: '%', trend: 'positive' },
        l3m: { value: '1,822.2', unitMeasure: '%', trend: 'positive' },
        ytd: { value: '921.7', unitMeasure: '%', trend: 'positive' },
      },
      {
        markets: {
          value: 'Stable/Mature',
          images: [
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/EUR.png',
              alt: 'Europe',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/KOR.png',
              alt: 'Korea',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/CAN.png',
              alt: 'Canada',
            },
          ],
        },
        mtd: { value: '-176.7', unitMeasure: '%', trend: 'negative' },
        l3m: { value: '-127.9', unitMeasure: '%', trend: 'negative' },
        ytd: { value: '-38.2', unitMeasure: '%', trend: 'negative' },
      },
      {
        markets: {
          value: 'High Growth',
          images: [
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/COL.png',
              alt: 'Colombia',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/ARG.png',
              alt: 'Argentina',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/PER.png',
              alt: 'Peru',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/NGA.png',
              alt: 'Nigeria',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/IND.png',
              alt: 'India',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/DOM.png',
              alt: 'Dominican Republic',
            },
            {
              src: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/ECU.png',
              alt: 'Ecuador',
            },
          ],
        },
        mtd: { value: '1,605.2', unitMeasure: '%', trend: 'positive' },
        l3m: { value: '3,009.5', unitMeasure: '%', trend: 'positive' },
        ytd: { value: '1,981.0', unitMeasure: '%', trend: 'positive' },
      },
    ],
  ],
};

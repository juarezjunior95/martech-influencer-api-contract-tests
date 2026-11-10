import { BigNumbersKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

export const GlobalBigNumbersMock: BigNumbersKpiData[] = [
  {
    header: { title: 'Month' },
    data: [
      {
        bigNumber: { value: '2.1', measure: '%', color: '#007800' },
        comparison: { label: 'vs', value: 'LY' },
      },
      {
        bigNumber: { value: '-0.2', measure: '%', color: '#B91C1C' },
        comparison: { label: 'vs', value: 'BU' },
      },
    ],
    bottomInfo: {
      secondaryInfo: { value: '45,914.0', label: '[k hl]' },
    },
  },
  {
    header: { title: 'L3M' },
    data: [
      {
        bigNumber: { value: '0.2', measure: '%', color: '#007800' },
        comparison: { label: 'vs', value: 'LY' },
      },
      {
        bigNumber: { value: '-2.8', measure: '%', color: '#B91C1C' },
        comparison: { label: 'vs', value: 'BU' },
      },
    ],
    bottomInfo: {
      secondaryInfo: { value: '141,329.9', label: '[k hl]' },
    },
  },
  {
    header: { title: 'YTD' },
    data: [
      {
        bigNumber: { value: '-0.4', measure: '%', color: '#B91C1C' },
        comparison: { label: 'vs', value: 'LY' },
      },
      {
        bigNumber: { value: '-0.3', measure: '%', color: '#B91C1C' },
        comparison: { label: 'vs', value: 'BU' },
      },
    ],
    bottomInfo: {
      secondaryInfo: { value: '45,914.0', label: '[k hl]' },
    },
  },
];

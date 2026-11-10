import { CommercialResultsBigNumbersSectionData } from '../types';

export const commercialResultsBigNumbersMock: CommercialResultsBigNumbersSectionData[] =
  [
    {
      header: {
        title: 'Volume YTD',
        measure: '[ k hl ]',
      },
      data: [
        {
          bigNumber: {
            value: '-0.5',
            measure: '%',
            trend: 'negative',
          },
          secondaryInfo: {
            value: '229,454.2',
            label: '[ k hl ]',
          },
          comparison: {
            label: 'vs',
            value: 'LY',
          },
        },
      ],
    },
    {
      header: {
        title: 'Volume L3M',
        measure: '[ k hl ]',
      },
      data: [
        {
          bigNumber: {
            value: '-0.6',
            measure: '%',
            trend: 'negative',
          },
          secondaryInfo: {
            value: '142,010.1',
            label: '[ k hl ]',
          },
          comparison: {
            label: 'vs',
            value: 'LY',
          },
        },
      ],
    },
    {
      header: {
        title: "Volume May'26",
        measure: '[ k hl ]',
      },
      data: [
        {
          bigNumber: {
            value: '-2.8',
            measure: '%',
            trend: 'negative',
          },
          secondaryInfo: {
            value: '48,175.2',
            label: '[ k hl ]',
          },
          comparison: {
            label: 'vs',
            value: 'LY',
          },
        },
      ],
    },
  ];

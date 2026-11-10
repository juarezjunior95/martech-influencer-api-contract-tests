import { WaterfallData } from '../../PerformanceTool/types';

export const commercialResultsWaterfallData: WaterfallData = {
  values: [142907.6, 268.9, 1531.8, -1498.2, -418.8, -677.4, 142010.1],
  labels: [
    "L3M'25",
    'Megabrands',
    'Expansion',
    'Sustain',
    'Tail',
    'NAB + Others',
    "L3M'26",
  ],
  formattedData: [
    ['142.9k', '268.9', '1.5k', '-1.5k', '-418.8', '-677.4', '142.0k'],
  ],
  images: {
    data: [
      {
        mainBrand: {
          src: 'https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-03/ABI.png',
          alt: "L3M'25",
        },
        title: "L3M'25",
      },
      {
        mainBrand: {
          src: '',
          alt: 'Megabrands',
        },
        title: 'Megabrands',
      },
      {
        mainBrand: {
          src: '',
          alt: 'Expansion',
        },
        title: 'Expansion',
      },
      {
        mainBrand: {
          src: '',
          alt: 'Sustain',
        },
        title: 'Sustain',
      },
      {
        mainBrand: {
          src: '',
          alt: 'Tail',
        },
        title: 'Tail',
      },
      {
        mainBrand: {
          src: '',
          alt: 'NAB + Others',
        },
        title: 'NAB + Others',
      },
      {
        mainBrand: {
          src: 'https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/2025-03/ABI.png',
          alt: "L3M'26",
        },
        title: "L3M'26",
      },
    ],
  },
  comparisonLine: {
    data: [
      {
        title: 'vs LY',
        data: [
          {
            value: '0.1',
            measure: '%',
            trend: 'positive',
          },
          {
            value: '0.4',
            measure: '%',
            trend: 'positive',
          },
          {
            value: '30.7',
            measure: '%',
            trend: 'positive',
          },
          {
            value: '-5.0',
            measure: '%',
            trend: 'negative',
          },
          {
            value: '-2.9',
            measure: '%',
            trend: 'negative',
          },
          {
            value: '-3.7',
            measure: '%',
            trend: 'negative',
          },
          {
            value: '-0.6',
            measure: '%',
            trend: 'negative',
          },
        ],
      },
      {
        title: 'Vol. Weight',
        data: [
          { value: '0.1', measure: '%', trend: 'positive' },
          { value: '0.4', measure: '%', trend: 'positive' },
          { value: '30.7', measure: '%', trend: 'positive' },
          { value: '-5.0', measure: '%', trend: 'negative' },
          { value: '-2.9', measure: '%', trend: 'negative' },
          { value: '-3.7', measure: '%', trend: 'negative' },
          { value: '-0.6', measure: '%', trend: 'negative' },
        ],
      },
    ],
  },
};

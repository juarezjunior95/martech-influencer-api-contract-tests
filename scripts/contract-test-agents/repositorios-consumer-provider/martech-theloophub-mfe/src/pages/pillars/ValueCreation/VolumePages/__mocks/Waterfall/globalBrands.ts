import { WaterfallChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

import { FLAGS } from './flags';

export const GlobalBrandsWaterfallChartMock: WaterfallChartKpiData = {
  period: 'YTD',
  values: [
    24.5, 1, 3.8, 0.1, 0.7, 0.3, 0.2, 0.6, 0.9, 0.4, 0.1, 0.8, 0.4, 0.3, 0.6,
    0.2, -10.5, 24,
  ],
  formattedData: [
    [
      '24.5',
      '1.0',
      '3.8',
      '0.1',
      '0.7',
      '0.3',
      '0.2',
      '0.6',
      '0.9',
      '0.4',
      '0.1',
      '0.8',
      '0.4',
      '0.3',
      '0.6',
      '0.2',
      '10.5',
      '24.0',
    ],
  ],
  labels: [
    `YTD'24`,
    'USA',
    'BRA',
    'MEX',
    'CHN',
    'BEL',
    'ARG',
    'CAN',
    'TAN',
    'SAF',
    'COL',
    'PER',
    'IND',
    'ECU',
    'SKR',
    'NIG',
    'Others',
    `YTD'25`,
  ],
  brandsAvatar: {
    data: [
      {
        title: `YTD'24`,
        mainBrand: {
          src: FLAGS.countries.ABI,
          alt: 'ABI FLAG',
        },
      },
      {
        title: 'USA',
        mainBrand: {
          src: FLAGS.countries.USA,
          alt: 'USA',
        },
      },
      {
        title: 'BRA',
        mainBrand: {
          src: FLAGS.countries.BRA,
          alt: 'BRA',
        },
      },
      {
        title: 'MEX',
        mainBrand: {
          src: FLAGS.countries.MEX,
          alt: 'MEX',
        },
      },
      {
        title: 'CHN',
        mainBrand: {
          src: FLAGS.countries.CHN,
          alt: 'CHN',
        },
      },
      {
        title: 'BEL',
        mainBrand: {
          src: FLAGS.countries.BEL,
          alt: 'BEL',
        },
      },
      {
        title: 'ARG',
        mainBrand: {
          src: FLAGS.countries.ARG,
          alt: 'ARG',
        },
      },
      {
        title: 'CAN',
        mainBrand: {
          src: FLAGS.countries.CAN,
          alt: 'CAN',
        },
      },
      {
        title: 'TAN',
        mainBrand: {
          src: FLAGS.countries.TAN,
          alt: 'TAN',
        },
      },
      {
        title: 'SAF',
        mainBrand: {
          src: FLAGS.countries.SAF,
          alt: 'SAF',
        },
      },
      {
        title: 'COL',
        mainBrand: {
          src: FLAGS.countries.COL,
          alt: 'COL',
        },
      },
      {
        title: 'PER',
        mainBrand: {
          src: FLAGS.countries.PER,
          alt: 'PER FLAG',
        },
      },
      {
        title: 'IND',
        mainBrand: {
          src: FLAGS.countries.IND,
          alt: 'IND FLAG',
        },
      },
      {
        title: 'ECU',
        mainBrand: {
          src: FLAGS.countries.ECU,
          alt: 'ECU FLAG',
        },
      },
      {
        title: 'SKR',
        mainBrand: {
          src: FLAGS.countries.SKR,
          alt: 'SKR FLAG',
        },
      },
      {
        title: 'NIG',
        mainBrand: {
          src: FLAGS.countries.NIG,
          alt: 'NIG FLAG',
        },
      },
      {
        title: 'Others',
        mainBrand: {
          src: FLAGS.brands.Others,
          alt: 'Others FLAG',
        },
      },
      {
        title: `YTD'25`,
        mainBrand: {
          src: FLAGS.countries.ABI,
          alt: 'ABI FLAG',
        },
      },
    ],
  },
  comparisonLine: {
    data: [
      {
        title: 'Classific.',
        data: [
          { value: '' },
          { value: 'GB', color: '#5c5c5c' },
          { value: 'GB', color: '#5c5c5c' },
          { value: 'GB', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'SUS', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'EXP', color: '#5c5c5c' },
          { value: 'MB', color: '#5c5c5c' },
          { value: 'TAIL', color: '#5c5c5c' },
          { value: '' },
          { value: '' },
        ],
      },
      {
        title: 'vs LY',
        data: [
          { value: '' },
          { value: '-0.2', measure: '%', color: '#A20A0A' },
          { value: '0.7', measure: '%', color: '#49764B' },
          { value: '-0.1', measure: '%', color: '#A20A0A' },
          { value: '0.5', measure: '%', color: '#49764B' },
          { value: '0.6', measure: '%', color: '#49764B' },
          { value: '0.9', measure: '%', color: '#49764B' },
          { value: '0.4', measure: '%', color: '#49764B' },
          { value: '0.3', measure: '%', color: '#49764B' },
          { value: '0.5', measure: '%', color: '#49764B' },
          { value: '0.6', measure: '%', color: '#49764B' },
          { value: '0.7', measure: '%', color: '#49764B' },
          { value: '0.8', measure: '%', color: '#49764B' },
          { value: '0.9', measure: '%', color: '#49764B' },
          { value: '0.3', measure: '%', color: '#49764B' },
          { value: '0.4', measure: '%', color: '#49764B' },
          { value: '0.5', measure: '%', color: '#49764B' },
          { value: '0.6', measure: '%', color: '#49764B' },
        ],
      },
      {
        title: 'Vol. Weight',
        data: [
          { value: '' },
          { value: '4.5', measure: '%', color: '#5c5c5c' },
          { value: '6.1', measure: '%', color: '#5c5c5c' },
          { value: '5.0', measure: '%', color: '#5c5c5c' },
          { value: '7.8', measure: '%', color: '#5c5c5c' },
          { value: '8.9', measure: '%', color: '#5c5c5c' },
          { value: '10.2', measure: '%', color: '#5c5c5c' },
          { value: '6.7', measure: '%', color: '#5c5c5c' },
          { value: '4.3', measure: '%', color: '#5c5c5c' },
          { value: '6.1', measure: '%', color: '#5c5c5c' },
          { value: '8.4', measure: '%', color: '#5c5c5c' },
          { value: '5.6', measure: '%', color: '#5c5c5c' },
          { value: '7.2', measure: '%', color: '#5c5c5c' },
          { value: '9.1', measure: '%', color: '#5c5c5c' },
          { value: '4.8', measure: '%', color: '#5c5c5c' },
          { value: '3.9', measure: '%', color: '#5c5c5c' },
          { value: '2.3', measure: '%', color: '#5c5c5c' },
          { value: '100', measure: '%', color: '#5c5c5c' },
        ],
      },
    ],
  },
  legend: [
    {
      label: 'Δ Vol.',
      shape: 'square' as const,
      color: '#49764B',
      icon: 'TrendingUp',
    },
    {
      label: 'Δ Vol.',
      shape: 'square' as const,
      color: '#A20A0A',
      icon: 'TrendingDown',
    },
  ],
};

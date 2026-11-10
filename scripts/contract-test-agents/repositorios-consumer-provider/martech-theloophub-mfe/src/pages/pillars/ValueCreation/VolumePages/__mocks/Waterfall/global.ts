import { WaterfallChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

import { FLAGS } from './flags';

export const GlobalWaterfallChartMock: WaterfallChartKpiData = {
  period: 'YTD',
  values: [
    24.5, 1.5, 3.8, 0.1, 0.7, 0.3, 0.2, 0.6, 0.9, 0.4, 0.1, 0.8, 0.4, 0.3, 0.6,
    0.2, -10.5, 24.5,
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
    'Corona Global',
    'Michelob Ultra Global',
    'Setella Artois Global',
    'Budweiser BEL',
    'Stella Artois BEL',
    'Harbin CHN',
    'Corona MEX',
    'Killmanjaro TAN',
    'Bush Light USA',
    'Budweiser CHN',
    'Brahma BRA',
    'Michelob Ultra USA',
    'Original BRA',
    'Corona BRA',
    'Brahma BRA',
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
        title: 'Corona',
        mainBrand: {
          src: FLAGS.brands.Corona,
          alt: 'Corona FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.ABI,
          alt: 'ABI FLAG',
        },
      },
      {
        title: 'Michelob Ultra',
        mainBrand: {
          src: FLAGS.brands.MichelobUltra,
          alt: 'Michelob Ultra FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.ABI,
          alt: 'ABI FLAG',
        },
      },
      {
        title: 'Stella Artois',
        mainBrand: {
          src: FLAGS.brands.StellaArtois,
          alt: 'Stella Artois FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.ABI,
          alt: 'ABI FLAG',
        },
      },
      {
        title: 'Budweiser',
        mainBrand: {
          src: FLAGS.brands.Budweiser,
          alt: 'Budweiser FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.BEL,
          alt: 'BEL FLAG',
        },
        description: 'BEL',
      },
      {
        title: 'Stella Artois',
        mainBrand: {
          src: FLAGS.brands.StellaArtois,
          alt: 'Stella Artois FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.BEL,
          alt: 'BEL FLAG',
        },
        description: 'BEL',
      },
      {
        title: 'Harbin',
        mainBrand: {
          src: FLAGS.brands.Harbin,
          alt: 'Harbin FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.CHN,
          alt: 'CHN FLAG',
        },
        description: 'CHN',
      },
      {
        title: 'Corona',
        mainBrand: {
          src: FLAGS.brands.Corona,
          alt: 'Corona FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.MEX,
          alt: 'MEX FLAG',
        },
        description: 'MEX',
      },
      {
        title: 'Killmanjaro',
        mainBrand: {
          src: FLAGS.brands.Kilimanjaro,
          alt: 'Killmanjaro FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.TAN,
          alt: 'TAN FLAG',
        },
        description: 'TAN',
      },
      {
        title: 'Bush Light',
        mainBrand: {
          src: FLAGS.brands.BushLight,
          alt: 'Bush Light FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.USA,
          alt: 'USA FLAG',
        },
        description: 'USA',
      },
      {
        title: 'Budweiser',
        mainBrand: {
          src: FLAGS.brands.Budweiser,
          alt: 'Budweiser FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.CHN,
          alt: 'CHN FLAG',
        },
        description: 'CHN',
      },
      {
        title: 'Brahma',
        mainBrand: {
          src: FLAGS.brands.Brahma,
          alt: 'Brahma FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.BRA,
          alt: 'BRA FLAG',
        },
        description: 'BRA',
      },
      {
        title: 'Michelob Ultra',
        mainBrand: {
          src: FLAGS.brands.MichelobUltra,
          alt: 'Michelob Ultra FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.USA,
          alt: 'USA FLAG',
        },
        description: 'USA',
      },
      {
        title: 'Original',
        mainBrand: {
          src: FLAGS.brands.Original,
          alt: 'Original FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.BRA,
          alt: 'BRA FLAG',
        },
        description: 'BRA',
      },
      {
        title: 'Corona',
        mainBrand: {
          src: FLAGS.brands.Corona,
          alt: 'Corona FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.BRA,
          alt: 'BRA FLAG',
        },
        description: 'BRA',
      },
      {
        title: 'Brahma',
        mainBrand: {
          src: FLAGS.brands.Brahma,
          alt: 'Brahma FLAG',
        },
        badgeFlag: {
          src: FLAGS.countries.BRA,
          alt: 'BRA FLAG',
        },
        description: 'BRA',
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

import type { StackedAreaResponse } from '../types';

export const edgeCaseStartingData: StackedAreaResponse = {
  title: 'Share of Throat',
  subtitle: '[%]',
  chartData: {
    columns: [
      {
        label: '2021',
        segments: [
          { value: 10 },
          { value: 4 },
          { value: 6 },
          { value: 85 },
          { value: 0 },
        ],
      },
      {
        label: '2022',
        segments: [
          { value: 5 },
          { value: 10 },
          { value: 10 },
          { value: 5 },
          { value: 3 },
        ],
      },
      {
        label: '2023',
        segments: [
          { value: 8 },
          { value: 4 },
          { value: 10 },
          { value: 4 },
          { value: 3 },
        ],
      },
      {
        label: '2024',
        segments: [
          { value: 6 },
          { value: 0 },
          { value: 0 },
          { value: 6 },
          { value: 0 },
        ],
      },
      {
        label: '2025',
        segments: [
          { value: 10 },
          { value: 0 },
          { value: 0 },
          { value: 4 },
          { value: 9 },
        ],
      },
    ],
    colors: ['#EFD328', '#D9AA4A', '#69ACE3', '#EC8AB0', '#7BC8A4'],
    connectorColors: ['#F0DF78', '#EEC879', '#A1CFF4', '#F6B7D0', '#BDE8D3'],
    legends: ['Beer', 'Spirit', 'Wine', 'Beer + Beyond Beer', 'Heineken'],
    comparisonLine: [
      {
        title: 'Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Spirit vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
      {
        title: 'Wine vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Beer + Beyond Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
    ],
  },
};

export const edgeCaseStartingMiddleZeroData: StackedAreaResponse = {
  title: 'Share of Throat',
  subtitle: '[%]',
  chartData: {
    columns: [
      {
        label: 'Label 1',
        segments: [{ value: 0 }, { value: 0 }, { value: 12 }, { value: 15 }],
      },
      {
        label: 'Label 2',
        segments: [{ value: 5 }, { value: 10 }, { value: 0 }, { value: 5 }],
      },
      {
        label: 'Label 3',
        segments: [{ value: 8 }, { value: 12 }, { value: 0 }, { value: 4 }],
      },
      {
        label: 'Label 4',
        segments: [{ value: 6 }, { value: 8 }, { value: 0 }, { value: 6 }],
      },
    ],
    colors: ['#EFD328', '#D9AA4A', '#69ACE3', '#EC8AB0'],
    connectorColors: ['#F0DF78', '#EEC879', '#A1CFF4', '#F6B7D0'],
    legends: ['Beer', 'Spirit', 'Wine', 'Beer + Beyond Beer'],
    comparisonLine: [
      {
        title: 'Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Spirit vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
      {
        title: 'Wine vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Beer + Beyond Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
    ],
  },
};

export const edgeCaseStoppingData: StackedAreaResponse = {
  title: 'Share of Throat',
  subtitle: '[%]',
  chartData: {
    columns: [
      {
        label: 'Label 1',
        segments: [{ value: 8 }, { value: 12 }, { value: 8 }, { value: 4 }],
      },
      {
        label: 'Label 2',
        segments: [{ value: 0 }, { value: 0 }, { value: 20 }, { value: 5 }],
      },
      {
        label: 'Label 3',
        segments: [{ value: 0 }, { value: 0 }, { value: 15 }, { value: 10 }],
      },
      {
        label: 'Label 4',
        segments: [{ value: 0 }, { value: 0 }, { value: 10 }, { value: 8 }],
      },
    ],
    colors: ['#EFD328', '#D9AA4A', '#69ACE3', '#EC8AB0'],
    connectorColors: ['#F0DF78', '#EEC879', '#A1CFF4', '#F6B7D0'],
    legends: ['Beer', 'Spirit', 'Wine', 'Beer + Beyond Beer'],
    comparisonLine: [
      {
        title: 'Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Spirit vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
      {
        title: 'Wine vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Beer + Beyond Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
    ],
  },
};

export const edgeCaseManyColumnsData: StackedAreaResponse = {
  title: 'Share of Throat',
  subtitle: '[%]',
  chartData: {
    columns: [
      {
        label: '2021',
        segments: [
          { value: 0 },
          { value: 0 },
          { value: 6 },
          { value: 70 },
          { value: 0 },
          { value: 0 },
          { value: 5 },
          { value: 4 },
          { value: 3 },
          { value: 6 },
          { value: 6 },
        ],
      },
      {
        label: '2022',
        segments: [
          { value: 5 },
          { value: 10 },
          { value: 10 },
          { value: 5 },
          { value: 3 },
          { value: 0 },
          { value: 7 },
          { value: 6 },
          { value: 8 },
          { value: 4 },
          { value: 7 },
        ],
      },
      {
        label: '2023',
        segments: [
          { value: 8 },
          { value: 12 },
          { value: 8 },
          { value: 4 },
          { value: 3 },
          { value: 4 },
          { value: 7 },
          { value: 6 },
          { value: 9 },
          { value: 5 },
          { value: 8 },
        ],
      },
      {
        label: '2024',
        segments: [
          { value: 6 },
          { value: 8 },
          { value: 12 },
          { value: 6 },
          { value: 0 },
          { value: 10 },
          { value: 9 },
          { value: 5 },
          { value: 7 },
          { value: 4 },
          { value: 6 },
        ],
      },
      {
        label: '2025',
        segments: [
          { value: 0 },
          { value: 3 },
          { value: 14 },
          { value: 4 },
          { value: 9 },
          { value: 5 },
          { value: 10 },
          { value: 8 },
          { value: 6 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        label: '2026',
        segments: [
          { value: 4 },
          { value: 6 },
          { value: 15 },
          { value: 5 },
          { value: 8 },
          { value: 4 },
          { value: 12 },
          { value: 10 },
          { value: 9 },
          { value: 11 },
          { value: 16 },
        ],
      },
      {
        label: '2027',
        segments: [
          { value: 3 },
          { value: 7 },
          { value: 13 },
          { value: 6 },
          { value: 10 },
          { value: 5 },
          { value: 14 },
          { value: 8 },
          { value: 7 },
          { value: 12 },
          { value: 15 },
        ],
      },
      {
        label: '2028',
        segments: [
          { value: 5 },
          { value: 9 },
          { value: 11 },
          { value: 7 },
          { value: 6 },
          { value: 3 },
          { value: 16 },
          { value: 9 },
          { value: 8 },
          { value: 10 },
          { value: 16 },
        ],
      },
      {
        label: '2029',
        segments: [
          { value: 2 },
          { value: 8 },
          { value: 12 },
          { value: 8 },
          { value: 7 },
          { value: 6 },
          { value: 13 },
          { value: 11 },
          { value: 6 },
          { value: 9 },
          { value: 18 },
        ],
      },
      {
        label: '2030',
        segments: [
          { value: 4 },
          { value: 5 },
          { value: 14 },
          { value: 9 },
          { value: 6 },
          { value: 4 },
          { value: 15 },
          { value: 10 },
          { value: 7 },
          { value: 8 },
          { value: 18 },
        ],
      },
    ],

    colors: [
      '#EFD328',
      '#D9AA4A',
      '#69ACE3',
      '#EC8AB0',
      '#7BC8A4',
      '#C6A7E8',
      '#FF8A65',
      '#4DB6AC',
      '#9575CD',
      '#F06292',
      '#90A4AE',
    ],

    connectorColors: [
      '#F0DF78',
      '#EEC879',
      '#A1CFF4',
      '#F6B7D0',
      '#BDE8D3',
      '#E4D4F6',
      '#FFC1A6',
      '#8FE3D4',
      '#C5B6F2',
      '#F8A9C4',
      '#B0BEC5',
    ],

    legends: [
      'Beer',
      'Spirit',
      'Wine',
      'Beer + Beyond Beer',
      'Heineken',
      'Teste',
      'Cider',
      'RTD',
      'Non-Alcoholic',
      'Premium',
      'Economy',
    ],
    comparisonLine: [
      {
        title: 'Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Spirit vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
      {
        title: 'Wine vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
        ],
      },
      {
        title: 'Beer + Beyond Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#A20A0A' },
          { value: '-0.1', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#49764B' },
          { value: '0.2', measure: 'pp', color: '#A20A0A' },
        ],
      },
    ],
  },
};

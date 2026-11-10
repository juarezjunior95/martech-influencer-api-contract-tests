import { PerformanceTrend } from '../types';

const performanceTrendMock = {
  datasources: {
    yearly_power_ac: [
      {
        value: 27.6,
        label: "'19",
        variation: 0,
        variation_direction: 'down',
      },
      {
        value: 26.3,
        label: "'20",
        variation: -1.3,
        variation_direction: 'down',
      },
      {
        value: 25,
        label: "'21",
        variation: -1.3,
        variation_direction: 'down',
      },
      {
        value: 27.5,
        label: "'22",
        variation: 2.5,
        variation_direction: 'up',
      },
      {
        value: 27.1,
        label: "'23",
        variation: -0.4,
        variation_direction: 'down',
      },
      {
        value: 27.4,
        label: "'24",
        variation: 0.3,
        variation_direction: 'up',
      },
      {
        value: 27.4,
        label: "'25",
        variation: 0,
        variation_direction: 'down',
      },
    ],
    trend_over_time: [
      {
        value: 53.3,
        label: "'25",
        variation: 0.4,
        variation_direction: 'up',
      },
    ],
  },
  config: {
    connector: {
      background_color: {
        up: '#E6F9E6',
        down: '#FFE6E6',
      },
      text_color: '#007800',
      measure: 'pp',
    },
    legend: [
      {
        label: 'Previous Year',
        color: '#EDDAB1',
      },
      {
        label: 'Current Year',
        color: '#D1A33C',
      },
    ],
  },
};

export const yearPowerVsAcMock: PerformanceTrend = {
  values: [4.2, 51.3, 51.4, 53.3, 52.9, 53.0, 53.3],
  labels: ["FY'19", "FY'20", "FY'21", "FY'22", "FY'23", "FY'24", "Q1'25"],
  backgroundColor: [
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#D1A33C',
  ],
  connector: {
    from: "FY'24",
    to: "Q1'25",
    value: '2.0',
    backgroundColor: '#E6F9E6',
    textColor: '#007800',
    measure: '%',
  },
  legend: [
    {
      label: 'Previous Year',
      color: '#EDDAB1',
    },
    {
      label: 'Current Year',
      color: '#D1A33C',
    },
  ],
};

export const trendOverTimeMock: PerformanceTrend = {
  values: [
    53.4, 53.2, 53.4, 52.9, 52.5, 52.8, 53.0, 52.9, 53.1, 52.9, 53.3, 52.9,
  ],
  labels: [
    "Q2'22",
    "Q3'22",
    "Q4'22",
    "Q1'23",
    "Q2'23",
    "Q3'23",
    "Q4'23",
    "Q1'24",
    "Q2'24",
    "Q3'24",
    "Q4'24",
    "Q1'25",
  ],
  backgroundColor: [
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#EDDAB1',
    '#D1A33C',
  ],
  connector: {
    from: "Q1'24",
    to: "Q1'25",
    value: '2.0',
    backgroundColor: '#FFE6E6', // down
    textColor: '#BA0B0B', // down
    measure: '%',
  },
  legend: [
    {
      label: 'Previous Year',
      color: '#EDDAB1',
    },
    {
      label: 'Current Year',
      color: '#D1A33C',
    },
  ],
};

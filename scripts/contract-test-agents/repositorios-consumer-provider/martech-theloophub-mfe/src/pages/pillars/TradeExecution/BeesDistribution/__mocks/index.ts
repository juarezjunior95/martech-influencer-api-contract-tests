import { BeesDistributionKpiData } from '../types';

export const mockBeesDistributionKpiData: Record<
  string,
  BeesDistributionKpiData
> = {
  total_distribution: {
    legend: [
      {
        color: 'rgba(237, 218, 177, 1)',
        pointStyle: 'roundedRectangle',
        label: '2024 AC YTD',
        border: 'rgba(20, 20, 20, 0.12)',
      },
      {
        color: 'rgba(209, 163, 60, 1)',
        pointStyle: 'roundedRectangle',
        label: '2025 AC YTD',
        border: 'rgba(20, 20, 20, 0.12)',
      },
    ],
    header: {
      title: 'Delta small',
      measure: '[ Measure ]',
    },
    bigNumberData: [
      {
        bigNumber: {
          value: '10.1',
          measure: '%',
        },
        comparison: {
          number: {
            value: '10.1',
            measure: '%',
            color: '#007800',
          },
          label: 'vs',
          value: "Jul'25",
        },
      },
    ],
    barChart: {
      datasets: [
        {
          label: 'Dataset 1',
          data: [0.1, 1],
          backgroundColor: ['#EDDAB1', '#D1A33C'],
        },
      ],
      labels: ['24 AC', '25 AC'],
      comparisonLine: {
        data: [
          {
            title: 'vs LY',
            data: [
              { value: '1.1', measure: '%', color: '#007800' },
              { value: '0.1', measure: '%', color: '#007800' },
            ],
          },
        ],
      },
      formattedData: [['0.1', '1.0']],
    },
    lineChart: {
      datasets: [
        {
          label: '2024',
          data: [
            1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
            12000,
          ],
          borderColor: '#EDDAB1',
          pointBackgroundColor: '#EDDAB1',
        },
        {
          label: '2025',
          data: [
            12000, 11000, 10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000,
            1000,
          ],
          borderColor: '#D1A33C',
          pointBackgroundColor: '#D1A33C',
        },
      ],
      labels: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ],
      formattedData: [
        [
          '1M',
          '2M',
          '3M',
          '4M',
          '5M',
          '6M',
          '700',
          '8M',
          '9M',
          '10M',
          '11M',
          '12M',
        ],
        [
          '12M',
          '11M',
          '10M',
          '9M',
          '8M',
          '7M',
          '6M',
          '5M',
          '4M',
          '3M',
          '2M',
          '1M',
        ],
      ],
      comparisonLine: {
        data: [
          {
            title: 'vs LY',
            data: [
              { value: '1.1', measure: '%', color: '#007800' },
              { value: '0.1', measure: '%', color: '#007800' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
            ],
          },
        ],
      },
      suggestedMin: 0,
      suggestedMax: 14,
    },
  },
  total_buyers: {
    legend: [
      {
        color: 'rgba(237, 218, 177, 1)',
        pointStyle: 'roundedRectangle',
        label: '2024 AC YTD',
        border: 'rgba(20, 20, 20, 0.12)',
      },
      {
        color: 'rgba(209, 163, 60, 1)',
        pointStyle: 'roundedRectangle',
        label: '2025 AC YTD',
        border: 'rgba(20, 20, 20, 0.12)',
      },
    ],
    header: {
      title: 'Delta small',
      measure: '[ Measure ]',
    },
    bigNumberData: [
      {
        bigNumber: {
          value: '10.1',
          measure: '%',
        },
        comparison: {
          number: {
            value: '10.1',
            measure: '%',
            color: '#007800',
          },
          label: 'vs',
          value: "Jul'25",
        },
      },
    ],
    barChart: {
      datasets: [
        {
          label: 'Dataset 1',
          data: [0.1, 1],
          backgroundColor: ['#EDDAB1', '#D1A33C'],
        },
      ],
      labels: ['24 AC', '25 AC'],
      formattedData: [['0.1', '1.0']],
      comparisonLine: {
        data: [
          {
            title: 'vs LY',
            data: [
              { value: '1.1', measure: '%', color: '#007800' },
              { value: '0.1', measure: '%', color: '#007800' },
            ],
          },
        ],
      },
    },
    lineChart: {
      datasets: [
        {
          label: '2024',
          data: [
            1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
            12000,
          ],
          borderColor: '#EDDAB1',
          pointBackgroundColor: '#EDDAB1',
        },
        {
          label: '2025',
          data: [
            12000, 11000, 10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000,
            1000,
          ],
          borderColor: '#D1A33C',
          pointBackgroundColor: '#D1A33C',
        },
      ],
      labels: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ],
      formattedData: [
        [
          '1M',
          '2M',
          '3M',
          '4M',
          '5M',
          '6M',
          '700',
          '8M',
          '9M',
          '10M',
          '11M',
          '12M',
        ],
        [
          '12M',
          '11M',
          '10M',
          '9M',
          '8M',
          '7M',
          '6M',
          '5M',
          '4M',
          '3M',
          '2M',
          '1M',
        ],
      ],
      comparisonLine: {
        data: [
          {
            title: 'vs LY',
            data: [
              { value: '1.1', measure: '%', color: '#007800' },
              { value: '0.1', measure: '%', color: '#007800' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
            ],
          },
        ],
      },
      suggestedMin: 0,
      suggestedMax: 14,
    },
  },
  sku: {
    legend: [
      {
        color: 'rgba(237, 218, 177, 1)',
        pointStyle: 'roundedRectangle',
        label: '2024 AC YTD',
        border: 'rgba(20, 20, 20, 0.12)',
      },
      {
        color: 'rgba(209, 163, 60, 1)',
        pointStyle: 'roundedRectangle',
        label: '2025 AC YTD',
        border: 'rgba(20, 20, 20, 0.12)',
      },
    ],
    header: {
      title: 'Delta small',
      measure: '[ Measure ]',
    },
    bigNumberData: [
      {
        bigNumber: {
          value: '10.1',
          measure: '%',
        },
        comparison: {
          number: {
            value: '10.1',
            measure: '%',
            color: '#007800',
          },
          label: 'vs',
          value: "Jul'25",
        },
      },
    ],
    barChart: {
      datasets: [
        {
          label: 'Dataset 1',
          data: [0.1, 1],
          backgroundColor: ['#EDDAB1', '#D1A33C'],
        },
      ],
      labels: ['24 AC', '25 AC'],
      formattedData: [['0.1', '1.0']],
      comparisonLine: {
        data: [
          {
            title: 'vs LY',
            data: [
              { value: '1.1', measure: '%', color: '#007800' },
              { value: '0.1', measure: '%', color: '#007800' },
            ],
          },
        ],
      },
    },
    lineChart: {
      datasets: [
        {
          label: '2024',
          data: [
            1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
            12000,
          ],
          borderColor: '#EDDAB1',
          pointBackgroundColor: '#EDDAB1',
        },
        {
          label: '2025',
          data: [
            12000, 11000, 10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000,
            1000,
          ],
          borderColor: '#D1A33C',
          pointBackgroundColor: '#D1A33C',
        },
      ],
      labels: [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ],
      formattedData: [
        [
          '1M',
          '2M',
          '3M',
          '4M',
          '5M',
          '6M',
          '700',
          '8M',
          '9M',
          '10M',
          '11M',
          '12M',
        ],
        [
          '12M',
          '11M',
          '10M',
          '9M',
          '8M',
          '7M',
          '6M',
          '5M',
          '4M',
          '3M',
          '2M',
          '1M',
        ],
      ],
      comparisonLine: {
        data: [
          {
            title: 'vs LY',
            data: [
              { value: '1.1', measure: '%', color: '#007800' },
              { value: '0.1', measure: '%', color: '#007800' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
              { value: '0.5', measure: '%', color: '#5C5C5C' },
            ],
          },
        ],
      },
      suggestedMin: 0,
      suggestedMax: 14,
    },
  },
};

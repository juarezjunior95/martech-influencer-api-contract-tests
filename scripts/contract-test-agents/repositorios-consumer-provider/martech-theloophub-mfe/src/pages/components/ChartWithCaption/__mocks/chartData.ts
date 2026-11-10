import { ChartData } from '../types';

export const mockChartData: ChartData = {
  datasets: [
    {
      data: [55.5, 55.4],
      type: 'bar',
      label: '2024',
      borderColor: '#4BC0C0',
      backgroundColor: ['#E8D19D', '#E8D19D'],
    },
  ],

  refreshDate: {
    month: "Dec'24",
    quarter: "FY'24",
  },

  comparison_data: {
    comparison: -0.1,
    unit_of_measure: 'pp',
    direction: 'down',
  },

  type: 'bar',
  //labels_type: 'year_ini',
  //comparison_unit_of_measure: 'pp',
  //formatted_data: false,

  labels: ['2023', '2024'],

  variation_caption: {
    title: 'Comparison',
    subtitle: 'vs LY [ 2023 - 2024 ]',
    information_order: false,
    variationsRows: {
      kpi: {
        data: [
          {
            variationsGroup: [
              {
                variation: -0.6,
                direction: 'down',
                unit_of_measure: 'pp',
              },
            ],
          },
          {
            variationsGroup: [
              {
                variation: -0.2,
                direction: 'down',
                unit_of_measure: 'pp',
              },
            ],
          },
        ],
      },
    },
  },

  chartLegend: [
    {
      color: ' rgba(229, 182, 17, 0.56)',
      pointStyle: 'circle',
      label: 'Megabrands',
    },
    {
      color: 'rgba(47, 116, 170, 0.56)',
      pointStyle: 'rectRot',
      label: 'Sustain',
    },
  ],
  backgroundColor: ['#E8D19D', '#E8D19D'],
};

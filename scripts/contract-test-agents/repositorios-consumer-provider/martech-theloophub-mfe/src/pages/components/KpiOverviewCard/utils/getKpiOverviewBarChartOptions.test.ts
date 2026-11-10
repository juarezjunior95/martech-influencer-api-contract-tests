import type { KpiOverviewCardData } from '../types';
import { getKpiOverviewBarChartOptions } from './getKpiOverviewBarChartOptions';
import { getNegativeBarChartOptions } from './getNegativeBarChartOptions';

const barChartBase = {
  labels: ['A', 'B'],
  datasets: [{ label: 'd', data: [1, 2], backgroundColor: '#ccc' }],
  formattedData: [['1', '2']],
} satisfies NonNullable<KpiOverviewCardData['barChart']>;

describe('getKpiOverviewBarChartOptions', () => {
  it('returns undefined when barChart has no datasets', () => {
    expect(
      getKpiOverviewBarChartOptions({
        ...barChartBase,
        datasets: [],
      }),
    ).toBeUndefined();
  });

  it('returns layout padding only when layoutPadding is set and values are non-negative', () => {
    const opts = getKpiOverviewBarChartOptions({
      ...barChartBase,
      layoutPadding: { top: 12 },
    });

    expect(opts).toEqual({
      layout: {
        padding: {
          top: 12,
        },
      },
    });
    expect(getNegativeBarChartOptions(barChartBase)).toBeUndefined();
  });

  it('merges layout padding with negative Y-axis options', () => {
    const barChart: KpiOverviewCardData['barChart'] = {
      ...barChartBase,
      datasets: [{ label: 'd', data: [-2, 3], backgroundColor: '#ccc' }],
      layoutPadding: { top: 10 },
    };

    const opts = getKpiOverviewBarChartOptions(barChart);

    expect(opts).toMatchObject({
      layout: { padding: { top: 10 } },
      scales: { y: { min: expect.any(Number) } },
    });
  });

  it('ignores non-numeric layout padding entries', () => {
    const opts = getKpiOverviewBarChartOptions({
      ...barChartBase,
      layoutPadding: { top: 8, left: undefined },
    });

    expect(opts).toEqual({
      layout: {
        padding: {
          top: 8,
        },
      },
    });
  });
});

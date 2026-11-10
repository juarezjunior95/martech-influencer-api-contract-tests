import type { ChartDataset } from 'chart.js';
import type { BigNumberData } from 'components/BigNumber/types';
import type { ComparisonLineData } from 'components/ComparisonLine/ComparisonLine';
import type {
  KpiOverviewBarChartLayoutPadding,
  KpiOverviewCardData,
} from 'pages/components/KpiOverviewCard';

import type { InnovationHubMainCards } from '../types';

const BAR_LABELS = ["'24", "'25", "'26 BU", "'26 LE"] as const;

const INNOVATION_HUB_BAR_CHART_LAYOUT_PADDING: KpiOverviewBarChartLayoutPadding =
  { top: 42 };

const baseBarDataset = (data: number[]): ChartDataset<'bar'> => ({
  label: 'innovation-hub-overview',
  data: [...data],
  backgroundColor: '#eddab1',
});

const cell = (
  value: string,
  trend: 'positive' | 'negative',
): ComparisonLineData['data'][number] => ({
  value,
  trend,
});

const volumeComparisonRows: ComparisonLineData[] = [
  {
    title: 'vs LY',
    data: [
      cell('+2.1%', 'positive'),
      cell('+1.6%', 'positive'),
      cell('+0.8%', 'positive'),
      cell('+3.3%', 'positive'),
    ],
  },
  {
    title: 'AFR',
    data: [
      cell('+4.2%', 'positive'),
      cell('+3.1%', 'positive'),
      cell('+1.2%', 'positive'),
      cell('+5.0%', 'positive'),
    ],
  },
  {
    title: 'APAC',
    data: [
      cell('-1.2%', 'negative'),
      cell('+0.4%', 'positive'),
      cell('-0.5%', 'negative'),
      cell('+1.8%', 'positive'),
    ],
  },
  {
    title: 'EUR',
    data: [
      cell('+2.0%', 'positive'),
      cell('+1.9%', 'positive'),
      cell('+0.3%', 'positive'),
      cell('+2.7%', 'positive'),
    ],
  },
  {
    title: 'MAZ',
    data: [
      cell('+0.8%', 'positive'),
      cell('-0.9%', 'negative'),
      cell('+0.2%', 'positive'),
      cell('+1.1%', 'positive'),
    ],
  },
  {
    title: 'NAZ',
    data: [
      cell('+3.4%', 'positive'),
      cell('+2.2%', 'positive'),
      cell('+1.0%', 'positive'),
      cell('+4.5%', 'positive'),
    ],
  },
  {
    title: 'SAZ',
    data: [
      cell('-2.0%', 'negative'),
      cell('-0.5%', 'negative'),
      cell('-1.1%', 'negative'),
      cell('+0.6%', 'positive'),
    ],
  },
];

const nrComparisonRows: ComparisonLineData[] = [
  {
    title: 'vs LY',
    data: [
      cell('+3.4%', 'positive'),
      cell('+2.9%', 'positive'),
      cell('+1.1%', 'positive'),
      cell('+4.8%', 'positive'),
    ],
  },
  {
    title: 'AFR',
    data: [
      cell('+5.1%', 'positive'),
      cell('+4.0%', 'positive'),
      cell('+2.2%', 'positive'),
      cell('+6.2%', 'positive'),
    ],
  },
  {
    title: 'APAC',
    data: [
      cell('-0.8%', 'negative'),
      cell('+1.2%', 'positive'),
      cell('+0.3%', 'positive'),
      cell('+2.5%', 'positive'),
    ],
  },
  {
    title: 'EUR',
    data: [
      cell('+1.4%', 'positive'),
      cell('+1.1%', 'positive'),
      cell('+0.6%', 'positive'),
      cell('+2.0%', 'positive'),
    ],
  },
  {
    title: 'MAZ',
    data: [
      cell('+2.2%', 'positive'),
      cell('-0.4%', 'negative'),
      cell('+0.9%', 'positive'),
      cell('+1.6%', 'positive'),
    ],
  },
  {
    title: 'NAZ',
    data: [
      cell('+4.0%', 'positive'),
      cell('+3.1%', 'positive'),
      cell('+1.4%', 'positive'),
      cell('+5.1%', 'positive'),
    ],
  },
  {
    title: 'SAZ',
    data: [
      cell('-1.5%', 'negative'),
      cell('+0.2%', 'positive'),
      cell('-0.6%', 'negative'),
      cell('+1.0%', 'positive'),
    ],
  },
];

const macoComparisonRows: ComparisonLineData[] = [
  {
    title: 'vs LY',
    data: [
      cell('+2.8%', 'positive'),
      cell('+2.1%', 'positive'),
      cell('+0.9%', 'positive'),
      cell('+3.9%', 'positive'),
    ],
  },
  {
    title: 'AFR',
    data: [
      cell('+4.8%', 'positive'),
      cell('+3.6%', 'positive'),
      cell('+1.4%', 'positive'),
      cell('+5.6%', 'positive'),
    ],
  },
  {
    title: 'APAC',
    data: [
      cell('-1.0%', 'negative'),
      cell('+0.6%', 'positive'),
      cell('-0.4%', 'negative'),
      cell('+1.5%', 'positive'),
    ],
  },
  {
    title: 'EUR',
    data: [
      cell('+1.8%', 'positive'),
      cell('+1.5%', 'positive'),
      cell('+0.4%', 'positive'),
      cell('+2.4%', 'positive'),
    ],
  },
  {
    title: 'MAZ',
    data: [
      cell('+1.0%', 'positive'),
      cell('-0.7%', 'negative'),
      cell('+0.3%', 'positive'),
      cell('+1.2%', 'positive'),
    ],
  },
  {
    title: 'NAZ',
    data: [
      cell('+3.8%', 'positive'),
      cell('+2.6%', 'positive'),
      cell('+1.1%', 'positive'),
      cell('+4.9%', 'positive'),
    ],
  },
  {
    title: 'SAZ',
    data: [
      cell('-1.8%', 'negative'),
      cell('-0.3%', 'negative'),
      cell('-0.9%', 'negative'),
      cell('+0.8%', 'positive'),
    ],
  },
];

const macoMarginComparisonRows: ComparisonLineData[] = [
  {
    title: 'vs LY',
    data: [
      cell('+0.4pp', 'positive'),
      cell('+0.3pp', 'positive'),
      cell('+0.2pp', 'positive'),
      cell('+0.6pp', 'positive'),
    ],
  },
  {
    title: 'AFR',
    data: [
      cell('+0.8pp', 'positive'),
      cell('+0.6pp', 'positive'),
      cell('+0.3pp', 'positive'),
      cell('+1.0pp', 'positive'),
    ],
  },
  {
    title: 'APAC',
    data: [
      cell('-0.2pp', 'negative'),
      cell('+0.1pp', 'positive'),
      cell('-0.1pp', 'negative'),
      cell('+0.3pp', 'positive'),
    ],
  },
  {
    title: 'EUR',
    data: [
      cell('+0.3pp', 'positive'),
      cell('+0.2pp', 'positive'),
      cell('+0.1pp', 'positive'),
      cell('+0.4pp', 'positive'),
    ],
  },
  {
    title: 'MAZ',
    data: [
      cell('+0.2pp', 'positive'),
      cell('-0.1pp', 'negative'),
      cell('+0.1pp', 'positive'),
      cell('+0.2pp', 'positive'),
    ],
  },
  {
    title: 'NAZ',
    data: [
      cell('+0.6pp', 'positive'),
      cell('+0.4pp', 'positive'),
      cell('+0.2pp', 'positive'),
      cell('+0.8pp', 'positive'),
    ],
  },
  {
    title: 'SAZ',
    data: [
      cell('-0.3pp', 'negative'),
      cell('-0.1pp', 'negative'),
      cell('-0.2pp', 'negative'),
      cell('+0.1pp', 'positive'),
    ],
  },
];

const buildCard = (config: {
  title: string;
  measure: string;
  period: string;
  bigNumberData: BigNumberData[];
  barData: number[];
  formattedDataRow: string[];
  comparisonLine: ComparisonLineData[];
}): KpiOverviewCardData => ({
  chartHeader: {
    title: config.title,
    measure: config.measure,
    period: config.period,
  },
  bigNumberData: config.bigNumberData,
  barChart: {
    labels: [...BAR_LABELS],
    datasets: [baseBarDataset(config.barData)],
    formattedData: [config.formattedDataRow],
    stripedIndexes: [2],
    highlightLabels: ["'26 LE"],
    layoutPadding: INNOVATION_HUB_BAR_CHART_LAYOUT_PADDING,
  },
  comparisonLine: {
    data: config.comparisonLine,
  },
});

const vsBuComparison = (delta: string): BigNumberData['comparison'] => ({
  label: 'vs',
  value: 'BU',
  number: {
    value: delta,
    measure: '',
    trend: 'positive',
    color: '#007800',
  },
});

const volumeBigNumberRows: BigNumberData[] = [
  {
    bigNumber: { value: '17.4', measure: '' },
    comparison: vsBuComparison('+2.4%'),
  },
];

const nrBigNumberRows: BigNumberData[] = [
  {
    bigNumber: { value: '478.2', measure: '' },
    comparison: vsBuComparison('+2.9%'),
  },
];

const macoBigNumberRows: BigNumberData[] = [
  {
    bigNumber: { value: '252.4', measure: '' },
    comparison: vsBuComparison('+2.1%'),
  },
];

const macoMarginBigNumberRows: BigNumberData[] = [
  {
    bigNumber: { value: '43.1', measure: '%' },
    comparison: vsBuComparison('+0.3pp'),
  },
];

export const innovationHubMainCardsMock: InnovationHubMainCards = {
  volume: buildCard({
    title: 'Volume',
    measure: '[ k/hl ]',
    period: "May '26 YTD",
    bigNumberData: volumeBigNumberRows,
    barData: [14.2, 15.1, 16.8, 17.4],
    formattedDataRow: ['14.2', '15.1', '16.8', '17.4'],
    comparisonLine: volumeComparisonRows,
  }),
  nr: buildCard({
    title: 'Net Revenue',
    measure: '[ $Mio ]',
    period: "May '26 YTD",
    bigNumberData: nrBigNumberRows,
    barData: [412, 438, 465, 478],
    formattedDataRow: ['412', '438', '465', '478'],
    comparisonLine: nrComparisonRows,
  }),
  maco: buildCard({
    title: 'MACO',
    measure: '[ $Mio ]',
    period: "May '26 YTD",
    bigNumberData: macoBigNumberRows,
    barData: [198, 210, 232, 252],
    formattedDataRow: ['198', '210', '232', '252'],
    comparisonLine: macoComparisonRows,
  }),
  macoMargin: buildCard({
    title: 'MACO Margin',
    measure: '[ % ]',
    period: "May '26 YTD",
    bigNumberData: macoMarginBigNumberRows,
    barData: [41.2, 42.0, 42.5, 43.1],
    formattedDataRow: ['41.2%', '42.0%', '42.5%', '43.1%'],
    comparisonLine: macoMarginComparisonRows,
  }),
};

export function toKpiOverviewCardEmptyStateData(
  source: KpiOverviewCardData,
  noticeMessage: string,
): KpiOverviewCardData {
  return {
    chartHeader: {
      title: source.chartHeader.title,
      measure: source.chartHeader.measure,
      period: source.chartHeader.period,
    },
    bigNumberData: [],
    noticeMessage,
  };
}

export function buildInnovationHubMainCardsMock(
  overrides?: Partial<InnovationHubMainCards>,
): InnovationHubMainCards {
  return {
    ...innovationHubMainCardsMock,
    ...overrides,
  };
}

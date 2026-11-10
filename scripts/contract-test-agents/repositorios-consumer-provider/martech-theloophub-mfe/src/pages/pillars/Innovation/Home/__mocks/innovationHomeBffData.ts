import type { BigNumberData } from 'components/BigNumber/types';
import type { BigNumberSparkLineCardData } from 'pages/components';

import type { HowWeDoItSection } from '../components/HowWeDoItCard/types';

export type InnovationHomeBigNumbersKey =
  | 'portfolioHealthBigNumber'
  | 'packPriceBigNumber'
  | 'brandRenovationBigNumber'
  | 'newInnovationsBigNumber';

export type InnovationHomeBffDataPayload = {
  'innovation-home-big-numbers-trend': BigNumberSparkLineCardData[];
  'innovation-home-big-numbers': Partial<
    Record<InnovationHomeBigNumbersKey, HowWeDoItSection>
  >;
};

export const HOW_WE_DO_IT_BIG_NUMBERS_BFF_REF: Record<
  InnovationHomeBigNumbersKey,
  HowWeDoItSection
> = {
  portfolioHealthBigNumber: {
    title: 'PHI',
    period: "Dec'25",
    bigNumberData: [
      {
        bigNumber: { value: '85.4', measure: '', trend: 'positive' },
        comparison: { label: '', value: '' },
      } satisfies BigNumberData,
    ],
  },
  packPriceBigNumber: {
    title: 'Pack & Price Driven Volume',
    period: "Apr'26",
    measure: '[ k hl ]',
    bigNumberData: [
      {
        bigNumber: { value: '33.5', measure: '%', trend: 'positive' },
        comparison: {
          label: 'vs',
          value: 'LY',
          number: {
            value: '5.2',
            measure: '%',
            trend: 'positive',
            color: '#007800',
          },
        },
        secondaryInfo: {
          label: '[ k hl ]',
          value: '10,935.7',
        },
      } satisfies BigNumberData,
    ],
  },
  brandRenovationBigNumber: {
    title: 'Superior Brands',
    period: "Mar'26",
    measure: '[ % ]',
    bigNumberData: [
      {
        bigNumber: { value: '0.0', measure: 'pp', trend: 'positive' },
        comparison: { label: 'vs', value: 'LY' },
        secondaryInfo: { label: '[ % ]', value: '55.0' },
      } satisfies BigNumberData,
    ],
  },
  newInnovationsBigNumber: {
    title: 'New Innovations Driven Volume',
    period: "Apr'26",
    measure: '[ k hl ]',
    bigNumberData: [
      {
        bigNumber: { value: '37.3', measure: '%', trend: 'positive' },
        comparison: { label: 'vs', value: 'LY' },
        secondaryInfo: { label: '[ k hl ]', value: '4,072.4' },
      } satisfies BigNumberData,
    ],
  },
};

export const INNOVATION_HOME_FOUR_CARD_TREND_MOCK: BigNumberSparkLineCardData[] =
  [
    {
      chartTitle: 'Volume',
      chartPeriod: "Apr'26 YTD",
      measure: '[ k/hl ]',
      bigNumberData: [
        {
          bigNumber: { value: '61.3', measure: '%', trend: 'positive' },
          comparison: {
            label: 'vs',
            value: 'BU',
            number: {
              value: '39.2',
              measure: '%',
              trend: 'positive',
              color: '#007800',
            },
          },
          secondaryInfo: { label: '[ k/hl ]', value: '1,299.9' },
        } satisfies BigNumberData,
      ],
      chartLineData: [15934.1, 17468.3, 15165.2, 15299.9],
    },
    {
      chartTitle: 'Net Revenue',
      chartPeriod: "Apr'26 YTD",
      measure: '[ $Mio ]',
      bigNumberData: [
        {
          bigNumber: { value: '39.2', measure: '%', trend: 'positive' },
          comparison: {
            label: 'vs',
            value: 'LY',
            number: {
              value: '5.2',
              measure: '%',
              trend: 'positive',
              color: '#007800',
            },
          },
        } satisfies BigNumberData,
      ],
      chartLineData: [1724.4, 1177.8, 1856.9, 1954.4],
    },
    {
      chartTitle: 'MACO',
      chartPeriod: "Apr'26 YTD",
      measure: '[ $Mio ]',
      bigNumberData: [
        {
          bigNumber: { value: '12.4', measure: '%', trend: 'positive' },
          comparison: {
            label: 'vs',
            value: 'BU',
            number: {
              value: '22.2',
              measure: '%',
              trend: 'positive',
              color: '#007800',
            },
          },
        } satisfies BigNumberData,
      ],
      chartLineData: [820, 850, 1280, 892.1],
    },
    {
      chartTitle: 'MACO Margin',
      chartPeriod: "Apr'26 YTD",
      measure: '[ % ]',
      bigNumberData: [
        {
          bigNumber: { value: '2.1', measure: '%', trend: 'negative' },
          comparison: {
            label: 'vs',
            value: 'LY',
            number: {
              value: '9.2',
              measure: '%',
              trend: 'negative',
              color: '#B91C1C',
            },
          },
        } satisfies BigNumberData,
      ],
      chartLineData: [8800, 12650, 5500, 12450],
    },
  ];

export function getInnovationHomeFourCardTrendMockData(): BigNumberSparkLineCardData[] {
  return [...INNOVATION_HOME_FOUR_CARD_TREND_MOCK];
}

const defaultInnovationHomeBigNumbersTrend: BigNumberSparkLineCardData[] = [
  ...INNOVATION_HOME_FOUR_CARD_TREND_MOCK,
];

export function buildInnovationHomeBffMockData(
  overrides?: Partial<InnovationHomeBffDataPayload>,
): InnovationHomeBffDataPayload {
  return {
    'innovation-home-big-numbers-trend':
      overrides?.['innovation-home-big-numbers-trend'] ??
      defaultInnovationHomeBigNumbersTrend,
    'innovation-home-big-numbers': {
      ...HOW_WE_DO_IT_BIG_NUMBERS_BFF_REF,
      ...overrides?.['innovation-home-big-numbers'],
    },
  };
}

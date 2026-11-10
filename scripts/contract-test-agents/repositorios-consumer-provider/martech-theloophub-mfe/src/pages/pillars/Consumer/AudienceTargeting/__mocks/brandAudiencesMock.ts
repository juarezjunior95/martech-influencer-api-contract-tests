/** BFF view-keys used by Brand Audiences tab. */
export const BRAND_AUDIENCES_BFF_KEYS = {
  CARDS: 'audience-cards',
  BIG_NUMBER_PARTICIPATION: 'big-numbers-participation',
  BIG_NUMBER_POWER: 'big-numbers-power',
  TABLE: 'audience-table',
} as const;

export const BRAND_AUDIENCES_MOCK_CARDS = [
  {
    header: {
      title: 'Test Card 1',
      subtitle: 'Subtitle 1',
      tooltip: 'Tooltip 1',
    },
    data: [
      {
        audience: {
          Male: ['Male_1', 'Male_2'],
          Female: ['Female_1'],
        },
      },
    ],
  },
  {
    header: {
      title: 'Test Card 2',
      subtitle: 'Subtitle 2',
      tooltip: 'Tooltip 2',
    },
    data: [
      {
        bigNumber: '100',
        secondaryInfo: { value: '10%' },
      },
    ],
  },
] as const;

export const MOCK_TABLE_ROWS_WITH_COMPARISON = [
  {
    id: 'row1',
    label: 'Row 1',
    competitor_volume: { chartData: { data: [[1, 2, 3]] } },
  },
  { id: 'row2', label: 'Row 2' },
];

export const MOCK_TABLE_ROWS_WITHOUT_COMPARISON = [
  { id: 'r1', competitor_volume: null },
  {
    id: 'r2',
    competitor_volume: { chartData: { data: [[]] } },
  },
];

export interface MockBrandAudiencesBffResponse {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: Error | null;
  refetch: jest.Mock;
}

const defaultBffData: Record<string, unknown> = {
  [BRAND_AUDIENCES_BFF_KEYS.CARDS]: {
    card: BRAND_AUDIENCES_MOCK_CARDS[0],
  },
  [BRAND_AUDIENCES_BFF_KEYS.BIG_NUMBER_PARTICIPATION]: {
    bigNumber: BRAND_AUDIENCES_MOCK_CARDS[1],
  },
  [BRAND_AUDIENCES_BFF_KEYS.BIG_NUMBER_POWER]: {
    bigNumber: null,
  },
  [BRAND_AUDIENCES_BFF_KEYS.TABLE]: {
    table: { rows: MOCK_TABLE_ROWS_WITH_COMPARISON },
  },
};

export const createMockBrandAudiencesBffResponse = (
  overrides: Partial<MockBrandAudiencesBffResponse> = {},
): MockBrandAudiencesBffResponse => ({
  data: defaultBffData,
  loading: false,
  error: null,
  refetch: jest.fn(),
  ...overrides,
});

export const createMockBrandAudiencesBffResponseEmptyTable = (
  overrides: Partial<MockBrandAudiencesBffResponse> = {},
): MockBrandAudiencesBffResponse =>
  createMockBrandAudiencesBffResponse({
    ...overrides,
    data: {
      ...defaultBffData,
      [BRAND_AUDIENCES_BFF_KEYS.TABLE]: {
        table: { rows: MOCK_TABLE_ROWS_WITHOUT_COMPARISON },
      },
    },
  });

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrandAudience } from './BrandAudience';
import { BrandAudiencesTargetingCardModel } from './types';

const mockBigNumber = jest.fn();
const mockSetHighlightedSegments = jest.fn();

let mockApplied: Record<string, string> = {
  audience_targeting_brands: 'Corona',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (
      { id }: { id: string },
      values?: Record<string, string | number | undefined>,
    ) => {
      if (values?.brand) return `${id}:${values.brand}`;
      return id;
    },
  }),
}));

jest.mock('hooks', () => ({
  useCurrentPage: () => ({ currentPage: 'definition' }),
  usePageFilterApplied: () => ({ applied: mockApplied }),
  useLastDataRefresh: () => ({ lastDataRefresh: null }),
  useDataRefreshForTab: () => ({ isRefreshing: false }),
}));

jest.mock('../../../../hooks', () => ({
  useAudienceTargetingKpiQuarterTags: () => [],
}));

jest.mock('components', () => ({
  ResponsiveBasicContainer: ({
    children,
    dataTestId,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId ?? 'responsive-container'}>{children}</div>
  ),
  Skeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'skeleton'} />
  ),
}));

jest.mock('components/BigNumber', () => ({
  BigNumber: (props: {
    onClick?: () => void;
    isSelected?: boolean;
    dataTestId?: string;
  }) => {
    mockBigNumber(props);
    return (
      <button
        type="button"
        data-testid={props.dataTestId ?? 'big-number-mock'}
        data-selected={String(props.isSelected ?? false)}
        onClick={props.onClick}
      />
    );
  },
}));

jest.mock('components/CustomTooltip/CustomTooltip', () => ({
  CustomTooltip: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('../../../../components', () => ({
  NoDataAvailable: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'no-data-available'} />
  ),
  TooltipContent: () => null,
}));

const mockGetHighlightSegments = jest.fn(
  (_card: BrandAudiencesTargetingCardModel) => [] as string[],
);

jest.mock('./utils', () => {
  const actual = jest.requireActual('./utils');
  return {
    normalizeDefinitionBrandAudienceCards: (
      cards: BrandAudiencesTargetingCardModel[],
    ) => cards,
    getHighlightSegmentsFromBrandAudienceCard: (
      card: BrandAudiencesTargetingCardModel,
    ) => mockGetHighlightSegments(card),
    stripBrandVolumeFromCards: actual.stripBrandVolumeFromCards,
  };
});

const buildCard = (
  title: string,
  data: unknown[] = [],
): BrandAudiencesTargetingCardModel =>
  ({
    header: { title },
    data,
  }) as unknown as BrandAudiencesTargetingCardModel;

describe('BrandAudience edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = { audience_targeting_brands: 'Corona' };
    mockGetHighlightSegments.mockReturnValue([]);
  });

  test('should injects halo empty message with brand name and inline config when halo card is empty', () => {
    const cards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
      buildCard('Halo Audience', []),
    ];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    const haloProps = mockBigNumber.mock.calls[1][0] as {
      emptyStateMessage?: string;
      emptyStateConfig?: { inline?: boolean };
    };

    expect(haloProps.emptyStateMessage).toBe(
      'Consumer.AudienceTargeting.Definition.BrandAudience.haloAudience.emptyMessage:Corona',
    );
    expect(haloProps.emptyStateConfig).toEqual({ inline: true });
  });

  test('should does not inject empty message on Core card when it has no data', () => {
    const cards = [buildCard('Core Audience', [])];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    const coreProps = mockBigNumber.mock.calls[0][0] as {
      emptyStateMessage?: string;
      emptyStateConfig?: { inline?: boolean };
    };

    expect(coreProps.emptyStateMessage).toBeUndefined();
    expect(coreProps.emptyStateConfig).toBeUndefined();
  });

  test('should does not override existing emptyMessage on halo card', () => {
    const cards = [
      {
        header: {
          title: 'Halo Audience',
          emptyMessage: 'Pre-existing message',
          emptyStateConfig: { inline: false },
        },
        data: [],
      } as unknown as BrandAudiencesTargetingCardModel,
    ];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    const haloProps = mockBigNumber.mock.calls[0][0] as {
      emptyStateMessage?: string;
      emptyStateConfig?: { inline?: boolean };
    };

    expect(haloProps.emptyStateMessage).toBe('Pre-existing message');
    expect(haloProps.emptyStateConfig).toEqual({ inline: false });
  });

  test('should does not inject empty message when halo card has data', () => {
    const cards = [
      buildCard('Halo Audience', [{ audience: { gender: ['Female'] } }]),
    ];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    const haloProps = mockBigNumber.mock.calls[0][0] as {
      emptyStateMessage?: string;
    };

    expect(haloProps.emptyStateMessage).toBeUndefined();
  });

  test('should detects halo title case-insensitively', () => {
    const cards = [buildCard('  HALO audience ', [])];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    const haloProps = mockBigNumber.mock.calls[0][0] as {
      emptyStateMessage?: string;
    };

    expect(haloProps.emptyStateMessage).toContain('haloAudience.emptyMessage');
  });

  test('should renders NoDataAvailable when there is no data and not loading', () => {
    render(
      <BrandAudience
        data={[]}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    expect(screen.getByTestId('brand-audience')).toBeInTheDocument();
    expect(mockBigNumber).not.toHaveBeenCalled();
  });

  test('should renders NoDataAvailable when error is provided', () => {
    render(
      <BrandAudience
        data={[
          buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
        ]}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={new Error('BFF error')}
      />,
    );

    expect(screen.getByTestId('brand-audience')).toBeInTheDocument();
    expect(mockBigNumber).not.toHaveBeenCalled();
  });

  test('should renders Skeleton when loading', () => {
    render(
      <BrandAudience
        data={[]}
        isLoading
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    expect(screen.getByTestId('skeleton-brand-audience')).toBeInTheDocument();
  });
});

describe('BrandAudience — card click and selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = { audience_targeting_brands: 'Corona' };
    mockGetHighlightSegments.mockReturnValue(['Male', 'Female']);
  });

  test('should clicking a card calls setHighlightedSegments with its segments', async () => {
    const user = userEvent.setup();
    const cards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
    ];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    await user.click(screen.getByTestId('brand-audience-card-0'));
    expect(mockSetHighlightedSegments).toHaveBeenCalledWith(['Male', 'Female']);
  });

  test('should clicking the same card again deselects it and clears highlighted segments', async () => {
    const user = userEvent.setup();
    const cards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
    ];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    await user.click(screen.getByTestId('brand-audience-card-0'));
    await user.click(screen.getByTestId('brand-audience-card-0'));

    expect(mockSetHighlightedSegments).toHaveBeenLastCalledWith([]);
  });

  test('should card without segments does not get an onClick handler', () => {
    mockGetHighlightSegments.mockReturnValue([]);
    const cards = [buildCard('Core Audience', [])];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    const cardProps = mockBigNumber.mock.calls[0][0] as {
      onClick?: () => void;
    };
    expect(cardProps.onClick).toBeUndefined();
  });
});

describe('BrandAudience — edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = { audience_targeting_brands: 'Corona' };
    mockGetHighlightSegments.mockReturnValue(['Male', 'Female']);
  });

  test('should renders skeleton with dataTestId when isLoading and dataTestId provided', () => {
    const cards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
    ];
    render(
      <BrandAudience
        data={cards}
        isLoading
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    expect(screen.getByTestId('skeleton-brand-audience')).toBeInTheDocument();
  });

  test('should renders skeleton without dataTestId when isLoading and no dataTestId prop', () => {
    const cards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
    ];
    render(
      <BrandAudience
        data={cards}
        isLoading
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  test('should renders card without dataTestId when dataTestId prop is omitted', () => {
    const cards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
    ];
    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    expect(
      screen.queryByTestId('brand-audience-card-0'),
    ).not.toBeInTheDocument();
  });

  test('should builds title with empty brand when audience_targeting_brands is undefined', () => {
    mockApplied = {};
    const cards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
    ];
    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    const containerProps = mockBigNumber.mock.calls[0][0] as {
      dataTestId?: string;
    };
    expect(containerProps.dataTestId).toBe('brand-audience-card-0');
  });
});

describe('BrandAudience — Brand Volume % hidden until 1YP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = { audience_targeting_brands: 'Brahma' };
    mockGetHighlightSegments.mockReturnValue([]);
  });

  test('should not forward brandVolume to BigNumber for Core or Halo cards', () => {
    const cards = [
      {
        header: { title: 'Core Audience' },
        data: [
          {
            audience: {
              gender: ['Male'],
              age: ['25-34'],
              incomeBracket: ['Medium'],
            },
            audienceType: 'core',
            brandVolume: {
              value: '60.4',
              label: 'of Brand Volume',
              measure: '%',
            },
          },
        ],
      },
      {
        header: { title: 'Halo Audience' },
        data: [
          {
            audience: {
              gender: ['Female'],
              age: ['LDA-24'],
              incomeBracket: ['Low'],
            },
            audienceType: 'halo',
            brandVolume: {
              value: '',
              emptyStateMessage: 'No R12M POS volume available',
            },
          },
        ],
      },
    ] as unknown as BrandAudiencesTargetingCardModel[];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    const [coreProps, haloProps] = mockBigNumber.mock.calls.map(
      ([props]) => props as { data: Array<Record<string, unknown>> },
    );

    coreProps.data.forEach((item) => {
      expect(item).not.toHaveProperty('brandVolume');
    });
    haloProps.data.forEach((item) => {
      expect(item).not.toHaveProperty('brandVolume');
    });
  });

  test('should keep audience definitions intact after stripping brandVolume', () => {
    const cards = [
      {
        header: { title: 'Core Audience' },
        data: [
          {
            audience: {
              gender: ['Male'],
              age: ['25-34', '35-44'],
              incomeBracket: ['Medium'],
            },
            audienceType: 'core',
            brandVolume: { value: '60.4', label: 'of Brand Volume' },
          },
        ],
      },
    ] as unknown as BrandAudiencesTargetingCardModel[];

    render(
      <BrandAudience
        data={cards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        error={null}
      />,
    );

    const props = mockBigNumber.mock.calls[0][0] as {
      data: Array<{
        audience?: Record<string, string[]>;
        audienceType?: string;
      }>;
    };

    expect(props.data[0].audience).toEqual({
      gender: ['Male'],
      age: ['25-34', '35-44'],
      incomeBracket: ['Medium'],
    });
    expect(props.data[0].audienceType).toBe('core');
  });
});

describe('BrandAudience — useEffect data reset', () => {
  test('should resets selection and segments when data prop changes', () => {
    const initialCards = [
      buildCard('Core Audience', [{ audience: { gender: ['Male'] } }]),
    ];
    const newCards = [
      buildCard('Core Audience', [{ audience: { gender: ['Female'] } }]),
    ];

    mockGetHighlightSegments.mockReturnValue(['Male']);

    const { rerender } = render(
      <BrandAudience
        data={initialCards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    jest.clearAllMocks();
    mockGetHighlightSegments.mockReturnValue([]);

    rerender(
      <BrandAudience
        data={newCards}
        isLoading={false}
        setHighlightedSegments={mockSetHighlightedSegments}
        dataTestId="brand-audience"
        error={null}
      />,
    );

    expect(mockSetHighlightedSegments).toHaveBeenCalledWith([]);
  });
});

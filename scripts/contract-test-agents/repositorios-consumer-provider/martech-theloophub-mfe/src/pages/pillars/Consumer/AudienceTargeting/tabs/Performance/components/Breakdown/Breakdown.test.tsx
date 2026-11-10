import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Breakdown } from './Breakdown';
import { BreakdownTier } from './types';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (
      { id }: { id: string },
      values?: Record<string, string>,
    ) => {
      if (values?.competitor) return `${id}:${values.competitor}`;
      return id;
    },
  }),
}));

const mockGetOptions = jest.fn();

jest.mock('hooks', () => ({
  usePageFilterApplied: () => ({
    applied: {
      audience_targeting_brands: 'CORONA',
      audience_targeting_brands_comp: 'HEINEKEN',
    },
  }),
  usePageFilterData: () => ({ dataFilters: { some: 'data' } }),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getOptions: (...args: unknown[]) => mockGetOptions(...args),
    }),
  },
}));

jest.mock('components', () => ({
  Alert: ({
    message,
    dataTestId,
  }: {
    message: string;
    dataTestId?: string;
  }) => <div data-testid={dataTestId}>{message}</div>,
  Toggle: ({
    checked,
    onCheckedChange,
    ariaLabel,
  }: {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    ariaLabel: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onCheckedChange(!checked)}
    />
  ),
  ResponsiveBasicContainer: ({
    children,
    dataTestId,
    header,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
    header: { rightContent?: React.ReactNode };
  }) => (
    <div data-testid={dataTestId}>
      {header.rightContent}
      {children}
    </div>
  ),
}));

jest.mock('components/DataStateHandler', () => ({
  DataStateHandler: ({
    children,
    loading,
    error,
    empty,
    dataTestId,
  }: {
    children: React.ReactNode;
    loading?: boolean;
    error?: Error | null;
    empty?: boolean;
    dataTestId?: string;
  }) => {
    if (loading) return <div data-testid={dataTestId}>loading</div>;
    if (error) return <div data-testid={dataTestId}>error</div>;
    if (empty) return <div data-testid={dataTestId}>empty</div>;
    return <>{children}</>;
  },
}));

jest.mock('./components/TierCard', () => ({
  TierCard: ({
    tier,
    showHalo,
    dataTestId,
  }: {
    tier: BreakdownTier;
    showHalo: boolean;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId}
      data-show-halo={String(showHalo)}
      data-tier={tier.tier_level ?? 'unknown'}
      data-tier-name={tier.tier_name ?? ''}
    />
  ),
}));

jest.mock('../../../../components', () => ({
  TooltipContent: () => null,
}));

jest.mock('./Breakdown.styles', () => ({
  StyledTierGrid: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledToggleContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledToggleText: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const TIER_BEER: BreakdownTier = {
  tier_level: 'beer',
  tier_name: 'Beer',
  audiences: {
    core: {
      value: '50.0',
      yoy_change: '1.0',
      yoy_direction: 'up',
      performance_index: '100.0',
      comparison_index: '100.0',
    },
    halo: {
      value: '20.0',
      yoy_change: '0.0',
      yoy_direction: 'neutral',
      performance_index: '95.0',
      comparison_index: '95.0',
    },
    total: {
      value: '70.0',
      yoy_change: '1.0',
      yoy_direction: 'up',
      performance_index: '100.0',
      comparison_index: '100.0',
    },
  },
};

const TIER_BRAND: BreakdownTier = {
  tier_level: 'brand',
  tier_name: 'Brand',
  audiences: {
    core: {
      value: '30.0',
      yoy_change: '0.0',
      yoy_direction: 'neutral',
      performance_index: '100.0',
      comparison_index: '100.0',
    },
    halo: null,
    total: null,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetOptions.mockReturnValue([]);
});

describe('Breakdown', () => {
  describe('DataStateHandler states', () => {
    test('should renders loading state', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[]}
          isLoading
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(screen.getByTestId('breakdown-state')).toHaveTextContent(
        'loading',
      );
    });

    test('should renders error state', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[]}
          isLoading={false}
          error={new Error('fail')}
          dataTestId="breakdown"
        />,
      );
      expect(screen.getByTestId('breakdown-state')).toHaveTextContent('error');
    });

    test('should renders empty state when data is empty and not loading/error', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(screen.getByTestId('breakdown-state')).toHaveTextContent('empty');
    });

    test('should renders tier cards when data is present', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER, TIER_BRAND]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(screen.getByTestId('breakdown-tier-0')).toBeInTheDocument();
      expect(screen.getByTestId('breakdown-tier-1')).toBeInTheDocument();
    });

    test('should replace generic brand and competitor tier names with selected filter labels', () => {
      mockGetOptions.mockImplementation((fieldKey: string) => {
        if (fieldKey === 'audience_targeting_brands') {
          return [{ value: 'CORONA', label: 'Corona' }];
        }
        if (fieldKey === 'audience_targeting_brands_comp') {
          return [{ value: 'HEINEKEN', label: 'Heineken' }];
        }
        return [];
      });

      const tierBrand: BreakdownTier = {
        ...TIER_BRAND,
        tier_name: 'Brand',
      };
      const tierCompetitor: BreakdownTier = {
        ...TIER_BRAND,
        tier_level: 'competitor',
        tier_name: 'Competitor',
      };

      render(
        <Breakdown
          variant="p4w"
          data={[tierBrand, tierCompetitor]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );

      expect(screen.getByTestId('breakdown-tier-0')).toHaveAttribute(
        'data-tier-name',
        'Corona',
      );
      expect(screen.getByTestId('breakdown-tier-1')).toHaveAttribute(
        'data-tier-name',
        'Heineken',
      );
    });

    test('should keep non-generic tier names untouched', () => {
      mockGetOptions.mockImplementation((fieldKey: string) => {
        if (fieldKey === 'audience_targeting_brands') {
          return [{ value: 'CORONA', label: 'Corona' }];
        }
        if (fieldKey === 'audience_targeting_brands_comp') {
          return [{ value: 'HEINEKEN', label: 'Heineken' }];
        }
        return [];
      });

      const tierBrand: BreakdownTier = {
        ...TIER_BRAND,
        tier_name: 'Custom Brand Name',
      };
      const tierCompetitor: BreakdownTier = {
        ...TIER_BRAND,
        tier_level: 'competitor',
        tier_name: 'Custom Competitor Name',
      };

      render(
        <Breakdown
          variant="p4w"
          data={[tierBrand, tierCompetitor]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );

      expect(screen.getByTestId('breakdown-tier-0')).toHaveAttribute(
        'data-tier-name',
        'Custom Brand Name',
      );
      expect(screen.getByTestId('breakdown-tier-1')).toHaveAttribute(
        'data-tier-name',
        'Custom Competitor Name',
      );
    });
  });

  describe('Halo toggle', () => {
    test('should does not render toggle when data is empty', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(
        screen.queryByRole('switch', { name: 'Show Halo Audience' }),
      ).not.toBeInTheDocument();
    });

    test('should does not render toggle when loading', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    });

    test('should does not render toggle when error is set', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={new Error('x')}
          dataTestId="breakdown"
        />,
      );
      expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    });

    test('should renders toggle when data is present and not loading/error', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(
        screen.getByRole('switch', {
          name: 'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
        }),
      ).toBeInTheDocument();
    });

    test('should toggle starts unchecked (showHalo false)', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(
        screen.getByRole('switch', {
          name: 'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
        }),
      ).toHaveAttribute('aria-checked', 'false');
    });

    test('should clicking toggle sets showHalo to true and passes it to TierCard', async () => {
      const user = userEvent.setup();
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );

      const toggle = screen.getByRole('switch', {
        name: 'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
      });
      await user.click(toggle);

      expect(screen.getByTestId('breakdown-tier-0')).toHaveAttribute(
        'data-show-halo',
        'true',
      );
    });

    test('should clicking toggle twice restores showHalo to false', async () => {
      const user = userEvent.setup();
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );

      const toggle = screen.getByRole('switch', {
        name: 'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
      });
      await user.click(toggle);
      await user.click(toggle);

      expect(screen.getByTestId('breakdown-tier-0')).toHaveAttribute(
        'data-show-halo',
        'false',
      );
    });
  });

  describe('competitorWithoutData alert', () => {
    test('should does not render alert when competitorWithoutData is false', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
          competitorWithoutData={false}
        />,
      );
      expect(
        screen.queryByTestId('breakdown-competitor-without-data'),
      ).not.toBeInTheDocument();
    });

    test('should does not render alert by default (prop omitted)', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(
        screen.queryByTestId('breakdown-competitor-without-data'),
      ).not.toBeInTheDocument();
    });

    test('should renders alert when competitorWithoutData is true', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
          competitorWithoutData
        />,
      );
      expect(
        screen.getByTestId('breakdown-competitor-without-data'),
      ).toBeInTheDocument();
    });

    test('should shows competitor label resolved from FilterDataAccessor in alert message', () => {
      mockGetOptions.mockReturnValue([
        { value: 'HEINEKEN', label: 'Heineken' },
      ]);

      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
          competitorWithoutData
        />,
      );

      expect(
        screen.getByTestId('breakdown-competitor-without-data'),
      ).toHaveTextContent(
        'Consumer.AudienceTargeting.Empty.competitorWithoutData:Heineken',
      );
    });

    test('should falls back to raw competitor code when no matching label in options', () => {
      mockGetOptions.mockReturnValue([]);

      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
          competitorWithoutData
        />,
      );

      expect(
        screen.getByTestId('breakdown-competitor-without-data'),
      ).toHaveTextContent(
        'Consumer.AudienceTargeting.Empty.competitorWithoutData:HEINEKEN',
      );
    });
  });

  describe('variant fallback', () => {
    test('should falls back to p4w config for unknown variant', () => {
      render(
        <Breakdown
          variant={'unknown' as never}
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );
      expect(screen.getByTestId('breakdown')).toBeInTheDocument();
    });
  });

  describe('without dataTestId', () => {
    test('should renders tier cards without data-testid when dataTestId is omitted', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
        />,
      );

      expect(screen.queryByTestId('breakdown-tier-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('breakdown-grid')).not.toBeInTheDocument();
    });

    test('should renders competitor alert without data-testid when dataTestId is omitted', () => {
      render(
        <Breakdown
          variant="p4w"
          data={[TIER_BEER]}
          isLoading={false}
          error={null}
          competitorWithoutData
        />,
      );

      expect(
        screen.queryByTestId('breakdown-competitor-without-data'),
      ).not.toBeInTheDocument();
    });
  });

  describe('tier without tier_level', () => {
    test('should renders tier with undefined tier_level using empty-index key', () => {
      const TIER_NO_LEVEL: BreakdownTier = {
        tier_name: 'Unknown',
        audiences: {
          core: {
            value: '10.0',
            yoy_change: null,
            yoy_direction: null,
            performance_index: '100.0',
            comparison_index: '100.0',
          },
          halo: null,
          total: null,
        },
      };

      render(
        <Breakdown
          variant="p4w"
          data={[TIER_NO_LEVEL]}
          isLoading={false}
          error={null}
          dataTestId="breakdown"
        />,
      );

      expect(screen.getByTestId('breakdown-tier-0')).toBeInTheDocument();
    });
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BreakdownSection } from './BreakdownSection';
import { BreakdownTier } from './types';

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Paragraph: ({ children, ...props }: any) => <p {...props}>{children}</p>,
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, ...props }: any) => <span data-testid="icon" {...props} />,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => null,
}));

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('components/DataStateHandler', () => ({
  DataStateHandler: ({ children, loading, error, empty }: any) => (
    <div
      data-testid="data-state-handler"
      data-loading={loading}
      data-error={!!error}
      data-empty={empty}
    >
      {!loading && !error && !empty && children}
    </div>
  ),
}));

jest.mock('components', () => ({
  ContentCard: ({ children, title }: any) => (
    <div data-testid="content-card" data-title={title}>
      {children}
    </div>
  ),
  CustomTooltip: ({ children }: any) => <div>{children}</div>,
  DataStateHandler: ({ children, loading, error, empty }: any) => (
    <div
      data-testid="data-state-handler"
      data-loading={loading}
      data-error={!!error}
      data-empty={empty}
    >
      {!loading && !error && !empty && children}
    </div>
  ),
  Toggle: ({ checked, onCheckedChange, ariaLabel }: any) => (
    <button
      aria-label={ariaLabel}
      onClick={() => onCheckedChange?.(!checked)}
    />
  ),
}));

jest.mock('./components/TierCard', () => ({
  TierCard: ({ tier, showHalo, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'tier-card'}
      data-tier-name={tier.tier_name}
      data-show-halo={showHalo}
    >
      {tier.tier_name}
    </div>
  ),
}));

jest.mock('./constants', () => ({
  BREAKDOWN_CONFIG: {
    participation: {
      titleKey: 'Participation Breakdown',
      metricLabel: 'P4W %',
    },
    occasions: {
      titleKey: 'Occasions Breakdown',
      metricLabel: 'P4W %',
    },
    brandPower: {
      titleKey: 'Brand Power Breakdown',
      metricLabel: '%',
    },
  },
  TIER_ORDER: ['beer', 'core_co', 'brand', 'competitor'],
}));

const buildTiers = (): BreakdownTier[] => [
  {
    tier_level: 'beer',
    tier_name: 'Beer',
    audiences: {
      core: {
        value: 31.2,
        yoy_change: 0.2,
        yoy_direction: 'up',
        comparison_index: 111,
        performance_index: 111,
      },
      halo: {
        value: 29.5,
        yoy_change: 0.4,
        yoy_direction: 'up',
        comparison_index: 105,
        performance_index: 105,
      },
      total: {
        value: 28.0,
        yoy_change: 0.5,
        yoy_direction: 'up',
        comparison_index: null,
        performance_index: null,
      },
    },
  },
  {
    tier_level: 'core_co',
    tier_name: 'Core Co',
    audiences: {
      core: {
        value: 30.5,
        yoy_change: 0.1,
        yoy_direction: 'up',
        comparison_index: 111,
        performance_index: 111,
      },
      halo: {
        value: 28.8,
        yoy_change: 0.6,
        yoy_direction: 'up',
        comparison_index: 105,
        performance_index: 105,
      },
      total: {
        value: 27.5,
        yoy_change: 0.4,
        yoy_direction: 'up',
        comparison_index: 98,
        performance_index: 98,
      },
    },
  },
  {
    tier_level: 'brand',
    tier_name: 'Brahma',
    audiences: {
      core: {
        value: 32.1,
        yoy_change: 0.3,
        yoy_direction: 'up',
        comparison_index: 121,
        performance_index: 121,
      },
      halo: {
        value: 25.8,
        yoy_change: 1.5,
        yoy_direction: 'up',
        comparison_index: 97,
        performance_index: 97,
      },
      total: {
        value: 26.5,
        yoy_change: 2.0,
        yoy_direction: 'up',
        comparison_index: 95,
        performance_index: 95,
      },
    },
  },
  {
    tier_level: 'competitor',
    tier_name: 'Amstel',
    audiences: {
      core: {
        value: 29.8,
        yoy_change: 0.0,
        yoy_direction: 'neutral',
        comparison_index: 115,
        performance_index: 115,
      },
      halo: {
        value: 27.2,
        yoy_change: -0.1,
        yoy_direction: 'down',
        comparison_index: 105,
        performance_index: 105,
      },
      total: {
        value: 25.9,
        yoy_change: -0.2,
        yoy_direction: 'down',
        comparison_index: 93,
        performance_index: 93,
      },
    },
  },
];

describe('BreakdownSection', () => {
  const dataTestId = 'breakdown';
  const defaultProps = {
    variant: 'participation' as const,
    tiers: buildTiers(),
    loading: false,
    error: null,
    dataTestId,
  };

  it('should render the section with title and metric label', () => {
    render(<BreakdownSection {...defaultProps} />);

    expect(screen.getByText(/Participation Breakdown/)).toBeInTheDocument();
    expect(screen.getByText(/P4W %/)).toBeInTheDocument();
  });

  it('should render with occasions variant', () => {
    render(<BreakdownSection {...defaultProps} variant="occasions" />);

    expect(screen.getByText(/Occasions Breakdown/)).toBeInTheDocument();
  });

  it('should render with brandPower variant', () => {
    render(<BreakdownSection {...defaultProps} variant="brandPower" />);

    expect(screen.getByText(/Brand Power Breakdown/)).toBeInTheDocument();
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  it('should render all 4 tier cards', () => {
    render(<BreakdownSection {...defaultProps} />);

    expect(screen.getByText('Beer')).toBeInTheDocument();
    expect(screen.getByText('Core Co')).toBeInTheDocument();
    expect(screen.getByText('Brahma')).toBeInTheDocument();
    expect(screen.getByText('Amstel')).toBeInTheDocument();
  });

  it('should render tiers in correct order', () => {
    const unorderedTiers: BreakdownTier[] = [
      buildTiers()[3],
      buildTiers()[0],
      buildTiers()[2],
      buildTiers()[1],
    ];

    render(<BreakdownSection {...defaultProps} tiers={unorderedTiers} />);

    const tierCards = screen.getAllByTestId(/breakdown-tier-/);
    expect(tierCards[0]).toHaveAttribute('data-tier-name', 'Beer');
    expect(tierCards[1]).toHaveAttribute('data-tier-name', 'Core Co');
    expect(tierCards[2]).toHaveAttribute('data-tier-name', 'Brahma');
    expect(tierCards[3]).toHaveAttribute('data-tier-name', 'Amstel');
  });

  it('should pass showHalo=true to all tier cards when enabled', async () => {
    render(<BreakdownSection {...defaultProps} />);
    const toggleButton = screen.getByRole('button', {
      name: /show halo audience/i,
    });
    await userEvent.click(toggleButton);
    const tierCards = screen.getAllByTestId(/breakdown-tier-/);
    tierCards.forEach((card) => {
      expect(card).toHaveAttribute('data-show-halo', 'true');
    });
  });

  it('should render headerRight slot content', () => {
    render(
      <BreakdownSection
        {...defaultProps}
        headerRight={<button data-testid="toggle-button">Toggle</button>}
      />,
    );

    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  it('should not render headerRight when not provided', () => {
    render(<BreakdownSection {...defaultProps} />);

    expect(screen.queryByTestId('toggle-button')).not.toBeInTheDocument();
  });

  it('should pass loading state to DataStateHandler', () => {
    render(<BreakdownSection {...defaultProps} loading={true} />);

    expect(screen.getByTestId('data-state-handler')).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  it('should pass error state to DataStateHandler', () => {
    render(
      <BreakdownSection {...defaultProps} error={new Error('Test error')} />,
    );

    expect(screen.getByTestId('data-state-handler')).toHaveAttribute(
      'data-error',
      'true',
    );
  });

  it('should pass empty state when tiers array is empty', () => {
    render(<BreakdownSection {...defaultProps} tiers={[]} />);

    expect(screen.getByTestId('data-state-handler')).toHaveAttribute(
      'data-empty',
      'true',
    );
  });

  it('should not show tier cards when loading', () => {
    render(<BreakdownSection {...defaultProps} loading={true} />);

    expect(screen.queryByText('Beer')).not.toBeInTheDocument();
  });

  it('should render grid container with data-testid', () => {
    render(<BreakdownSection {...defaultProps} />);

    expect(screen.getByTestId(`${dataTestId}-grid`)).toBeInTheDocument();
  });

  it('should not render data-testid attributes when prop is not provided', () => {
    render(
      <BreakdownSection
        variant="participation"
        tiers={buildTiers()}
        loading={false}
        error={null}
      />,
    );

    expect(screen.queryByTestId('breakdown')).not.toBeInTheDocument();
    expect(screen.queryByTestId('breakdown-grid')).not.toBeInTheDocument();
  });

  it('should render the Halo toggle label using the i18n key', () => {
    render(<BreakdownSection {...defaultProps} />);
    expect(
      screen.getByText(
        'Consumer.AudienceTargeting.BreakdownToggle.showHaloAudience',
      ),
    ).toBeInTheDocument();
  });
});

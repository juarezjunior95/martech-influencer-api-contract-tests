import { render, screen } from '@testing-library/react';

import { AudienceTargetingError } from '../../constants';
import { Definition } from './Definition';

const mockNavigate = jest.fn();
const mockOpenFilterModal = jest.fn();
const mockBrandAudience = jest.fn();
const mockParticipationBreakdown = jest.fn();

let mockApplied: Record<string, string> = {
  country: 'BRA',
  audience_targeting_brands: 'Corona',
};

let mockCountryOptions: Array<{ value: string; label: string }> = [
  { value: 'BRA', label: 'Brazil' },
  { value: 'ARG', label: 'Argentina' },
];

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (
      { id }: { id: string },
      values?: Record<string, string | number | undefined>,
    ) => {
      if (values?.country) return `${id}:${values.country}`;
      return id;
    },
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('contexts', () => ({
  useScopedModal: () => ({ open: mockOpenFilterModal }),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: () => ({ applied: mockApplied }),
  usePageFilterData: () => ({ dataFilters: {} }),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getCountry: () => ({ label: 'Brazil' }),
      getCountryOptions: () => mockCountryOptions,
    }),
  },
}));

jest.mock('../../components', () => ({
  NoDataAvailable: ({
    dataTestId,
    title,
    description,
    actions = [],
  }: {
    dataTestId?: string;
    title?: string;
    description?: string;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary';
    }>;
  }) => (
    <div data-testid={dataTestId}>
      {title && <p>{title}</p>}
      {description && <p>{description}</p>}
      {actions.map((action) => (
        <button
          key={action.label}
          data-testid={`${dataTestId}-action-${action.label}`}
          data-variant={action.variant ?? 'secondary'}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('./components', () => ({
  BrandAudience: (props: unknown) => {
    mockBrandAudience(props);
    return <div data-testid="brand-audience-mock" />;
  },
  ParticipationBreakdown: (props: unknown) => {
    mockParticipationBreakdown(props);
    return <div data-testid="participation-breakdown-mock" />;
  },
}));

describe('Definition edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = { country: 'BRA', audience_targeting_brands: 'Corona' };
    mockCountryOptions = [
      { value: 'BRA', label: 'Brazil' },
      { value: 'ARG', label: 'Argentina' },
    ];
  });

  // Note: country without data, data refresh fail and permission required
  // are handled globally in AudienceTargeting.tsx (hides tabs + shows
  // page-level NoDataAvailable). See AudienceTargeting.test.tsx.

  test('should renders both sections without errors when called with minimal props', () => {
    render(<Definition dataTestId="definition" />);

    expect(screen.getByTestId('brand-audience-mock')).toBeInTheDocument();
    expect(
      screen.getByTestId('participation-breakdown-mock'),
    ).toBeInTheDocument();

    const brandAudienceProps = mockBrandAudience.mock.calls[0][0] as {
      isLoading: boolean;
    };
    expect(brandAudienceProps.isLoading).toBe(false);
  });

  test('should does not render any empty state when loading is true', () => {
    render(
      <Definition
        dataTestId="definition"
        audienceData={[]}
        breakdownData={null}
        isLoading
        error={null}
      />,
    );

    expect(
      screen.queryByTestId('definition-no-country-data'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('brand-audience-mock')).toBeInTheDocument();
    expect(
      screen.getByTestId('participation-breakdown-mock'),
    ).toBeInTheDocument();
  });

  test('should keeps cards visible and sends competitor error only to ParticipationBreakdown', () => {
    const competitorError = new Error(
      AudienceTargetingError.CompetitorWithoutData,
    );

    render(
      <Definition
        dataTestId="definition"
        audienceData={[
          {
            header: { title: 'Core Audience' },
            data: [{ audience: { gender: ['Male'] } }],
          },
        ]}
        breakdownData={{
          header: [],
          rows: [],
        }}
        isLoading={false}
        error={competitorError}
      />,
    );

    expect(screen.getByTestId('brand-audience-mock')).toBeInTheDocument();
    expect(
      screen.getByTestId('participation-breakdown-mock'),
    ).toBeInTheDocument();

    const brandAudienceProps = mockBrandAudience.mock.calls[0][0] as {
      error: Error | null;
    };
    const participationProps = mockParticipationBreakdown.mock.calls[0][0] as {
      error: Error | null;
    };

    expect(brandAudienceProps.error).toBeNull();
    expect(participationProps.error?.message).toBe(
      AudienceTargetingError.CompetitorWithoutData,
    );
  });
});

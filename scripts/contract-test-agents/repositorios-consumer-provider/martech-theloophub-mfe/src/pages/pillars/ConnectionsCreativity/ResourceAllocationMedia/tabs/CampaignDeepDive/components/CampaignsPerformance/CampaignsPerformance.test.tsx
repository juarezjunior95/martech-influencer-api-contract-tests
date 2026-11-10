import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';
import { usePageFilterApplied } from 'hooks';

import { CampaignsPerformance } from './CampaignsPerformance';

const mockFormatMessage = jest.fn(({ id }) => id);
const mockOpen = jest.fn();
const mockIsGlobalZone = { isGlobalZone: false };

jest.mock('react-intl', () => ({
  useIntl: jest.fn(() => ({
    formatMessage: mockFormatMessage,
  })),
}));

jest.mock('contexts', () => ({
  useScopedModal: jest.fn(() => ({
    open: mockOpen,
  })),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => mockIsGlobalZone),
}));

jest.mock('components', () => ({
  Expandable: {
    Item: ({
      headerCustomized,
      expandableChildren,
      dataTestId,
      ...props
    }: any) => (
      <div data-testid={dataTestId ?? 'expandable-item'} data-id={props.id}>
        <div data-testid="header-customized">{headerCustomized}</div>
        <div data-testid="expandable-children">{expandableChildren}</div>
      </div>
    ),
  },
  NoResultsState: jest.fn(({ dataTestId, type, headerTitleId }: any) => (
    <div
      data-testid={dataTestId ?? 'no-results-state'}
      data-type={type}
      data-header-title-id={headerTitleId}
    />
  )),
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'no-data-yet'} />
  ),
}));

jest.mock('../CampaignsPerformanceHeader/CampaignsPerformanceHeader', () => ({
  CampaignsPerformanceHeader: jest.fn(({ formatMessage }: any) => (
    <div
      data-testid="campaigns-performance-header"
      data-format-message={!!formatMessage}
    />
  )),
}));

jest.mock(
  '../CampaignsPerformanceSkeleton/CampaignsPerformanceSkeleton',
  () => ({
    CampaignsPerformanceSkeleton: jest.fn(({ dataTestId }: any) => (
      <div data-testid={dataTestId ?? 'campaigns-performance-skeleton'} />
    )),
  }),
);

jest.mock('../CampaignTracker/CampaignTracker', () => ({
  CampaignTracker: jest.fn(({ table, formatMessage, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'campaign-tracker'}
      data-table={JSON.stringify(table)}
      data-format-message={!!formatMessage}
    />
  )),
}));

describe('CampaignsPerformance', () => {
  const mockTableData = {
    headers: ['col1', 'col2'],
    rows: [{ col1: 'value1', col2: 'value2' }],
  } as unknown as TableDataType;

  const defaultProps = {
    campaignsPerformance: {
      campaigns_performance: mockTableData,
      loading: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      isGlobalZone: false,
    });
  });

  const renderComponent = (overrideProps = {}) => {
    return render(
      <CampaignsPerformance {...defaultProps} {...overrideProps} />,
    );
  };

  describe('component structure', () => {
    it('renders the Expandable.Item with correct id', () => {
      renderComponent();

      const expandableItem = screen.getByTestId('expandable-item');
      expect(expandableItem).toHaveAttribute('data-id', 'overview-deep-dive');
    });

    it('renders the CampaignsPerformanceHeader with formatMessage', () => {
      renderComponent();

      const header = screen.getByTestId('campaigns-performance-header');
      expect(header).toHaveAttribute('data-format-message', 'true');
    });
  });

  describe('isGlobalZone state', () => {
    it('renders NoResultsState with correct props when isGlobalZone is true', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      renderComponent();

      const noResults = screen.getByTestId('no-results-state');
      expect(noResults).toHaveAttribute('data-type', 'investmentBreakdown');
      expect(noResults).toHaveAttribute(
        'data-header-title-id',
        'ConnectionsCreativity.NoCountrySelected.noCountrySelectedTitle',
      );
      expect(screen.queryByTestId('campaign-tracker')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('campaigns-performance-skeleton'),
      ).not.toBeInTheDocument();
    });

    it('does not render NoResultsState when isGlobalZone is false', () => {
      renderComponent();

      expect(screen.queryByTestId('no-results-state')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('renders CampaignsPerformanceSkeleton when loading is true', () => {
      renderComponent({
        campaignsPerformance: {
          campaigns_performance: mockTableData,
          loading: true,
        },
      });

      screen.getByTestId('campaigns-performance-skeleton');
      expect(screen.queryByTestId('campaign-tracker')).not.toBeInTheDocument();
    });

    it('does not render skeleton when loading is false', () => {
      renderComponent();

      expect(
        screen.queryByTestId('campaigns-performance-skeleton'),
      ).not.toBeInTheDocument();
    });
  });

  describe('data scenarios', () => {
    it('renders CampaignTracker with correct props when data is available', () => {
      renderComponent();

      const tracker = screen.getByTestId('campaign-tracker');
      expect(tracker).toHaveAttribute(
        'data-table',
        JSON.stringify(mockTableData),
      );
      expect(tracker).toHaveAttribute('data-format-message', 'true');
    });

    it.each([
      ['null', null],
      ['undefined', undefined],
    ])('renders NoDataYet when data is %s', (_, dataValue) => {
      renderComponent({
        campaignsPerformance: {
          campaigns_performance: dataValue,
          loading: false,
        },
      });

      screen.getByTestId('no-data-yet');
      expect(screen.queryByTestId('campaign-tracker')).not.toBeInTheDocument();
    });

    it('renders StyledNoDataAvailable with custom data-testid when dataTestId is provided and no data', () => {
      renderComponent({
        campaignsPerformance: {
          campaigns_performance: null,
          loading: false,
        },
        dataTestId: 'custom-test-id',
      });

      const noDataElement = screen.getByTestId(
        'campaigns-performance-no-data-available-custom-test-id',
      );
      expect(noDataElement).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('prioritizes isGlobalZone over loading state', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      renderComponent({
        campaignsPerformance: {
          campaigns_performance: mockTableData,
          loading: true,
        },
      });

      screen.getByTestId('no-results-state');
      expect(
        screen.queryByTestId('campaigns-performance-skeleton'),
      ).not.toBeInTheDocument();
    });

    it('prioritizes loading over no data state', () => {
      renderComponent({
        campaignsPerformance: {
          campaigns_performance: null,
          loading: true,
        },
      });

      screen.getByTestId('campaigns-performance-skeleton');
      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      renderComponent({ dataTestId: 'campaigns-perf' });

      expect(
        screen.getByTestId('campaigns-perf-campaigns-performance'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('campaigns-perf-campaign-tracker'),
      ).toBeInTheDocument();
    });

    it('should pass dataTestId to NoResultsState when provided', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });
      renderComponent({ dataTestId: 'campaigns-perf' });

      expect(
        screen.getByTestId(
          'campaigns-perf-campaigns-performance-no-results-state',
        ),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      renderComponent();

      expect(
        screen.queryByTestId('campaigns-perf-campaigns-performance'),
      ).not.toBeInTheDocument();
      screen.getByTestId('expandable-item');
    });
  });
});

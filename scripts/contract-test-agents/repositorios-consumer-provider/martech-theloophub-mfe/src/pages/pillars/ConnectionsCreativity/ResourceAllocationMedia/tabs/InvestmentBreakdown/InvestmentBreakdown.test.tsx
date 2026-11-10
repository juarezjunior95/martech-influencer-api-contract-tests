import { render, screen } from '@testing-library/react';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { usePageFilterApplied } from 'hooks';

import { useKpiRequests } from './hooks/useKpiRequests';
import { InvestmentBreakdown } from './InvestmentBreakdown';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockApplied = { country: 'BR' };
const mockIsGlobalZone = { applied: mockApplied, isGlobalZone: false };
const mockKpiRequests = {
  data: { investment_breakdown: { headers: [], rows: [] } },
  loading: false,
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => mockIsGlobalZone),
}));

jest.mock('./hooks/useKpiRequests', () => ({
  useKpiRequests: jest.fn(() => mockKpiRequests),
}));

jest.mock('components', () => ({
  Alert: ({
    type,
    title,
    message,
    dataTestId,
  }: {
    type: string;
    title: string;
    message: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'alert'}
      data-type={type}
      data-title={title}
      data-message={message}
    />
  ),
  BasicContainer: ({
    header,
    layout,
    children,
    dataTestId,
    ...props
  }: {
    header: {
      title: string;
      titleSize: string;
      tooltip: React.ReactNode;
      rightContent: React.ReactNode;
    };
    layout: Record<string, unknown>;
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId ?? props['data-testid'] ?? 'basic-container'}>
      <div data-testid="header-title">{header.title}</div>
      <div data-testid="header-title-size">{header.titleSize}</div>
      <div data-testid="header-tooltip">{header.tooltip}</div>
      <div data-testid="header-right-content">{header.rightContent}</div>
      <div data-testid="layout" data-layout={JSON.stringify(layout)} />
      {children}
    </div>
  ),
  CountryFlag: () => <div data-testid="country-flag" />,
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children, size, ...props }: any) => (
    <div
      data-testid={props['data-testid'] ?? 'styled-tooltip'}
      data-size={size}
    >
      {children}
    </div>
  ),
}));

jest.mock('pages/components', () => ({
  InvestmentBreakdownContainer: ({
    data,
    loading,
    dataTestId,
  }: {
    data: unknown;
    loading: boolean;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'investment-breakdown-container'}
      data-loading={String(loading)}
      data-has-data={!!data}
    />
  ),
}));

describe('InvestmentBreakdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePageFilterApplied as jest.Mock).mockReturnValue(mockIsGlobalZone);
    (useKpiRequests as jest.Mock).mockReturnValue(mockKpiRequests);
  });

  it('renders main components and calls useDataRefreshForTab', () => {
    render(<InvestmentBreakdown />);

    screen.getByTestId('basic-container');
    screen.getByTestId('investment-breakdown-container');
    screen.getByTestId('country-flag');
    expect(useDataRefreshForTab).toHaveBeenCalledWith(
      'Resource Allocation - Investment Breakdown',
    );
  });

  describe('Header configuration', () => {
    it('renders header with title, H2 size, and tooltip', () => {
      render(<InvestmentBreakdown />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.title',
      });
      expect(screen.getByTestId('header-title-size')).toHaveTextContent('H2');
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.tooltip',
      });
      const tooltip = screen.getByTestId('styled-tooltip');
      expect(tooltip).toHaveAttribute('data-size', 'small');
    });
  });

  describe('USA alert', () => {
    it('renders Alert with correct type and messages when country is USA', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: { country: 'USA' },
        isGlobalZone: false,
      });

      render(<InvestmentBreakdown />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-type', 'warning');
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.USA.alert.title',
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.USA.alert.message',
      });
    });

    it.each([
      ['BR', { country: 'BR' }],
      ['null', { country: null }],
    ])('does not render Alert when country is %s', (_, applied) => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        applied,
        isGlobalZone: false,
      });

      render(<InvestmentBreakdown />);

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
  });

  describe('Data fetching and loading states', () => {
    it('calls hooks and passes data to InvestmentBreakdownContainer', () => {
      const mockData = { headers: ['col1'], rows: [{ col1: 'value' }] };
      (useKpiRequests as jest.Mock).mockReturnValue({
        data: { investment_breakdown: mockData },
        loading: false,
      });

      render(<InvestmentBreakdown />);

      expect(usePageFilterApplied).toHaveBeenCalledWith(
        'connections-creativity_media-campaign-results',
      );
      expect(useKpiRequests).toHaveBeenCalledWith();
      const container = screen.getByTestId('investment-breakdown-container');
      expect(container).toHaveAttribute('data-has-data', 'true');
      expect(container).toHaveAttribute('data-loading', 'false');
    });

    it('passes loading state to InvestmentBreakdownContainer', () => {
      (useKpiRequests as jest.Mock).mockReturnValue({
        data: { investment_breakdown: null },
        loading: true,
      });

      render(<InvestmentBreakdown />);

      expect(
        screen.getByTestId('investment-breakdown-container'),
      ).toHaveAttribute('data-loading', 'true');
    });
  });

  it('configures layout correctly', () => {
    render(<InvestmentBreakdown />);

    const layout = screen.getByTestId('layout');
    const layoutData = JSON.parse(layout.getAttribute('data-layout') || '{}');

    expect(layoutData).toEqual({
      border: 'small',
      headerPadding: 'small',
      bodyPadding: true,
    });
  });

  it('renders error Alert when error occurs', () => {
    const mockError = new Error('API Error');
    (useKpiRequests as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
    });

    render(<InvestmentBreakdown />);

    const errorAlert = screen.getByTestId('alert');
    expect(errorAlert).toHaveAttribute('data-type', 'error');
    expect(errorAlert).toHaveAttribute('data-message', 'API Error');
    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.error.title',
      defaultMessage: 'Error loading data',
    });
  });

  describe('data-testid rendering', () => {
    it('renders custom data-testid when provided', () => {
      render(<InvestmentBreakdown dataTestId="inv-breakdown" />);
      expect(
        screen.getByTestId('inv-breakdown-investment-breakdown'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('inv-breakdown-investment-breakdown-tooltip'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('inv-breakdown-investment-breakdown-container'),
      ).toBeInTheDocument();
    });

    it('renders custom data-testid for Alert when country is USA', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: { country: 'USA' },
        isGlobalZone: false,
      });
      render(<InvestmentBreakdown dataTestId="inv-breakdown" />);

      expect(
        screen.getByTestId('inv-breakdown-investment-breakdown-alert'),
      ).toBeInTheDocument();
    });

    it('renders custom data-testid for error Alert', () => {
      (useKpiRequests as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: new Error('Test error'),
      });
      render(<InvestmentBreakdown dataTestId="inv-breakdown" />);

      expect(
        screen.getByTestId('inv-breakdown-investment-breakdown-error'),
      ).toBeInTheDocument();
    });

    it('renders default data-testid when not provided', () => {
      render(<InvestmentBreakdown />);

      expect(
        screen.queryByTestId('inv-breakdown-investment-breakdown'),
      ).not.toBeInTheDocument();
      screen.getByTestId('basic-container');
    });
  });
});

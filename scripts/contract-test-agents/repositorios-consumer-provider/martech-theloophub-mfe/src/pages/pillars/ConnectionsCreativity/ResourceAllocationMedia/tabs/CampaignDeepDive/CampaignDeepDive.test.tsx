import { render, screen } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';

import { CampaignDeepDive } from './CampaignDeepDive';
import { useKpiRequests } from './hooks/useKpiRequests';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockLastDataRefreshKpisFormated = { media: '2025-01-15' };
const mockKpiRequests = {
  data: {
    campaigns_performance: { headers: [], rows: [] },
  },
  loading: false,
  error: null,
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('./hooks/useKpiRequests', () => ({
  useKpiRequests: jest.fn(() => mockKpiRequests),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(() => ({
    lastDataRefreshKpisFormated: mockLastDataRefreshKpisFormated,
  })),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    layout,
    children,
    dataTestId,
  }: {
    header: {
      title: string;
      titleSize: string;
      rightContent: React.ReactNode;
      bottomTag: React.ReactNode;
    };
    layout: Record<string, unknown>;
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId ?? 'basic-container'}>
      <div data-testid="header-title">{header.title}</div>
      <div data-testid="header-title-size">{header.titleSize}</div>
      <div data-testid="header-right-content">{header.rightContent}</div>
      <div data-testid="header-bottom-tag">{header.bottomTag}</div>
      <div data-testid="layout" data-layout={JSON.stringify(layout)} />
      <div data-testid="children">{children}</div>
    </div>
  ),
  CountryFlag: () => <div data-testid="country-flag" />,
  Tag: ({ Icon, text }: { Icon: React.ComponentType; text: string }) => (
    <div data-testid="tag" data-text={text}>
      <Icon />
    </div>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  CalendarClock: () => <span data-testid="calendar-clock-icon" />,
}));

jest.mock('./CampaignDeepDive.styles', () => ({
  StyledCampaignDeepDiveContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid'] ?? 'campaign-deep-dive-container'}>
      {children}
    </div>
  ),
}));

jest.mock('./components', () => ({
  CampaignsPerformance: ({
    campaignsPerformance,
    dataTestId,
  }: {
    campaignsPerformance: { campaigns_performance: unknown; loading: boolean };
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'campaigns-performance'}
      data-loading={String(campaignsPerformance.loading)}
      data-data={JSON.stringify(campaignsPerformance.campaigns_performance)}
    />
  ),
}));

describe('CampaignDeepDive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLastDataRefresh as jest.Mock).mockReturnValue({
      lastDataRefreshKpisFormated: mockLastDataRefreshKpisFormated,
    });
    (useKpiRequests as jest.Mock).mockReturnValue(mockKpiRequests);
  });

  it('renders main components', () => {
    render(<CampaignDeepDive />);

    expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    expect(
      screen.getByTestId('campaign-deep-dive-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('campaigns-performance')).toBeInTheDocument();
  });

  describe('Header configuration', () => {
    it('renders header with title, H2 size, and CountryFlag', () => {
      render(<CampaignDeepDive />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.CampaignDeepDiveTab.title',
      });
      expect(screen.getByTestId('header-title-size')).toHaveTextContent('H2');
      screen.getByTestId('country-flag');
    });

    it.each([
      [
        'renders Tag with lastDataRefresh when available',
        { media: '2025-01-15' },
        true,
        ': 2025-01-15',
      ],
      [
        'does not render Tag when lastDataRefresh is not available',
        { media: null },
        false,
        null,
      ],
    ])('%s', (_, lastDataRefresh, shouldRender, expectedText) => {
      (useLastDataRefresh as jest.Mock).mockReturnValue({
        lastDataRefreshKpisFormated: lastDataRefresh,
      });

      render(<CampaignDeepDive />);

      if (shouldRender) {
        const tag = screen.getByTestId('tag');
        expect(tag).toHaveAttribute('data-text', expectedText);
        screen.getByTestId('calendar-clock-icon');
      } else {
        expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
      }
    });
  });

  describe('layout configuration', () => {
    it('passes correct layout props to BasicContainer', () => {
      render(<CampaignDeepDive />);

      const layout = screen.getByTestId('layout');
      const layoutData = JSON.parse(layout.getAttribute('data-layout') || '{}');

      expect(layoutData).toEqual({
        border: 'small',
        shadow: 'small',
        headerPadding: 'small',
        bodyPadding: true,
      });
    });
  });

  describe('Data fetching and loading states', () => {
    it('calls useKpiRequests and passes data to CampaignsPerformance', () => {
      const mockData = { headers: ['col1'], rows: [{ col1: 'value' }] };
      (useKpiRequests as jest.Mock).mockReturnValue({
        data: { campaigns_performance: mockData },
        loading: false,
        error: null,
      });

      render(<CampaignDeepDive />);

      expect(useKpiRequests).toHaveBeenCalledTimes(1);
      const component = screen.getByTestId('campaigns-performance');
      expect(component).toHaveAttribute('data-data', JSON.stringify(mockData));
      expect(component).toHaveAttribute('data-loading', 'false');
    });

    it.each([
      ['loading', true, 'true'],
      ['not loading', false, 'false'],
    ])('renders correctly when %s', (_, loading, expectedLoading) => {
      (useKpiRequests as jest.Mock).mockReturnValue({
        data: { campaigns_performance: null },
        loading,
        error: null,
      });

      render(<CampaignDeepDive />);

      expect(screen.getByTestId('campaigns-performance')).toHaveAttribute(
        'data-loading',
        expectedLoading,
      );
    });
  });

  describe('data-testid rendering', () => {
    it('renders custom data-testid when dataTestId is provided', () => {
      render(<CampaignDeepDive dataTestId="campaign-deep-dive" />);

      expect(
        screen.getByTestId('campaign-deep-dive-campaign-deep-dive'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('campaign-deep-dive-container-campaign-deep-dive'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('campaign-deep-dive-campaigns-performance'),
      ).toBeInTheDocument();
    });

    it('renders default data-testid when dataTestId is not provided', () => {
      render(<CampaignDeepDive />);

      expect(
        screen.queryByTestId('campaign-deep-dive-campaign-deep-dive'),
      ).not.toBeInTheDocument();
      screen.getByTestId('basic-container');
      screen.getByTestId('campaign-deep-dive-container');
    });
  });
});

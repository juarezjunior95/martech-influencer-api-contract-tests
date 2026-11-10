import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';
import { useSubFilters } from 'hooks';

import { useKpiRequests } from './hooks/useKpiRequests';
import { MediaDrilldoown } from './MediaDrilldoown';

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
}));

jest.mock('hooks', () => ({
  useSubFilters: jest.fn(),
}));

jest.mock('./hooks/useKpiRequests', () => ({
  useKpiRequests: jest.fn(),
}));

jest.mock('./components/BubbleChartHeader/BubbleChartHeader', () => ({
  BubbleHeader: () => <div data-testid="bubble-header">BubbleHeader</div>,
}));

jest.mock('components/Chart/Bubble', () => ({
  BubbleChart: () => <div data-testid="bubble-chart">BubbleChart</div>,
}));

jest.mock('components', () => ({
  CountryFlag: () => <div data-testid="country-flag">CountryFlag</div>,
  Expandable: {
    Item: ({ headerCustomized, expandableChildren, dataTestId }: any) => (
      <div data-testid={dataTestId || 'expandable-item'}>
        {headerCustomized}
        {expandableChildren}
      </div>
    ),
  },
  Legend: ({ dataTestId }: any) => (
    <div data-testid={dataTestId || 'legend'}>Legend</div>
  ),
  Skeleton: ({ dataTestId }: any) => (
    <div data-testid={dataTestId || 'skeleton'}>Loading...</div>
  ),
  Tag: ({ text }: any) => <span data-testid="tag">{text}</span>,
}));

jest.mock('components/BasicContainer', () => ({
  BasicContainer: ({ children, header, ...props }: any) => (
    <div data-testid="basic-container" {...props}>
      {header?.bottomTag}
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledNoDataYet: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

const mockUseLastDataRefresh = useLastDataRefresh as jest.Mock;
const mockUseSubFilters = useSubFilters as jest.Mock;
const mockUseKpiRequests = useKpiRequests as jest.Mock;

const renderComponent = () => {
  return render(
    <IntlProvider locale="en" messages={{}}>
      <MediaDrilldoown />
    </IntlProvider>,
  );
};

const defaultChartsMock = {
  mediaQwoa: { data: {}, loading: false },
  nonWorkingMoney: { data: {}, loading: false },
  campaignQwoa: { data: {}, loading: false },
};

describe('MediaDrilldoown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisFormated: { media: '2024-01-15' },
    });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: { kpis: 'media_qwoa' },
    });
  });

  it('renders Skeleton when data is loading', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: {
        ...defaultChartsMock,
        mediaQwoa: { data: {}, loading: true },
      },
    });

    renderComponent();

    screen.getByTestId('skeleton');
    expect(screen.queryByTestId('bubble-chart')).not.toBeInTheDocument();
  });

  it('renders "Data not available" when data is empty', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: {
        ...defaultChartsMock,
        mediaQwoa: {
          data: { media_qwoa: { empty: true } },
          loading: false,
        },
      },
    });

    renderComponent();

    expect(screen.getByText('Data not available')).toBeInTheDocument();
  });

  it('renders BubbleChart and Legend when data is available', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: {
        ...defaultChartsMock,
        mediaQwoa: {
          data: {
            media_qwoa: {
              Chart: { datasets: [] },
              Legend: [{ label: 'Test' }],
            },
          },
          loading: false,
        },
      },
    });

    renderComponent();

    screen.getByTestId('bubble-chart');
    screen.getByTestId('legend');
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('does not render Legend when data has no Legend', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: {
        ...defaultChartsMock,
        mediaQwoa: {
          data: {
            media_qwoa: {
              Chart: { datasets: [] },
            },
          },
          loading: false,
        },
      },
    });

    renderComponent();

    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });

  it('renders BubbleHeader and calls useKpiRequests', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: defaultChartsMock,
    });

    renderComponent();

    screen.getByTestId('bubble-header');
    expect(mockUseKpiRequests).toHaveBeenCalledWith();
  });

  it('renders tag with last data refresh date when available', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: {
        ...defaultChartsMock,
        mediaQwoa: { data: {}, loading: true },
      },
    });

    renderComponent();

    expect(screen.getByTestId('tag')).toBeInTheDocument();
    expect(screen.getByText(': 2024-01-15')).toBeInTheDocument();
  });

  it('does not render tag when last data refresh is not available', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisFormated: { media: null },
    });
    mockUseKpiRequests.mockReturnValue({
      charts: {
        ...defaultChartsMock,
        mediaQwoa: { data: {}, loading: true },
      },
    });

    renderComponent();

    expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
  });

  describe('Custom data-testid', () => {
    it('renders custom data-testid for empty state', () => {
      mockUseKpiRequests.mockReturnValue({
        charts: {
          ...defaultChartsMock,
          mediaQwoa: {
            data: { media_qwoa: { empty: true } },
            loading: false,
          },
        },
      });

      render(
        <IntlProvider locale="en" messages={{}}>
          <MediaDrilldoown dataTestId="test-id" />
        </IntlProvider>,
      );

      expect(
        screen.getByTestId('test-id-media-drilldown-no-data-yet'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('media-drilldown-no-data-yet-icon-test-id'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('media-drilldown-no-data-yet-text-test-id'),
      ).toBeInTheDocument();
    });

    it('renders custom data-testid for loading state', () => {
      mockUseKpiRequests.mockReturnValue({
        charts: {
          ...defaultChartsMock,
          mediaQwoa: { data: {}, loading: true },
        },
      });

      render(
        <IntlProvider locale="en" messages={{}}>
          <MediaDrilldoown dataTestId="test-id" />
        </IntlProvider>,
      );

      expect(
        screen.getByTestId('test-id-media-drilldown-skeleton'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-id-media-drilldown-expandable-item'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('media-drilldown-test-id')).toBeInTheDocument();
    });

    it('renders custom data-testid for chart and legend', () => {
      mockUseKpiRequests.mockReturnValue({
        charts: {
          ...defaultChartsMock,
          mediaQwoa: {
            data: {
              media_qwoa: {
                Chart: { datasets: [] },
                Legend: [{ label: 'Test' }],
              },
            },
            loading: false,
          },
        },
      });

      render(
        <IntlProvider locale="en" messages={{}}>
          <MediaDrilldoown dataTestId="test-id" />
        </IntlProvider>,
      );

      expect(
        screen.getByTestId('test-id-media-drilldown-legend'),
      ).toBeInTheDocument();
    });
  });
});

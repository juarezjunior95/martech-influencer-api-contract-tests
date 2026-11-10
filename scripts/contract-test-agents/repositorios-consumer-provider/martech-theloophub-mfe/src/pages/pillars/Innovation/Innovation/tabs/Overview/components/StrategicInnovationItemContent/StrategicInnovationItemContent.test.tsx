import { render, screen } from '@testing-library/react';

import { StrategicInnovationData } from '../../types';
import { StrategicInnovationItemContent } from './StrategicInnovationItemContent';

const mockNoResultsState = jest.fn((props: { dataTestId?: string }) => (
  <div data-testid={props.dataTestId}>NoResultsState</div>
));

const mockNoDataYet = jest.fn(
  (props: { dataTestId?: string; description?: string }) => (
    <div
      data-testid={props.dataTestId}
      data-description={props.description ?? ''}
    >
      NoDataYet
    </div>
  ),
);

const mockPortfolio = jest.fn(
  (props: { dataTestId?: string; data?: unknown }) => (
    <div
      data-testid={props.dataTestId}
      data-health={JSON.stringify(props.data)}
    />
  ),
);

const mockChartSection = jest.fn(
  (props: { dataTestId?: string; id?: string; data?: unknown }) => (
    <div
      data-testid={props.dataTestId}
      data-chart-id={props.id}
      data-chart={JSON.stringify(props.data)}
    />
  ),
);

jest.mock('components', () => ({
  NoResultsState: (props: Record<string, unknown>) =>
    mockNoResultsState(props as never),
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => mockNoDataYet(props as never),
}));

jest.mock(
  '../StrategicInnovationPortfolio/StrategicInnovationPortfolio',
  () => ({
    StrategicInnovationPortfolio: (props: Record<string, unknown>) =>
      mockPortfolio(props as never),
  }),
);

jest.mock(
  '../StrategicInnovationChartSection/StrategicInnovationChartSection',
  () => ({
    StrategicInnovationChartSection: (props: Record<string, unknown>) =>
      mockChartSection(props as never),
  }),
);

jest.mock('../../constants', () => ({
  ...jest.requireActual('../../constants'),
  NO_RESULTS_STATE_KPIS: ['no-results-kpi'],
}));

const createItem = (
  overrides: Partial<StrategicInnovationData>,
): StrategicInnovationData => ({
  id: 'packPrice',
  headerColor: '#FFFFFF',
  chartSection: { bigNumber: { data: [] } },
  ...overrides,
});

const renderComponent = (item: StrategicInnovationData, dataTestId?: string) =>
  render(
    <StrategicInnovationItemContent item={item} dataTestId={dataTestId} />,
  );

const chartSectionWithData = {
  bigNumber: { data: [{ bigNumber: { value: '10' } }] },
  chart: {
    labels: ['2021', '2022'],
    datasets: [{ data: [10, 20] }],
  },
};

describe('StrategicInnovationItemContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart section when chartSection has keys and item is not empty', () => {
    const item = createItem({
      id: 'renovation',
      chartSection: chartSectionWithData,
    });

    renderComponent(item);

    expect(mockChartSection).toHaveBeenCalledWith(
      expect.objectContaining({
        data: item.chartSection,
        id: 'renovation',
      }),
    );
    expect(mockNoDataYet).not.toHaveBeenCalled();
    expect(mockPortfolio).not.toHaveBeenCalled();
  });

  it('shows NoDataYet when item.empty even if chartSection has data', () => {
    const item = createItem({ empty: true });

    renderComponent(item);

    expect(mockNoDataYet).toHaveBeenCalledTimes(1);
    expect(mockNoResultsState).not.toHaveBeenCalled();
    expect(mockChartSection).not.toHaveBeenCalled();
  });

  it('shows NoDataYet when chartSection has no keys', () => {
    const item = createItem({ chartSection: {} });

    renderComponent(item);

    expect(mockNoDataYet).toHaveBeenCalledTimes(1);
    expect(mockChartSection).not.toHaveBeenCalled();
  });

  it('shows NoDataYet with description when chartSection is empty and noticeMessage is set', () => {
    const noticeMessage = 'Data not available for this country';
    const item = createItem({ chartSection: {}, noticeMessage });

    renderComponent(item);

    expect(mockNoDataYet).toHaveBeenCalledWith(
      expect.objectContaining({
        description: noticeMessage,
      }),
    );
    expect(mockChartSection).not.toHaveBeenCalled();
  });

  it('renders portfolio plus no-results panel when portfolio has non-empty health', () => {
    const healthData = {
      id: 'health',
      period: "H1'25",
      bigNumbers: [],
      legend: [],
    };
    const item = createItem({
      id: 'portfolio',
      health: healthData,
      chartSection: chartSectionWithData,
    });

    renderComponent(item);

    expect(mockPortfolio).toHaveBeenCalledWith(
      expect.objectContaining({ data: healthData }),
    );
    expect(mockNoResultsState).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'strategicInnovationPillars',
        openModal: null,
        descriptionId:
          'Innovation.Innovation.Overview.StrategicInnovationPillars.noDataAvailable',
      }),
    );
    expect(mockChartSection).not.toHaveBeenCalled();
  });

  it('treats portfolio with empty health object like a normal chart row', () => {
    const item = createItem({
      id: 'portfolio',
      health: {} as StrategicInnovationData['health'],
      chartSection: chartSectionWithData,
    });

    renderComponent(item);

    expect(mockPortfolio).not.toHaveBeenCalled();
    expect(mockChartSection).toHaveBeenCalled();
  });

  it('renders NoResultsState branch when item id is in NO_RESULTS_STATE_KPIS', () => {
    const item = createItem({ id: 'no-results-kpi', chartSection: {} });

    renderComponent(item, 'kpi');

    expect(mockNoResultsState).toHaveBeenCalled();
    expect(mockChartSection).not.toHaveBeenCalled();
    expect(mockNoDataYet).not.toHaveBeenCalled();
  });

  describe('dataTestId', () => {
    it.each(['test-item', 'test-item-123_special'])(
      'prefixes content and chart section for chart layout (%s)',
      (prefix) => {
        const item = createItem({
          chartSection: {
            bigNumber: { data: [{ bigNumber: { value: '10' } }] },
          },
        });

        renderComponent(item, prefix);

        expect(screen.getByTestId(`${prefix}-content`)).toContainElement(
          screen.getByTestId(`${prefix}-chart-section`),
        );
        expect(mockChartSection).toHaveBeenCalledWith(
          expect.objectContaining({ dataTestId: `${prefix}-chart-section` }),
        );
      },
    );

    it('does not emit content or chart data-testids when dataTestId is omitted', () => {
      const item = createItem({
        chartSection: { bigNumber: { data: [{ bigNumber: { value: '10' } }] } },
      });

      const { container } = renderComponent(item);

      expect(
        Array.from(container.querySelectorAll('[data-testid]')).some((el) =>
          (el as HTMLElement).dataset.testid?.endsWith('-content'),
        ),
      ).toBe(false);
      expect(mockChartSection).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });

    it('prefixes portfolio, no-results, and wraps portfolio inside content', () => {
      const healthData = {
        id: 'health',
        period: "H1'25",
        bigNumbers: [],
        legend: [],
      };
      const item = createItem({
        id: 'portfolio',
        health: healthData,
        chartSection: chartSectionWithData,
      });

      renderComponent(item, 'p');

      expect(screen.getByTestId('p-content')).toContainElement(
        screen.getByTestId('p-portfolio'),
      );
      expect(mockPortfolio).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: 'p-portfolio' }),
      );
      expect(mockNoResultsState).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'p-no-results-state-content',
        }),
      );
      expect(
        document.querySelector('[data-testid="p-no-results-state"]'),
      ).toBeInTheDocument();
    });

    it('prefixes NoDataYet for empty and notice-only states', () => {
      const { rerender } = renderComponent(createItem({ empty: true }), 't');

      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: 't-no-data-yet' }),
      );
      expect(
        document.querySelector('[data-testid="t-no-data-yet-container"]'),
      ).toBeInTheDocument();

      rerender(
        <StrategicInnovationItemContent
          item={createItem({
            chartSection: {},
            noticeMessage: 'No country data',
          })}
          dataTestId="t"
        />,
      );

      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 't-no-data-yet-for-this-country',
          description: 'No country data',
        }),
      );
      expect(
        document.querySelector(
          '[data-testid="t-no-data-yet-for-this-country-container"]',
        ),
      ).toBeInTheDocument();
    });

    it('drops chart content test id when rerendering from chart to empty state', () => {
      const chartItem = createItem({
        chartSection: { bigNumber: { data: [{ bigNumber: { value: '10' } }] } },
      });

      const { rerender } = renderComponent(chartItem, 'x');

      expect(screen.getByTestId('x-content')).toBeInTheDocument();

      rerender(
        <StrategicInnovationItemContent
          item={createItem({ empty: true })}
          dataTestId="x"
        />,
      );

      expect(screen.queryByTestId('x-content')).not.toBeInTheDocument();
      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: 'x-no-data-yet' }),
      );
    });
  });
});

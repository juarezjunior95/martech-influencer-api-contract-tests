import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { rootReducer } from 'redux/store';

import { BigNumbers } from './BigNumbers';

const mockUseSubFilters = jest.fn(() => ({
  activeSubFilters: {} as Record<string, string>,
}));

jest.mock('hooks', () => ({
  useSubFilters: () => mockUseSubFilters(),
}));

jest.mock('react-intl', () => ({
  IntlProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useIntl: () => ({
    formatMessage: jest.fn(({ id }) => id),
  }),
}));

jest.mock('components', () => ({
  BigNumber: ({
    header,
    data,
    asCard,
    size,
    fullWidth,
    dataTestId,
    onClick,
    orientation,
  }: {
    header: React.ReactNode;
    data: unknown;
    asCard?: boolean;
    size?: string;
    fullWidth?: boolean;
    dataTestId?: string;
    onClick?: () => void;
    orientation?: string;
  }) => {
    const Root = onClick ? 'button' : 'div';

    return (
      <Root
        type={onClick ? 'button' : undefined}
        data-testid={dataTestId}
        data-size={size}
        data-as-card={String(asCard)}
        data-full-width={String(fullWidth)}
        data-orientation={orientation}
        onClick={onClick}
      >
        {header}
        <div data-testid="big-number-data">{JSON.stringify(data)}</div>
      </Root>
    );
  },
  ChartHeader: ({
    title,
    measure,
    info,
    period,
    config,
    dataTestId,
  }: {
    title: React.ReactNode;
    measure: React.ReactNode;
    info: React.ReactNode;
    period: React.ReactNode;
    config: unknown;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId}>
      <div data-testid="chart-header-title">{title}</div>
      <div data-testid="chart-header-measure">{measure}</div>
      <div data-testid="chart-header-info">{info}</div>
      <div data-testid="chart-header-period">{period}</div>
      <div data-testid="chart-header-config">{JSON.stringify(config)}</div>
    </div>
  ),
  Skeleton: ({
    dataTestId,
    ...props
  }: { dataTestId?: string } & Record<string, unknown>) => (
    <div data-testid={dataTestId} data-skeleton="true" {...props} />
  ),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      subFilters: {
        activeSubFilters: {},
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        hiddenSubFilters: {},
      },
    },
  });

  return (
    <Provider store={store}>
      <IntlProvider locale="pt-BR" messages={{}}>
        {children}
      </IntlProvider>
    </Provider>
  );
};

const renderComponent = (props: React.ComponentProps<typeof BigNumbers>) =>
  render(
    <TestWrapper>
      <BigNumbers {...props} />
    </TestWrapper>,
  );

describe('BigNumbers Component', () => {
  const mockData = [
    {
      id: 'volume',
      period: '2023 Q4',
      data: [
        {
          value: 42,
          label: 'Main Value',
        },
      ],
    },
    {
      id: 'volumeMix',
      period: '2023 Q4',
      data: [
        {
          value: 12.5,
          label: 'Growth',
        },
      ],
    },
  ];

  beforeEach(() => {
    mockUseSubFilters.mockReturnValue({ activeSubFilters: {} });
  });

  it('renders the container and one row per data item', () => {
    renderComponent({ data: mockData as any[] });

    expect(
      document.querySelector('.big-numbers-container'),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.big-number-item')).toHaveLength(2);
  });

  it('maps each item to ChartHeader ids, measures, periods, and BigNumber payload', () => {
    renderComponent({ data: mockData as any[] });

    screen.getAllByTestId('chart-header-period').forEach((period) => {
      expect(period).toHaveTextContent('2023 Q4');
    });

    const titleElements = screen.getAllByTestId('chart-header-title');
    expect(titleElements[0]).toHaveTextContent(
      'Innovation.Innovation.Overview.TotalInnovation.BigNumbers.volume.title',
    );
    expect(titleElements[1]).toHaveTextContent(
      'Innovation.Innovation.Overview.TotalInnovation.BigNumbers.volumeMix.title',
    );

    const measureElements = screen.getAllByTestId('chart-header-measure');
    expect(measureElements[0]).toHaveTextContent(
      'Innovation.Innovation.Overview.TotalInnovation.BigNumbers.volume.measure',
    );
    expect(measureElements[1]).toHaveTextContent(
      'Innovation.Innovation.Overview.TotalInnovation.BigNumbers.volumeMix.measure',
    );

    const dataElements = screen.getAllByTestId('big-number-data');
    expect(dataElements[0]).toHaveTextContent(JSON.stringify(mockData[0].data));
    expect(dataElements[1]).toHaveTextContent(JSON.stringify(mockData[1].data));
  });

  it('passes periodPosition and default orientation into ChartHeader config', () => {
    renderComponent({
      data: mockData as any[],
      periodPosition: 'top-right',
    });

    const expectedConfig = {
      inline: 'horizontal',
      type: 'small',
      periodPosition: 'top-right',
      alignment: 'left',
    };

    screen.getAllByTestId('chart-header-config').forEach((configElement) => {
      expect(configElement).toHaveTextContent(JSON.stringify(expectedConfig));
    });
  });

  it('uses center ChartHeader alignment when header orientation is vertical', () => {
    renderComponent({
      data: mockData as any[],
      orientation: { header: 'vertical', body: 'horizontal' },
    });

    const expectedConfig = {
      inline: 'vertical',
      type: 'small',
      periodPosition: undefined,
      alignment: 'center',
    };

    screen.getAllByTestId('chart-header-config').forEach((configElement) => {
      expect(configElement).toHaveTextContent(JSON.stringify(expectedConfig));
    });
  });

  it('renders empty data as a container with no items', () => {
    renderComponent({ data: [] });

    expect(
      document.querySelector('.big-numbers-container'),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('.big-number-item')).toHaveLength(0);
  });

  it('shows tooltips in ChartHeader when showInfo is true', () => {
    renderComponent({ data: mockData as any[], showInfo: true });

    const infoElements = screen.getAllByTestId('chart-header-info');
    expect(infoElements[0]).toHaveTextContent(
      'Innovation.Innovation.Overview.TotalInnovation.BigNumbers.volume.tooltip',
    );
    expect(infoElements[1]).toHaveTextContent(
      'Innovation.Innovation.Overview.TotalInnovation.BigNumbers.volumeMix.tooltip',
    );
  });

  it('hides tooltip copy when showInfo is false', () => {
    renderComponent({ data: mockData as any[], showInfo: false });

    screen.getAllByTestId('chart-header-info').forEach((info) => {
      expect(info).toHaveTextContent('');
    });
  });

  it('renders items without id with empty title and measure', () => {
    const dataWithoutId = [
      { period: '2023 Q4', data: [{ value: 1, label: 'x' }] },
    ] as any[];

    renderComponent({ data: dataWithoutId });

    expect(screen.getByTestId('chart-header-title')).toHaveTextContent('');
    expect(screen.getByTestId('chart-header-measure')).toHaveTextContent('');
  });

  it('renders a row when an item has an empty data array', () => {
    const mockDataWithEmptyItem = [
      {
        id: 'volume',
        period: '2023 Q4',
        data: [{ value: 42, label: 'Main Value' }],
      },
      {
        id: 'netRevenue',
        data: [],
      },
    ] as any[];

    renderComponent({ data: mockDataWithEmptyItem });

    expect(document.querySelectorAll('.big-number-item')).toHaveLength(2);
    const dataElements = screen.getAllByTestId('big-number-data');
    expect(dataElements[1]).toHaveTextContent('[]');
  });

  it('applies colorIndicator as a left border on the item wrapper', () => {
    const withColor = [
      {
        id: 'volume',
        period: '2023 Q4',
        colorIndicator: '#112233',
        data: [{ value: 1, label: 'a' }],
      },
    ] as any[];

    renderComponent({ data: withColor });

    const item = document.querySelector('.big-number-item');
    expect(item).toBeTruthy();
    expect(item).toHaveStyle({ borderLeft: '6px solid #112233' });
  });

  describe('kpiFilter and activeSubFilters', () => {
    it('keeps only ids listed for the active kpis key', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { kpis: 'innovationTab' },
      });

      renderComponent({
        data: mockData as any[],
        kpiFilter: { innovationTab: ['volume'] },
      });

      expect(document.querySelectorAll('.big-number-item')).toHaveLength(1);
      expect(screen.getByTestId('chart-header-title')).toHaveTextContent(
        'Innovation.Innovation.Overview.TotalInnovation.BigNumbers.volume.title',
      );
    });

    it('renders all items when kpiFilter is set but no active kpis selection', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: {},
      });

      renderComponent({
        data: mockData as any[],
        kpiFilter: { innovationTab: ['volume'] },
      });

      expect(document.querySelectorAll('.big-number-item')).toHaveLength(2);
    });
  });

  describe('onDeepDive', () => {
    const deepDiveData = [
      {
        id: 'volume',
        period: '2023 Q4',
        hasDeepDive: true,
        data: [{ value: 1, label: 'a' }],
      },
    ] as any[];

    it('invokes onDeepDive with the item id when kpiFilter is not used', () => {
      const onDeepDive = jest.fn();
      renderComponent({
        data: deepDiveData,
        dataTestId: 'bn',
        onDeepDive,
      });

      fireEvent.click(screen.getByTestId('bn-big-number-0'));
      expect(onDeepDive).toHaveBeenCalledWith('volume');
    });

    it('does not attach a click handler when hasDeepDive is false', () => {
      const onDeepDive = jest.fn();
      renderComponent({
        data: [
          {
            ...deepDiveData[0],
            hasDeepDive: false,
          },
        ],
        dataTestId: 'bn',
        onDeepDive,
      });

      fireEvent.click(screen.getByTestId('bn-big-number-0'));
      expect(onDeepDive).not.toHaveBeenCalled();
    });

    it('does not attach a click handler when kpiFilter is active', () => {
      const onDeepDive = jest.fn();
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { kpis: 'tab' },
      });

      renderComponent({
        data: deepDiveData,
        kpiFilter: { tab: ['volume'] },
        dataTestId: 'bn',
        onDeepDive,
      });

      fireEvent.click(screen.getByTestId('bn-big-number-0'));
      expect(onDeepDive).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it.each([
      {
        label: 'with kpiFilter',
        kpiFilter: { filter: ['volume'] } as Record<string, string[]>,
        loadingTestId: 'test-big-numbers-loading-container-kpi',
      },
      {
        label: 'without kpiFilter',
        kpiFilter: undefined,
        loadingTestId: 'test-big-numbers-loading-container',
      },
    ])(
      'renders Skeleton for loading $label',
      ({ kpiFilter, loadingTestId }) => {
        renderComponent({
          data: mockData as any[],
          loading: true,
          kpiFilter,
          dataTestId: 'test-big-numbers',
        });

        expect(
          screen.getByTestId('skeleton-test-big-numbers'),
        ).toBeInTheDocument();
        expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
      },
    );

    it('passes loadingLength to Skeleton when not using kpiFilter loading branch', () => {
      const { container } = renderComponent({
        data: mockData as any[],
        loading: true,
        loadingLength: 6,
        dataTestId: 'bn',
      });

      const skeleton = container.querySelector('[data-testid="skeleton-bn"]');
      expect(skeleton).toHaveAttribute('length', '6');
    });
  });

  describe('data-testid implementation', () => {
    it('exposes container, items, BigNumber, and ChartHeader ids under dataTestId', () => {
      renderComponent({
        data: mockData as any[],
        dataTestId: 'test-big-numbers',
      });

      const container = screen.getByTestId('test-big-numbers-container');
      expect(container).toHaveClass('big-numbers-container');

      const item0 = screen.getByTestId('test-big-numbers-item-0');
      const bigNumber0 = screen.getByTestId('test-big-numbers-big-number-0');
      expect(container).toContainElement(item0);
      expect(item0).toContainElement(bigNumber0);
      expect(
        screen.getByTestId('test-big-numbers-chart-header-0'),
      ).toBeInTheDocument();
    });

    it('does not set data-testid on the container when dataTestId is omitted', () => {
      renderComponent({ data: mockData as any[] });

      const container = document.querySelector('.big-numbers-container');
      expect(container).not.toHaveAttribute('data-testid');
    });

    it('persists data-testid hierarchy after rerender with different asCard', () => {
      const { rerender } = render(
        <TestWrapper>
          <BigNumbers data={mockData as any[]} dataTestId="test-big-numbers" />
        </TestWrapper>,
      );

      expect(
        screen.getByTestId('test-big-numbers-container'),
      ).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <BigNumbers
            data={mockData as any[]}
            dataTestId="test-big-numbers"
            asCard={false}
          />
        </TestWrapper>,
      );

      expect(
        screen.getByTestId('test-big-numbers-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('test-big-numbers-item-0')).toBeInTheDocument();
    });

    it('supports non-trivial dataTestId strings', () => {
      renderComponent({
        data: mockData as any[],
        dataTestId: 'test-big-numbers-123_special',
      });

      expect(
        screen.getByTestId('test-big-numbers-123_special-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-big-numbers-123_special-item-0'),
      ).toBeInTheDocument();
    });

    it('indexes items when more than two rows exist', () => {
      const multipleItems = [
        ...mockData,
        {
          id: 'netRevenue',
          period: '2023 Q4',
          data: [{ value: 100, label: 'Revenue' }],
        },
      ];

      renderComponent({
        data: multipleItems as any[],
        dataTestId: 'test-big-numbers',
      });

      expect(screen.getByTestId('test-big-numbers-item-2')).toBeInTheDocument();
    });

    it('exposes chart header container data-testid per row', () => {
      const { container } = renderComponent({
        data: mockData as any[],
        dataTestId: 'test-big-numbers',
      });

      expect(
        container.querySelector(
          '[data-testid="test-big-numbers-chart-header-container-0"]',
        ),
      ).toBeInTheDocument();
    });
  });
});

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { OvertimePerformance } from './OvertimePerformance';
import type { OvertimePerformanceData } from './OvertimePerformance';

const mockUsePageFilterApplied = jest.fn();

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('hooks', () => ({
  useCurrentPage: () => ({ currentPage: 'category-health' }),
  usePageFilterApplied: () => mockUsePageFilterApplied(),
}));

const mockBasicContainer = jest.fn();
const mockBigNumber = jest.fn();
const mockChartHeader = jest.fn();
const mockTag = jest.fn();
const mockCountryFlag = jest.fn();

jest.mock('components', () => ({
  BasicContainer: (props: any) => {
    mockBasicContainer(props);
    return (
      <div data-testid={props.dataTestId}>
        {props.header?.title}
        {props.header?.bottomTag}
        {props.header?.rightContent}
        {props.children}
      </div>
    );
  },
  BigNumber: (props: any) => {
    mockBigNumber(props);
    return (
      <div
        data-testid={props.dataTestId}
        onClick={props.onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            props.onClick?.();
          }
        }}
        role="button"
        tabIndex={0}
        className={props.isSelected ? 'selected' : ''}
      >
        {props.header}
        {props.emptyStateIcon}
        BigNumber: {props.data[0]?.bigNumber?.value || 'empty'}
      </div>
    );
  },
  ChartHeader: (props: any) => {
    mockChartHeader(props);
    return <div>{props.title}</div>;
  },
  Tag: (props: any) => {
    mockTag(props);
    return <div>{props.text}</div>;
  },
  Skeleton: (props: any) => (
    <div data-testid={props.dataTestId}>Loading...</div>
  ),
}));

jest.mock('components/Filter/components', () => ({
  CountryFlag: (props: any) => {
    mockCountryFlag(props);
    return <div data-testid={props.dataTestId}>CountryFlag</div>;
  },
}));

jest.mock('../WorldIcon/WorldIcon', () => ({
  WorldIcon: () => <div data-testid="world-icon">WorldIcon</div>,
}));

jest.mock('../WorldWithMarkerIcon/WorldWithMarkerIcon', () => ({
  WorldWithMarkerIcon: () => (
    <div data-testid="world-with-marker-icon">WorldWithMarkerIcon</div>
  ),
}));

jest.mock('./OvertimePerformance.styles', () => ({
  Container: ({ children }: any) => (
    <div data-testid="container">{children}</div>
  ),
  CardsGrid: ({ children }: any) => (
    <div data-testid="cards-grid">{children}</div>
  ),
  IconContainer: ({ children }: any) => (
    <div data-testid="icon-container">{children}</div>
  ),
}));

jest.mock('../NoDataAvailable/NoDataAvailable', () => ({
  NoDataAvailable: ({ dataTestId }: any) => (
    <div data-testid={`${dataTestId}-no-data-available`}>No data available</div>
  ),
}));

describe('OvertimePerformance Component', () => {
  const mockData: OvertimePerformanceData = [
    {
      title: 'Beer Volume',
      kpiKey: 'volume',
      dataTestId: 'beer-volume',
      data: [
        {
          bigNumber: { value: '1.7', measure: '%', trend: 'positive' },
          comparison: { label: 'vs', value: "24'FY" },
          secondaryInfo: { value: '148,817', measure: '[ k hl ]' },
        },
      ],
    },
    {
      title: 'BICL',
      kpiKey: 'icl',
      dataTestId: 'bicl',
      data: [
        {
          bigNumber: { value: '0.9', measure: '%', trend: 'positive' },
          comparison: { label: 'vs', value: "24'FY" },
          secondaryInfo: { value: '92.2', measure: '[ L/Year ]' },
        },
      ],
    },
    {
      title: 'Share of Throat',
      kpiKey: 'sot',
      dataTestId: 'share-of-throat',
      data: [
        {
          bigNumber: { value: '0.1', measure: 'pp', trend: 'positive' },
          comparison: { label: 'vs', value: "24'FY" },
          secondaryInfo: { value: '92', measure: '[ % ]' },
        },
      ],
    },
    {
      title: 'Beer Participation',
      kpiKey: 'participation',
      dataTestId: 'beer-participation',
      data: [
        {
          bigNumber: { value: '1.2', measure: 'pp', trend: 'positive' },
          comparison: { label: 'vs', value: "24'FY" },
          secondaryInfo: { value: '52.6', measure: '[ % ]' },
        },
      ],
    },
    {
      title: 'WMTBB',
      kpiKey: 'wmtbb',
      dataTestId: 'wmtbb',
      data: [
        {
          bigNumber: { value: '-2.5', trend: 'positive' },
          comparison: { label: 'vs', value: "24'FY" },
          secondaryInfo: { value: '7.3', measure: '[ Min ]' },
        },
      ],
    },
  ];

  const mockOnKPISelect = jest.fn();

  const defaultApplied = { zone: 'LATAM', country: 'BRA' };

  const renderOvertimePerformance = (
    props: Partial<React.ComponentProps<typeof OvertimePerformance>> = {},
    applied = defaultApplied,
  ) => {
    mockUsePageFilterApplied.mockReturnValue({ applied });

    return render(
      <OvertimePerformance
        data={mockData}
        onKPISelect={mockOnKPISelect}
        dataTestId="overtime"
        {...props}
      />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePageFilterApplied.mockReturnValue({ applied: defaultApplied });
  });

  describe('Rendering', () => {
    it('should render the component with all main elements', () => {
      renderOvertimePerformance();

      expect(screen.getByText('Overtime Performance')).toBeInTheDocument();
      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('cards-grid')).toBeInTheDocument();
    });

    it('should render NoDataAvailable when data is not provided', () => {
      render(
        <OvertimePerformance
          onKPISelect={mockOnKPISelect}
          dataTestId="overtime"
        />,
      );

      expect(
        screen.getByTestId('overtime-no-data-available'),
      ).toBeInTheDocument();
    });

    it('should render skeleton when loading and no data', () => {
      render(
        <OvertimePerformance
          loading
          onKPISelect={mockOnKPISelect}
          dataTestId="overtime"
        />,
      );

      expect(
        screen.getByTestId('overtime-overtime-performance-skeleton'),
      ).toBeInTheDocument();
    });

    it('should render BasicContainer with correct props', () => {
      renderOvertimePerformance();

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'overtime-overtime-performance',
          header: expect.objectContaining({
            title: 'Overtime Performance',
            titleSize: 'H2',
          }),
          layout: { bodyPadding: true, background: '#F9F9F9' },
        }),
      );
    });

    it('should render refresh date in BasicContainer header when provided', () => {
      renderOvertimePerformance({ refreshDateLabel: 'Mar - 2026' });

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          header: expect.objectContaining({
            bottomTag: expect.anything(),
          }),
        }),
      );
      expect(mockTag).toHaveBeenCalledWith(
        expect.objectContaining({
          text: ': Mar - 2026',
        }),
      );
    });

    it('should not render refresh date tag when refreshDateLabel is not provided', () => {
      renderOvertimePerformance();

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          header: expect.objectContaining({
            bottomTag: null,
          }),
        }),
      );
    });

    it('should render CountryFlag in BasicContainer header for non-ABI zones', () => {
      renderOvertimePerformance();

      expect(mockCountryFlag).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'overtime-overtime-performance',
        }),
      );
    });

    it('should render WorldIcon in BasicContainer header for ABI zone', () => {
      renderOvertimePerformance({}, { zone: 'ABI', country: 'ABI' });

      expect(screen.getByTestId('world-icon')).toBeInTheDocument();
    });
  });

  describe('BigNumber Cards', () => {
    it('should render all KPI cards with their base BigNumber contract', () => {
      renderOvertimePerformance();

      expect(mockBigNumber).toHaveBeenCalledTimes(5);
      expect(
        mockBigNumber.mock.calls.map((call) => call[0].dataTestId),
      ).toEqual([
        'overtime-beer-volume',
        'overtime-bicl',
        'overtime-share-of-throat',
        'overtime-beer-participation',
        'overtime-wmtbb',
      ]);
      mockBigNumber.mock.calls.forEach((call) => {
        expect(call[0]).toEqual(
          expect.objectContaining({
            asCard: true,
            size: 'small',
            emptyStateConfig: {
              inline: true,
              imageSize: {
                height: '44px',
                width: '44px',
              },
            },
          }),
        );
      });
    });

    it('should render Volume card with correct data', () => {
      renderOvertimePerformance({ productType: 'Beer' });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Beer Volume',
          info: 'Category.CategoryHealth.Volume.Beer.tooltip',
        }),
      );

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'overtime-beer-volume',
          data: [
            {
              bigNumber: { value: '1.7', measure: '%', trend: 'positive' },
              comparison: { label: 'vs', value: "24'FY" },
              secondaryInfo: { value: '148,817', measure: '[ k hl ]' },
            },
          ],
        }),
      );
    });

    it('should render ICL card with correct data', () => {
      renderOvertimePerformance({ productType: 'Beer' });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'BICL',
          info: 'Category.CategoryHealth.ICL.BICL.tooltip',
        }),
      );

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [
            expect.objectContaining({
              bigNumber: { value: '0.9', measure: '%', trend: 'positive' },
              secondaryInfo: { value: '92.2', measure: '[ L/Year ]' },
            }),
          ],
        }),
      );
    });

    it('should render SOT card with correct data and color', () => {
      renderOvertimePerformance({ productType: 'Beer' });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Share of Throat',
          info: 'Category.CategoryHealth.SOT.Beer.tooltip',
        }),
      );

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [
            expect.objectContaining({
              bigNumber: { value: '0.1', measure: 'pp', trend: 'positive' },
              secondaryInfo: { value: '92', measure: '[ % ]' },
            }),
          ],
        }),
      );
    });

    it('should render Participation card with correct data', () => {
      renderOvertimePerformance({ productType: 'Beer' });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Beer Participation',
          info: 'Category.CategoryHealth.Participation.Beer.tooltip',
        }),
      );

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [
            expect.objectContaining({
              bigNumber: { value: '1.2', measure: 'pp', trend: 'positive' },
              secondaryInfo: { value: '52.6', measure: '[ % ]' },
            }),
          ],
        }),
      );
    });

    it('should render WMTBB card with correct data', () => {
      renderOvertimePerformance({ productType: 'Beer' });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'WMTBB',
          info: 'Category.CategoryHealth.WMTBB.tooltip',
        }),
      );

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [
            expect.objectContaining({
              bigNumber: { value: '-2.5', trend: 'positive' },
              secondaryInfo: { value: '7.3', measure: '[ Min ]' },
            }),
          ],
        }),
      );
    });

    it('should render titles from backend data directly', () => {
      const beyondBeerData: OvertimePerformanceData = mockData.map((card) => {
        if (card.kpiKey === 'volume') return { ...card, title: 'BYB Volume' };
        if (card.kpiKey === 'icl') return { ...card, title: 'BYB ICL' };
        if (card.kpiKey === 'participation')
          return { ...card, title: 'BYB Participation' };
        return card;
      });

      renderOvertimePerformance({
        data: beyondBeerData,
        productType: 'Beyond Beer',
      });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'BYB Volume' }),
      );
      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'BYB ICL' }),
      );
      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'BYB Participation' }),
      );
    });

    it('should resolve tooltips based on productType for beyond-beer', () => {
      renderOvertimePerformance({ productType: 'Beyond Beer' });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          info: 'Category.CategoryHealth.Volume.BeyondBeer.tooltip',
        }),
      );
      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          info: 'Category.CategoryHealth.ICL.BYB.tooltip',
        }),
      );
      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          info: 'Category.CategoryHealth.SOT.BeyondBeer.tooltip',
        }),
      );
    });

    it('should resolve tooltips based on productType for beer-beyond-beer', () => {
      renderOvertimePerformance({ productType: 'Beer + Beyond Beer' });

      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          info: 'Category.CategoryHealth.Volume.BeerBeyondBeer.tooltip',
        }),
      );
      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          info: 'Category.CategoryHealth.ICL.BeerBeyondBeer.tooltip',
        }),
      );
      expect(mockChartHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          info: 'Category.CategoryHealth.SOT.BeerBeyondBeer.tooltip',
        }),
      );
    });

    it('should render WMTBB card with empty data and emptyStateMessage', () => {
      const dataWithEmptyWmtbb: OvertimePerformanceData = mockData.map(
        (card) => {
          if (card.kpiKey === 'wmtbb') {
            return {
              ...card,
              data: [],
              emptyStateMessage:
                'Choose Beer Product Type to access WMTBB data',
            };
          }
          return card;
        },
      );

      renderOvertimePerformance({ data: dataWithEmptyWmtbb });

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [],
          emptyStateMessage: 'Choose Beer Product Type to access WMTBB data',
        }),
      );
    });

    it('should render WMTBB empty-state world marker icon for ABI country', () => {
      const dataWithEmptyWmtbb: OvertimePerformanceData = mockData.map(
        (card) => (card.kpiKey === 'wmtbb' ? { ...card, data: [] } : card),
      );

      renderOvertimePerformance(
        { data: dataWithEmptyWmtbb },
        { zone: 'ABI', country: 'ABI' },
      );

      const wmtbbCall = mockBigNumber.mock.calls.find(
        (call) => call[0].dataTestId === 'overtime-wmtbb',
      );
      expect(wmtbbCall[0].emptyStateIcon).toBeTruthy();
      expect(screen.getByTestId('world-with-marker-icon')).toBeInTheDocument();
    });
  });

  describe('KPI Selection', () => {
    it('should call onKPISelect when a card with data is clicked', () => {
      renderOvertimePerformance({ selectedKPI: null });

      const volumeCard = screen.getAllByText(/BigNumber/)[0];
      fireEvent.click(volumeCard);

      expect(mockOnKPISelect).toHaveBeenCalledWith('volume');
    });

    it('should mark the selected card as selected', () => {
      renderOvertimePerformance({ selectedKPI: 'volume' });

      const selectedCalls = mockBigNumber.mock.calls.filter(
        (call) => call[0].isSelected,
      );
      expect(selectedCalls).toHaveLength(1);
      expect(selectedCalls[0][0].dataTestId).toBe('overtime-beer-volume');
    });

    it('should not call onClick for cards without data', () => {
      const dataWithEmptyWmtbb: OvertimePerformanceData = mockData.map(
        (card) => {
          if (card.kpiKey === 'wmtbb') return { ...card, data: [] };
          return card;
        },
      );

      renderOvertimePerformance({ data: dataWithEmptyWmtbb });

      const wmtbbCall = mockBigNumber.mock.calls.find(
        (call) => call[0].data.length === 0,
      );
      expect(wmtbbCall[0].onClick).toBeUndefined();
    });

    it('should pass onClick function for cards with data', () => {
      renderOvertimePerformance();

      const callsWithData = mockBigNumber.mock.calls.filter(
        (call) => call[0].data.length > 0,
      );
      callsWithData.forEach((call) => {
        expect(call[0].onClick).toBeDefined();
        expect(typeof call[0].onClick).toBe('function');
      });
    });
  });

  describe('data-testid implementation', () => {
    it('should pass dataTestId to BasicContainer with overtime-performance suffix', () => {
      renderOvertimePerformance({ dataTestId: 'test-overtime' });

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'test-overtime-overtime-performance',
        }),
      );

      expect(
        screen.getAllByTestId('test-overtime-overtime-performance'),
      ).not.toHaveLength(0);
    });

    it('should not break when dataTestId is not provided', () => {
      renderOvertimePerformance({ dataTestId: undefined });

      expect(screen.getByText('Overtime Performance')).toBeInTheDocument();
      expect(mockBigNumber).toHaveBeenCalled();
    });

    it('should pass undefined dataTestId to components when not provided', () => {
      renderOvertimePerformance({ dataTestId: undefined });

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: undefined,
        }),
      );

      const bigNumberCalls = mockBigNumber.mock.calls;
      bigNumberCalls.forEach((call) => {
        expect(call[0].dataTestId).toBeUndefined();
      });
    });
  });

  describe('Card Properties', () => {
    it('should render ChartHeader with correct config for all cards', () => {
      renderOvertimePerformance();

      const chartHeaderCalls = mockChartHeader.mock.calls;
      chartHeaderCalls.forEach((call) => {
        expect(call[0].config).toEqual({
          inline: 'horizontal',
          type: 'small',
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle SOT card with negative trend', () => {
      const dataWithNegativeSot: OvertimePerformanceData = mockData.map(
        (card) => {
          if (card.kpiKey === 'sot') {
            return {
              ...card,
              data: [
                {
                  ...card.data[0],
                  bigNumber: {
                    ...card.data[0].bigNumber,
                    trend: 'negative' as const,
                  },
                },
              ],
            };
          }
          return card;
        },
      );

      renderOvertimePerformance({ data: dataWithNegativeSot });

      const sotCall = mockBigNumber.mock.calls.find(
        (call) =>
          call[0].data[0]?.bigNumber?.measure === 'pp' &&
          call[0].data[0]?.secondaryInfo?.measure === '[ % ]',
      );
      expect(sotCall[0].data[0].bigNumber.trend).toBe('negative');
    });
  });
});

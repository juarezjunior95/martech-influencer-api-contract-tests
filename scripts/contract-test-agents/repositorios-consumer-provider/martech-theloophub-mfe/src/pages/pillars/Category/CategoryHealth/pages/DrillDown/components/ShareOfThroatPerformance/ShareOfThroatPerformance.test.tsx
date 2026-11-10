import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StackedAreaData } from 'components/Chart/StackedArea/types';

import { ShareOfThroatPerformance } from './ShareOfThroatPerformance';

const mockBasicContainer = jest.fn();
const mockStackedAreaContainer = jest.fn();
const mockNoDataAvailable = jest.fn();
const mockSkeleton = jest.fn();

jest.mock('components', () => ({
  BasicContainer: (props: any) => {
    mockBasicContainer(props);
    return (
      <div data-testid={props.dataTestId}>
        {props.header?.title}
        {props.children}
      </div>
    );
  },
  StackedAreaContainer: (props: any) => {
    mockStackedAreaContainer(props);
    return <div data-testid={props.dataTestId}>StackedAreaContainer</div>;
  },
  Skeleton: (props: any) => {
    mockSkeleton(props);
    return <div data-testid={props.dataTestId}>Skeleton</div>;
  },
}));

jest.mock('../NoDataAvailable/NoDataAvailable', () => ({
  NoDataAvailable: (props: any) => {
    mockNoDataAvailable(props);
    return <div data-testid="no-data-available">NoDataAvailable</div>;
  },
}));

describe('ShareOfThroatPerformance Component', () => {
  const mockChartData: StackedAreaData = {
    columns: [
      {
        label: '2023',
        segments: [{ value: 0 }, { value: 6 }, { value: 85 }],
      },
      {
        label: '2024',
        segments: [{ value: 5 }, { value: 10 }, { value: 5 }],
      },
    ],
    colors: ['#EC8AB0', '#69ACE3', '#D9AA4A', '#EFD328'],
    connectorColors: ['#F6B7D0', '#A1CFF4', '#EEC879', '#F0DF78'],
    legends: ['Beer', 'Spirit', 'Wine', 'Beer + Beyond Beer'],
    comparisonLine: [
      {
        title: 'Beer vs LY',
        data: [
          { value: '-', measure: '', color: '#5C5C5C' },
          { value: '0.1', measure: 'pp', color: '#49764B' },
        ],
      },
    ],
  };

  const mockData = {
    title: 'Share of Throat Performance',
    subtitle: '[%]',
    chartData: mockChartData,
  };

  const renderShareOfThroatPerformance = (
    props: Partial<React.ComponentProps<typeof ShareOfThroatPerformance>> = {},
  ) =>
    render(
      <ShareOfThroatPerformance
        data={mockData}
        dataTestId="drill-down"
        {...props}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should render only the Skeleton when loading is true', () => {
      renderShareOfThroatPerformance({ loading: true });

      expect(mockSkeleton).toHaveBeenCalledWith(
        expect.objectContaining({
          width: '100%',
          height: '400px',
          length: 1,
          dataTestId: 'skeleton-drill-down-sot',
        }),
      );
      expect(screen.getByTestId('skeleton-drill-down-sot')).toBeInTheDocument();
      expect(mockBasicContainer).not.toHaveBeenCalled();
      expect(mockStackedAreaContainer).not.toHaveBeenCalled();
      expect(mockNoDataAvailable).not.toHaveBeenCalled();
    });

    it('should omit Skeleton dataTestId when dataTestId is not provided', () => {
      renderShareOfThroatPerformance({ loading: true, dataTestId: undefined });

      expect(mockSkeleton).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });
  });

  describe('Empty state', () => {
    it.each([
      ['data is not provided', undefined],
      [
        'columns are empty',
        { ...mockData, chartData: { ...mockChartData, columns: [] } },
      ],
      [
        'columns are undefined',
        {
          ...mockData,
          chartData: { ...mockChartData, columns: undefined },
        } as unknown as typeof mockData,
      ],
    ])('should render NoDataAvailable when %s', (_scenario, data) => {
      renderShareOfThroatPerformance({ data });

      expect(mockNoDataAvailable).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: 'drill-down' }),
      );
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(mockBasicContainer).not.toHaveBeenCalled();
      expect(mockStackedAreaContainer).not.toHaveBeenCalled();
    });
  });

  describe('Rendering with data', () => {
    it('should render the chart container with configured layout, ids, and chart props', () => {
      renderShareOfThroatPerformance();

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'drill-down-share-of-throat-performance',
          header: {
            title: 'Share of Throat Performance',
            titleSize: 'H2',
          },
          layout: { bodyPadding: true, background: '#F9F9F9' },
        }),
      );
      expect(mockStackedAreaContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'drill-down-share-of-throat-performance',
          data: mockChartData,
          size: 'medium',
          containerHeader: {
            title: 'Share of Throat Performance',
            subtitle: '[%]',
            titleSize: 'H4',
          },
        }),
      );
      expect(
        screen.getAllByTestId('drill-down-share-of-throat-performance'),
      ).toHaveLength(2);
      expect(mockNoDataAvailable).not.toHaveBeenCalled();
    });

    it('should pass undefined dataTestId when dataTestId is not provided', () => {
      renderShareOfThroatPerformance({ dataTestId: undefined });

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
      expect(mockStackedAreaContainer).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });

    it('should pass optional subtitle as undefined when it is not provided', () => {
      renderShareOfThroatPerformance({
        data: {
          ...mockData,
          subtitle: undefined,
        },
      });

      expect(mockStackedAreaContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          containerHeader: {
            title: 'Share of Throat Performance',
            subtitle: undefined,
            titleSize: 'H4',
          },
        }),
      );
    });

    it('should pass chartData as-is when optional connectorColors is missing', () => {
      const chartDataWithoutConnector = {
        ...mockChartData,
        connectorColors: undefined,
      };

      renderShareOfThroatPerformance({
        data: {
          ...mockData,
          chartData: chartDataWithoutConnector as StackedAreaData,
        },
      });

      expect(mockStackedAreaContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          data: chartDataWithoutConnector,
        }),
      );
    });

    it('should render chart content when columns contain a zero-valued segment', () => {
      renderShareOfThroatPerformance({
        data: {
          ...mockData,
          chartData: {
            ...mockChartData,
            columns: [{ label: '2023', segments: [{ value: 0 }] }],
          },
        },
      });

      expect(mockBasicContainer).toHaveBeenCalled();
      expect(mockStackedAreaContainer).toHaveBeenCalled();
      expect(mockNoDataAvailable).not.toHaveBeenCalled();
    });
  });
});

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { BigNumberSparkLineCard } from './BigNumberSparkLineCard';
import type { BigNumberSparkLineCardData } from './types';

jest.mock('components', () => ({
  Alert: ({ message, type }: { message: string; type?: string }) => (
    <div data-testid="alert" data-type={type}>
      {message}
    </div>
  ),
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: { title: string };
  }) => (
    <div data-testid="basic-container">
      {header?.title && <h2 data-testid="section-title">{header.title}</h2>}
      {children}
    </div>
  ),
  BigNumberWithContent: ({
    children,
    data,
    header,
    onClick,
  }: {
    children?: React.ReactNode;
    data: unknown[];
    header?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid="big-number-with-content" data-length={data?.length ?? 0}>
      <button type="button" onClick={onClick}>
        trigger click
      </button>
      {header}
      {children}
    </div>
  ),
  ChartHeader: ({ title, period }: { title?: string; period?: string }) => (
    <div data-testid="chart-header" data-title={title} data-period={period}>
      {title}
      {period && ` – ${period}`}
    </div>
  ),
  NoDataYet: () => <div data-testid="no-data-yet">NoDataYet</div>,
  Skeleton: ({ height }: { height?: string }) => (
    <div data-testid="skeleton" data-height={height}>
      Skeleton
    </div>
  ),
  SparkLine: ({
    color,
    datasets,
    labels,
  }: {
    color?: string;
    datasets: unknown[];
    labels: string[];
  }) => (
    <div
      data-testid="spark-line"
      data-color={color}
      data-labels={labels.join(',')}
      data-datasets-count={datasets?.length}
    >
      SparkLine
    </div>
  ),
}));

jest.mock('shared/Styles/layout.styles', () => ({
  StyledSectionContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-content">{children}</div>
  ),
}));

const createMockData = (
  overrides: Partial<BigNumberSparkLineCardData> = {},
): BigNumberSparkLineCardData => ({
  chartTitle: 'Test Chart',
  chartPeriod: 'Jan 2025',
  bigNumberData: [
    {
      bigNumber: {
        value: '42',
        measure: '%',
        trend: undefined,
      },
      comparison: { label: 'vs', value: 'Dec 2024' },
    },
  ],
  chartLineData: [10, 20, 30, 40],
  ...overrides,
});

describe('BigNumberSparkLineCard', () => {
  describe('Loading state', () => {
    it('should render Skeleton when loading is true', () => {
      render(
        <BigNumberSparkLineCard
          containerTitle="Section Title"
          loading
          data={createMockData()}
        />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton')).toHaveAttribute(
        'data-height',
        '340px',
      );
      expect(screen.queryByTestId('basic-container')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should render BasicContainer with NoDataYet when error is provided', () => {
      render(
        <BigNumberSparkLineCard
          containerTitle="Error Section"
          error={new Error('Something went wrong')}
          data={createMockData()}
        />,
      );

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('section-title')).toHaveTextContent(
        'Error Section',
      );
      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
      expect(
        screen.queryByTestId('big-number-with-content'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should render empty state when data has no bigNumberData', () => {
      render(
        <BigNumberSparkLineCard
          containerTitle="Empty Section"
          data={createMockData({ bigNumberData: [] })}
        />,
      );

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('section-title')).toHaveTextContent(
        'Empty Section',
      );
      expect(screen.getByTestId('big-number-with-content')).toBeInTheDocument();
      expect(screen.getByTestId('big-number-with-content')).toHaveAttribute(
        'data-length',
        '0',
      );
    });

    it('should render empty state when data is null/undefined-like (empty bigNumberData)', () => {
      render(
        <BigNumberSparkLineCard
          containerTitle="Empty Section"
          data={createMockData({ bigNumberData: [] })}
        />,
      );

      expect(screen.getByTestId('section-content')).toBeInTheDocument();
    });
  });

  describe('Success state with data', () => {
    it('should render BasicContainer with BigNumberWithContent and chart header', () => {
      const data = createMockData({
        chartTitle: 'Revenue',
        chartPeriod: 'Q1 2025',
      });

      render(
        <BigNumberSparkLineCard containerTitle="Revenue Section" data={data} />,
      );

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('section-title')).toHaveTextContent(
        'Revenue Section',
      );
      expect(screen.getByTestId('big-number-with-content')).toBeInTheDocument();
      expect(screen.getByTestId('big-number-with-content')).toHaveAttribute(
        'data-length',
        '1',
      );
      expect(screen.getByTestId('chart-header')).toHaveAttribute(
        'data-title',
        'Revenue',
      );
      expect(screen.getByTestId('chart-header')).toHaveAttribute(
        'data-period',
        'Q1 2025',
      );
    });

    it('should render SparkLine when chartLineData is provided', () => {
      const data = createMockData({ chartLineData: [1, 2, 3] });

      render(
        <BigNumberSparkLineCard containerTitle="With Spark" data={data} />,
      );

      expect(screen.getByTestId('spark-line')).toBeInTheDocument();
      expect(screen.getByTestId('spark-line')).toHaveAttribute(
        'data-labels',
        '0,1,2',
      );
      expect(screen.getByTestId('spark-line')).toHaveAttribute(
        'data-datasets-count',
        '1',
      );
    });

    it('should use default chart color when trend is undefined', () => {
      const data = createMockData({
        bigNumberData: [
          {
            bigNumber: { value: '50', measure: '%' },
            comparison: { label: 'vs', value: 'Prior' },
          },
        ],
        chartLineData: [1, 2],
      });

      render(<BigNumberSparkLineCard containerTitle="No Trend" data={data} />);

      expect(screen.getByTestId('spark-line')).toHaveAttribute(
        'data-color',
        '#5C5C5C',
      );
    });

    it('should use positive trend color when trend is positive', () => {
      const data = createMockData({
        bigNumberData: [
          {
            bigNumber: { value: '50', measure: '%', trend: 'positive' },
            comparison: { label: 'vs', value: 'Prior' },
          },
        ],
        chartLineData: [1, 2],
      });

      render(<BigNumberSparkLineCard containerTitle="Positive" data={data} />);

      expect(screen.getByTestId('spark-line')).toHaveAttribute(
        'data-color',
        '#007800',
      );
    });

    it('should use negative trend color when trend is negative', () => {
      const data = createMockData({
        bigNumberData: [
          {
            bigNumber: { value: '50', measure: '%', trend: 'negative' },
            comparison: { label: 'vs', value: 'Prior' },
          },
        ],
        chartLineData: [1, 2],
      });

      render(<BigNumberSparkLineCard containerTitle="Negative" data={data} />);

      expect(screen.getByTestId('spark-line')).toHaveAttribute(
        'data-color',
        '#B91C1C',
      );
    });

    it('should not render SparkLine when chartLineData is not provided', () => {
      const data = createMockData();
      const dataWithoutLineData: BigNumberSparkLineCardData = {
        ...data,
        chartLineData: undefined as unknown as number[],
      };

      render(
        <BigNumberSparkLineCard
          containerTitle="No Spark"
          data={dataWithoutLineData}
        />,
      );

      expect(screen.queryByTestId('spark-line')).not.toBeInTheDocument();
    });

    it('should render SparkLine when chartLineData is empty array', () => {
      const data = createMockData({ chartLineData: [] });

      render(
        <BigNumberSparkLineCard containerTitle="Empty Spark" data={data} />,
      );

      expect(screen.getByTestId('spark-line')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when BigNumberWithContent is clicked', () => {
      const onClick = jest.fn();
      const data = createMockData();

      render(
        <BigNumberSparkLineCard
          containerTitle="Clickable"
          data={data}
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /trigger click/i }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Alert', () => {
    it('should render Alert when alert prop is provided', () => {
      const data = createMockData();

      render(
        <BigNumberSparkLineCard
          containerTitle="With Alert"
          data={data}
          alert={{ message: 'Warning message', type: 'warning' }}
        />,
      );

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert')).toHaveTextContent('Warning message');
      expect(screen.getByTestId('alert')).toHaveAttribute(
        'data-type',
        'warning',
      );
    });

    it('should not render Alert when alert prop is not provided', () => {
      const data = createMockData();

      render(<BigNumberSparkLineCard containerTitle="No Alert" data={data} />);

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
  });

  describe('Children (composition)', () => {
    it('should render children when provided in success state', () => {
      const data = createMockData();

      render(
        <BigNumberSparkLineCard containerTitle="With Children" data={data}>
          <div data-testid="custom-child">Custom Content</div>
        </BigNumberSparkLineCard>,
      );

      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByTestId('custom-child')).toHaveTextContent(
        'Custom Content',
      );
    });

    it('should NOT render children when no children prop is provided', () => {
      const data = createMockData();

      render(
        <BigNumberSparkLineCard
          containerTitle="Without Children"
          data={data}
        />,
      );

      expect(screen.queryByTestId('custom-child')).not.toBeInTheDocument();
    });

    it('should render multiple children', () => {
      const data = createMockData();

      render(
        <BigNumberSparkLineCard containerTitle="Multiple Children" data={data}>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
        </BigNumberSparkLineCard>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should NOT render children in loading state', () => {
      const data = createMockData();

      render(
        <BigNumberSparkLineCard containerTitle="Loading" data={data} loading>
          <div data-testid="custom-child">Should Not Appear</div>
        </BigNumberSparkLineCard>,
      );

      expect(screen.queryByTestId('custom-child')).not.toBeInTheDocument();
    });

    it('should NOT render children in error state', () => {
      const data = createMockData();

      render(
        <BigNumberSparkLineCard
          containerTitle="Error"
          data={data}
          error={new Error('Test error')}
        >
          <div data-testid="custom-child">Should Not Appear</div>
        </BigNumberSparkLineCard>,
      );

      expect(screen.queryByTestId('custom-child')).not.toBeInTheDocument();
    });

    it('should NOT render children in empty state', () => {
      const data = createMockData({ bigNumberData: [] });

      render(
        <BigNumberSparkLineCard containerTitle="Empty" data={data}>
          <div data-testid="custom-child">Should Not Appear</div>
        </BigNumberSparkLineCard>,
      );

      expect(screen.queryByTestId('custom-child')).not.toBeInTheDocument();
    });
  });
});

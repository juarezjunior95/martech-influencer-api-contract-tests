import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { BigNumbersSection } from './BigNumbersSection';

const mockBigNumber = jest.fn();
const mockChartHeader = jest.fn();
const mockDataStateHandler = jest.fn();
const mockBasicContainer = jest.fn();

jest.mock('components', () => ({
  ContentCard: ({
    children,
    title,
    fullWidth,
  }: {
    children: React.ReactNode;
    title: string;
    tooltip?: string;
    fullWidth?: boolean;
  }) => (
    <div
      data-testid="content-card"
      data-title={title}
      data-full-width={fullWidth}
    >
      {children}
    </div>
  ),
  BasicContainer: (props: Record<string, unknown>) => {
    mockBasicContainer(props);
    return (
      <div data-testid="basic-container">
        {props.children as React.ReactNode}
      </div>
    );
  },
  BigNumber: (props: Record<string, unknown>) => {
    mockBigNumber(props);
    return (
      <button
        type="button"
        data-testid="big-number"
        onClick={props.onClick as () => void}
        data-selected={props.isSelected}
      >
        {props.header as React.ReactNode}
      </button>
    );
  },
  ChartHeader: (props: { title: string; measure?: string }) => {
    mockChartHeader(props);
    return <div data-testid="chart-header">{props.title}</div>;
  },
  DataStateHandler: (props: {
    loading: boolean;
    error: Error | null;
    empty: boolean;
    children: React.ReactNode;
  }) => {
    mockDataStateHandler(props);
    if (props.loading) return <div data-testid="loading">Loading...</div>;
    if (props.error)
      return <div data-testid="error">{props.error.message}</div>;
    if (props.empty) return <div data-testid="empty">Empty</div>;
    return <div data-testid="content">{props.children}</div>;
  },
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock('./BigNumbersSection.styles', () => ({
  StyledBigNumbersContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="big-numbers-container">{children}</div>
  ),
}));

const mockData = [
  {
    header: { title: 'Power YTD', measure: '[ % ]' },
    data: [
      {
        bigNumber: { value: '0.5', measure: 'pp', trend: 'positive' as const },
        secondaryInfo: { value: '99.9', label: '[ % ]' },
        comparison: { label: 'vs', value: 'LY' },
      },
    ],
  },
  {
    header: { title: 'Power LQ', measure: '[ % ]' },
    data: [
      {
        bigNumber: { value: '-0.7', measure: 'pp', trend: 'negative' as const },
        secondaryInfo: { value: '45.4', label: '[ % ]' },
        comparison: { label: 'vs', value: 'LY' },
      },
    ],
  },
];

describe('BigNumbersSection', () => {
  describe('Component Rendering', () => {
    it('should render without errors', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
        />,
      );

      expect(screen.getByTestId('content-card')).toBeInTheDocument();
    });

    it('should render all BigNumbers from data', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
        />,
      );

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers).toHaveLength(2);
    });

    it('should render ChartHeader for each BigNumber', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
        />,
      );

      expect(screen.getByText('Power YTD')).toBeInTheDocument();
      expect(screen.getByText('Power LQ')).toBeInTheDocument();
    });
  });

  describe('ContentCard Props', () => {
    it('should render ContentCard with correct props', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          tooltip="Test Tooltip"
          data={mockData}
          loading={false}
          error={null}
        />,
      );

      const contentCard = screen.getByTestId('content-card');
      expect(contentCard).toBeInTheDocument();
      expect(contentCard).toHaveAttribute('data-title', 'Test Title');
      expect(contentCard).toHaveAttribute('data-full-width', 'true');
    });
  });

  describe('DataStateHandler Props', () => {
    it('should pass loading state correctly', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={true}
          error={null}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: true,
        }),
      );
    });

    it('should pass error state correctly', () => {
      const error = new Error('Test error');
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={error}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          error,
        }),
      );
    });

    it('should pass empty state when data is undefined', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={undefined}
          loading={false}
          error={null}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          empty: true,
        }),
      );
    });

    it('should pass empty state when data is empty array', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={[]}
          loading={false}
          error={null}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          empty: true,
        }),
      );
    });
  });

  describe('Selection Logic', () => {
    it('should have first item selected by default', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
        />,
      );

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers[0]).toHaveAttribute('data-selected', 'true');
      expect(bigNumbers[1]).toHaveAttribute('data-selected', 'false');
    });

    it('should respect defaultSelected prop', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
          defaultSelected={1}
        />,
      );

      const bigNumbers = screen.getAllByTestId('big-number');
      expect(bigNumbers[0]).toHaveAttribute('data-selected', 'false');
      expect(bigNumbers[1]).toHaveAttribute('data-selected', 'true');
    });

    it('should call onSelect callback when item is clicked', () => {
      const onSelect = jest.fn();
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
          onSelect={onSelect}
        />,
      );

      const bigNumbers = screen.getAllByTestId('big-number');
      fireEvent.click(bigNumbers[1]);

      expect(onSelect).toHaveBeenCalledWith(1);
    });
  });

  describe('BigNumber Props', () => {
    it('should pass correct props to BigNumber', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
          orientation="horizontal"
        />,
      );

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockData[0].data,
          size: 'small',
          asCard: true,
          spacing: 'loose',
          orientation: 'horizontal',
          fullWidth: true,
        }),
      );
    });

    it('should use default orientation when not specified', () => {
      render(
        <BigNumbersSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={null}
        />,
      );

      expect(mockBigNumber).toHaveBeenCalledWith(
        expect.objectContaining({
          orientation: 'vertical',
        }),
      );
    });
  });
});

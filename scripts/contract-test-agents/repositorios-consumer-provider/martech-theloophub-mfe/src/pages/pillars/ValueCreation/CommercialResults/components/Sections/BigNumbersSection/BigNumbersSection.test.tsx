import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { UseBigNumberData } from '../../../types';
import { BigNumbersSection } from './BigNumbersSection';

const mockBigNumber = jest.fn();
const mockChartHeader = jest.fn();
const mockDataStateHandler = jest.fn();

jest.mock('components', () => ({
  ContentCard: ({
    children,
    title,
    fullWidth,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    title: string;
    fullWidth?: boolean;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'content-card'}
      data-title={title}
      data-full-width={String(fullWidth)}
    >
      {children}
    </div>
  ),
  BigNumber: (props: Record<string, unknown>) => {
    mockBigNumber(props);
    return (
      <button
        type="button"
        data-testid={props.dataTestId as string}
        data-selected={String(props.isSelected)}
        data-orientation={props.orientation as string}
        onClick={props.onClick as () => void}
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
    skeletonProps?: Record<string, unknown>;
  }) => {
    mockDataStateHandler(props);
    if (props.loading) return <div data-testid="loading">Loading...</div>;
    if (props.error)
      return <div data-testid="error">{props.error.message}</div>;
    if (props.empty) return <div data-testid="empty">No data</div>;
    return <div data-testid="content">{props.children}</div>;
  },
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock('./BigNumbersSection.styles', () => ({
  StyledBigNumbersContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="big-numbers-container">{children}</div>
  ),
}));

const mockData: UseBigNumberData = {
  title: 'Overtime Performance',
  loading: false,
  error: null,
  selectedBigNumberIndex: 0,
  handleBigNumbersSelect: jest.fn(),
  bigNumbersData: [
    {
      header: { title: 'Volume YTD', measure: '[ k hl ]' },
      data: [
        {
          bigNumber: { value: '-0.5', measure: '%', trend: 'negative' },
          secondaryInfo: { value: '229,454.2', label: '[ k hl ]' },
          comparison: { label: 'vs', value: 'LY' },
        },
      ],
    },
    {
      header: { title: 'Volume L3M', measure: '[ k hl ]' },
      data: [
        {
          bigNumber: { value: '-0.6', measure: '%', trend: 'negative' },
          secondaryInfo: { value: '142,010.1', label: '[ k hl ]' },
          comparison: { label: 'vs', value: 'LY' },
        },
      ],
    },
    {
      header: { title: "Volume May'26", measure: '[ k hl ]' },
      data: [
        {
          bigNumber: { value: '-2.8', measure: '%', trend: 'negative' },
          secondaryInfo: { value: '48,175.2', label: '[ k hl ]' },
          comparison: { label: 'vs', value: 'LY' },
        },
      ],
    },
  ],
};

function renderSection(overrides: Partial<UseBigNumberData> = {}) {
  const data: UseBigNumberData = { ...mockData, ...overrides };
  return render(<BigNumbersSection data={data} />);
}

describe('BigNumbersSection', () => {
  beforeEach(() => {
    mockBigNumber.mockClear();
    mockChartHeader.mockClear();
    mockDataStateHandler.mockClear();
    (mockData.handleBigNumbersSelect as jest.Mock).mockClear();
  });

  describe('Rendering', () => {
    it('renders without errors', () => {
      renderSection();

      expect(
        screen.getByTestId('commercial-results-big-numbers-section'),
      ).toBeInTheDocument();
    });

    it('renders ContentCard with the title from data and fullWidth', () => {
      renderSection();

      const card = screen.getByTestId('commercial-results-big-numbers-section');
      expect(card).toHaveAttribute('data-title', 'Overtime Performance');
      expect(card).toHaveAttribute('data-full-width', 'true');
    });

    it('renders one BigNumber per item in bigNumbersData', () => {
      renderSection();

      expect(
        screen.getAllByTestId(/^commercial-results-big-number-/),
      ).toHaveLength(3);
    });

    it('renders a ChartHeader with the correct title for each BigNumber', () => {
      renderSection();

      expect(screen.getByText('Volume YTD')).toBeInTheDocument();
      expect(screen.getByText('Volume L3M')).toBeInTheDocument();
      expect(screen.getByText("Volume May'26")).toBeInTheDocument();
    });

    it('renders the big-numbers-container', () => {
      renderSection();

      expect(screen.getByTestId('big-numbers-container')).toBeInTheDocument();
    });
  });

  describe('DataStateHandler states', () => {
    it('shows loading state when loading=true', () => {
      renderSection({ loading: true });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(
        screen.queryByTestId('commercial-results-big-number-0'),
      ).not.toBeInTheDocument();
    });

    it('shows error state when error is provided', () => {
      renderSection({ error: new Error('Failed to load') });

      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load');
    });

    it('shows empty state when bigNumbersData is empty', () => {
      renderSection({ bigNumbersData: [] });

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('passes the correct skeletonProps to DataStateHandler', () => {
      const skeletonProps = {
        height: '200px',
        width: '500px',
        length: 3,
        borderRadius: 'large' as const,
      };
      render(
        <BigNumbersSection data={mockData} skeletonProps={skeletonProps} />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({ skeletonProps }),
      );
    });
  });

  describe('Selection', () => {
    it('marks the item at selectedBigNumberIndex as selected', () => {
      renderSection({ selectedBigNumberIndex: 1 });

      const buttons = screen.getAllByTestId(/^commercial-results-big-number-/);
      expect(buttons[0]).toHaveAttribute('data-selected', 'false');
      expect(buttons[1]).toHaveAttribute('data-selected', 'true');
      expect(buttons[2]).toHaveAttribute('data-selected', 'false');
    });

    it('marks index 0 as selected when selectedBigNumberIndex is 0', () => {
      renderSection({ selectedBigNumberIndex: 0 });

      expect(
        screen.getByTestId('commercial-results-big-number-0'),
      ).toHaveAttribute('data-selected', 'true');
    });

    it('calls handleBigNumbersSelect with the correct index on click', () => {
      renderSection();

      fireEvent.click(screen.getByTestId('commercial-results-big-number-2'));

      expect(mockData.handleBigNumbersSelect).toHaveBeenCalledWith(2);
    });

    it('calls handleBigNumbersSelect with index 0 when the first item is clicked', () => {
      renderSection();

      fireEvent.click(screen.getByTestId('commercial-results-big-number-0'));

      expect(mockData.handleBigNumbersSelect).toHaveBeenCalledWith(0);
    });
  });
});

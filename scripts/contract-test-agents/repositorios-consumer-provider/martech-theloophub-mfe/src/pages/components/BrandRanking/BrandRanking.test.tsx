import { render, screen } from '@testing-library/react';

import { BrandRanking } from './BrandRanking';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockHandleViewChange = jest.fn();

const mockRankingData = {
  labels: [
    ['Brand A', 'Subtitle A'],
    ['Brand B', 'Subtitle B'],
  ] as [string, string][],
  datasets: [
    {
      data: [45, 30],
      source: ['abi', 'comp'],
      unitMeasure: ['%', '%'],
    },
    {
      data: [45, 30],
      unitMeasure: ['%', '%'],
      source: ['abi', 'comp'],
    },
    {
      data: [45, 30],
      source: ['abi', 'comp'],
      unitMeasure: ['%', '%'],
    },
  ],

  legend: {
    items: [
      { label: 'ABI Brand', color: '#E8D19D' },
      { label: 'Competitor', color: '#C0D1DC' },
    ],
  },
};

jest.mock('components', () => ({
  CaptionItem: 'CaptionItem',
  Legend: ({ caption, legendPosition, font }: any) => (
    <div
      data-testid="legend"
      data-caption-length={caption?.length}
      data-legend-position={legendPosition}
      data-font={font}
    >
      Legend Component
    </div>
  ),
}));

jest.mock('./BrandRanking.styles', () => ({
  BrandRankingContainer: ({
    children,
    isExport,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    isExport?: boolean;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'brand-ranking-container'}
      data-is-export={String(!!isExport)}
    >
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledGridItem: ({
    children,
    xs,
    sm,
    md,
    lg,
    xl,
    'data-testid': dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'styled-grid-item'}
      data-xs={xs}
      data-sm={sm}
      data-md={md}
      data-lg={lg}
      data-xl={xl}
    >
      {children}
    </div>
  ),
}));

jest.mock('pages/pillars/Category/POSBook/components', () => ({
  NoDataAvailable: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'no-data-available'}>No Data Available</div>
  ),
}));

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
}));

jest.mock('./components/RankedContainer/RankedContainer', () => ({
  RankedContainer: ({
    title,
    measure,
    onViewChange,
    data,
    dataTestId,
  }: any) => (
    <div
      data-testid={
        dataTestId ? `ranked-container-${dataTestId}` : 'ranked-container'
      }
      data-title={title}
      data-measure={measure}
      data-has-on-view-change={!!onViewChange}
      data-has-data={!!data}
      data-labels-length={data?.labels?.length}
    >
      RankedContainer Component
    </div>
  ),
}));

describe('BrandRanking', () => {
  const defaultProps = {
    handleViewChange: mockHandleViewChange,
    ranking: mockRankingData,
    formatMessage: mockFormatMessage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('renders BrandRankingContainer', () => {
      render(<BrandRanking {...defaultProps} />);

      expect(screen.getByTestId('brand-ranking-container')).toBeInTheDocument();
    });

    it('renders StyledGridItem', () => {
      render(<BrandRanking {...defaultProps} />);

      expect(screen.getByTestId('styled-grid-item')).toBeInTheDocument();
    });

    it('StyledGridItem has correct grid sizes', () => {
      render(<BrandRanking {...defaultProps} />);

      const gridItem = screen.getByTestId('styled-grid-item');
      expect(gridItem).toHaveAttribute('data-xs', '12');
      expect(gridItem).toHaveAttribute('data-sm', '12');
      expect(gridItem).toHaveAttribute('data-md', '12');
      expect(gridItem).toHaveAttribute('data-lg', '12');
      expect(gridItem).toHaveAttribute('data-xl', '12');
    });
  });

  describe('Conditional Rendering - NoDataAvailable', () => {
    it('renders NoDataAvailable when ranking is null', () => {
      render(<BrandRanking {...defaultProps} ranking={null as any} />);

      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    it('renders NoDataAvailable when ranking is undefined', () => {
      render(<BrandRanking {...defaultProps} ranking={undefined as any} />);

      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    it('renders NoDataAvailable when ranking has #empty property', () => {
      const emptyRanking = { ...mockRankingData, '#empty': true } as any;
      render(<BrandRanking {...defaultProps} ranking={emptyRanking} />);

      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    it('does not render Legend when ranking is empty', () => {
      render(<BrandRanking {...defaultProps} ranking={null as any} />);

      expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
    });

    it('does not render RankedContainer when ranking is empty', () => {
      render(<BrandRanking {...defaultProps} ranking={null as any} />);

      expect(screen.queryByTestId('ranked-container')).not.toBeInTheDocument();
    });
  });

  describe('Conditional Rendering - Content', () => {
    it('renders Legend when ranking has data', () => {
      render(<BrandRanking {...defaultProps} />);

      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('renders RankedContainer when ranking has data', () => {
      render(<BrandRanking {...defaultProps} />);

      expect(screen.getByTestId('ranked-container')).toBeInTheDocument();
    });

    it('does not render NoDataAvailable when ranking has data', () => {
      render(<BrandRanking {...defaultProps} />);

      expect(screen.queryByTestId('no-data-available')).not.toBeInTheDocument();
    });

    it('renders content wrapper with correct styles', () => {
      const { container } = render(<BrandRanking {...defaultProps} />);

      const contentWrapper = container.querySelector(
        'div[style*="display: grid"]',
      );
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveStyle({ display: 'grid', gap: '24px' });
    });
  });

  describe('Legend Props', () => {
    it('passes BRAND_PARTICIPATION_CHART_CAPTION as caption', () => {
      render(<BrandRanking {...defaultProps} />);

      const legend = screen.getByTestId('legend');
      expect(legend).toHaveAttribute('data-caption-length', '2');
    });

    it('passes legendPosition as "left"', () => {
      render(<BrandRanking {...defaultProps} />);

      const legend = screen.getByTestId('legend');
      expect(legend).toHaveAttribute('data-legend-position', 'left');
    });

    it('passes font as "heading"', () => {
      render(<BrandRanking {...defaultProps} />);

      const legend = screen.getByTestId('legend');
      expect(legend).toHaveAttribute('data-font', 'heading');
    });
  });

  describe('RankedContainer Props', () => {
    it('passes data with ranking spread and labels', () => {
      render(<BrandRanking {...defaultProps} />);

      const rankedContainer = screen.getByTestId('ranked-container');
      expect(rankedContainer).toHaveAttribute('data-has-data', 'true');
      expect(rankedContainer).toHaveAttribute('data-labels-length', '2');
    });

    it('uses empty array as default labels when ranking.labels is undefined', () => {
      const rankingWithoutLabels = { ...mockRankingData, labels: undefined };
      render(
        <BrandRanking
          {...defaultProps}
          ranking={rankingWithoutLabels as any}
        />,
      );

      const rankedContainer = screen.getByTestId('ranked-container');
      expect(rankedContainer).toHaveAttribute('data-labels-length', '0');
    });

    it('uses empty array as default labels when ranking.labels is null', () => {
      const rankingWithNullLabels = { ...mockRankingData, labels: null as any };
      render(
        <BrandRanking {...defaultProps} ranking={rankingWithNullLabels} />,
      );

      const rankedContainer = screen.getByTestId('ranked-container');
      expect(rankedContainer).toHaveAttribute('data-labels-length', '0');
    });
  });

  describe('Edge Cases', () => {
    it('handles ranking with empty datasets', () => {
      const emptyDatasetsRanking = {
        labels: [] as [string, string][],
        datasets: [],
      };
      render(
        <BrandRanking
          {...defaultProps}
          ranking={emptyDatasetsRanking as any}
        />,
      );

      expect(screen.getByTestId('legend')).toBeInTheDocument();
      expect(screen.getByTestId('ranked-container')).toBeInTheDocument();
    });

    it('handles ranking with missing legend', () => {
      const noLegendRanking = {
        labels: [['Brand A', 'Subtitle A']] as [string, string][],
        datasets: [{ data: [45] }],
      };
      render(
        <BrandRanking {...defaultProps} ranking={noLegendRanking as any} />,
      );

      expect(screen.getByTestId('ranked-container')).toBeInTheDocument();
    });

    it('handles ranking with #empty as false', () => {
      const notEmptyRanking = { ...mockRankingData, '#empty': false } as any;
      render(<BrandRanking {...defaultProps} ranking={notEmptyRanking} />);

      expect(screen.queryByTestId('no-data-available')).not.toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('handles ranking with #empty as truthy string', () => {
      const emptyStringRanking = { ...mockRankingData, '#empty': 'yes' } as any;
      render(<BrandRanking {...defaultProps} ranking={emptyStringRanking} />);

      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    it('handles ranking with only labels', () => {
      const onlyLabelsRanking = {
        labels: [['Brand A', 'Subtitle A']] as [string, string][],
      };
      render(
        <BrandRanking {...defaultProps} ranking={onlyLabelsRanking as any} />,
      );

      expect(screen.getByTestId('ranked-container')).toBeInTheDocument();
    });
  });

  describe('Data Transformation', () => {
    it('spreads ranking data to RankedContainer', () => {
      render(<BrandRanking {...defaultProps} />);

      const rankedContainer = screen.getByTestId('ranked-container');
      expect(rankedContainer).toHaveAttribute('data-has-data', 'true');
    });

    it('preserves all ranking properties except labels override', () => {
      const customRanking = {
        ...mockRankingData,
        customProp: 'customValue',
      };
      render(<BrandRanking {...defaultProps} ranking={customRanking as any} />);

      const rankedContainer = screen.getByTestId('ranked-container');
      expect(rankedContainer).toBeInTheDocument();
    });

    it('ensures labels is always an array', () => {
      render(<BrandRanking {...defaultProps} />);

      const rankedContainer = screen.getByTestId('ranked-container');
      expect(rankedContainer).toHaveAttribute('data-labels-length');
    });
  });
});

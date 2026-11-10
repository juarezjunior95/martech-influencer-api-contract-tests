import { render, screen } from '@testing-library/react';

import { FlagRank } from './FlagRank';

jest.mock('@hexa-ui/components', () => ({
  SkeletonLoader: ({
    height,
    width,
    dataTestId,
  }: {
    height: string;
    width: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'skeleton-loader'}
      data-height={height}
      data-width={width}
    />
  ),
}));

jest.mock('./FlagRank.styles', () => ({
  StyledFlagsBox: ({
    children,
    dataTestId,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId ? `flag-rank-${dataTestId}` : undefined}>
      {children}
    </div>
  ),
  StyledFlaItem: ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: string;
  }) => (
    <div data-testid="flag-item" data-position={position}>
      {children}
    </div>
  ),
  StyledFlagItemContainer: ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: string;
  }) => (
    <div data-testid="flag-item-container" data-position={position}>
      {children}
    </div>
  ),
  StyledBoxContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="box-content">{children}</div>
  ),
  StyledFlagText: ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: string;
  }) => (
    <span data-testid="flag-text" data-position={position}>
      {children}
    </span>
  ),
  StyledImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="flag-image" src={src} alt={alt} />
  ),
}));

describe('FlagRank', () => {
  const mockRankData = {
    label: 'Country Rankings',
    rank: [
      {
        countryName: 'Brazil',
        position: '1',
        flag: 'br.png',
        value: '95',
        measure: 'pts',
      },
      {
        countryName: 'Argentina',
        position: '2',
        flag: 'ar.png',
        value: '88',
        measure: 'pts',
      },
      {
        countryName: 'Colombia',
        position: '3',
        flag: 'co.png',
        value: '75',
        measure: 'pts',
      },
      {
        countryName: 'Mexico',
        position: '4',
        flag: 'mx.png',
        value: '70',
        measure: 'pts',
      },
      {
        countryName: 'Peru',
        position: '5',
        flag: 'pe.png',
        value: '65',
        measure: 'pts',
      },
    ],
  };

  describe('Loading state', () => {
    it('should render skeleton loaders when loading is true', () => {
      render(<FlagRank rankData={mockRankData} loading={true} />);

      const skeletons = screen.getAllByTestId('skeleton-loader');
      expect(skeletons).toHaveLength(3);
    });

    it('should render skeletons with correct dimensions', () => {
      render(<FlagRank rankData={mockRankData} loading={true} />);

      const skeletons = screen.getAllByTestId('skeleton-loader');
      expect(skeletons[0]).toHaveAttribute('data-height', '200px');
      expect(skeletons[0]).toHaveAttribute('data-width', '330px');
      expect(skeletons[1]).toHaveAttribute('data-height', '280px');
      expect(skeletons[1]).toHaveAttribute('data-width', '514px');
      expect(skeletons[2]).toHaveAttribute('data-height', '200px');
      expect(skeletons[2]).toHaveAttribute('data-width', '330px');
    });

    it('should not render flag items when loading', () => {
      render(<FlagRank rankData={mockRankData} loading={true} />);

      expect(screen.queryByTestId('flag-item')).not.toBeInTheDocument();
    });
  });

  describe('Data rendering', () => {
    it('should render only top 3 flags', () => {
      render(<FlagRank rankData={mockRankData} />);

      const flagItems = screen.getAllByTestId('flag-item');
      expect(flagItems).toHaveLength(3);
    });

    it('should render flag images for each country', () => {
      render(<FlagRank rankData={mockRankData} />);

      const flags = screen.getAllByTestId('flag-image');
      expect(flags).toHaveLength(3);
      expect(flags[0]).toHaveAttribute('src', 'br.png');
      expect(flags[1]).toHaveAttribute('src', 'ar.png');
      expect(flags[2]).toHaveAttribute('src', 'co.png');
    });

    it('should render correct alt text for flag images', () => {
      render(<FlagRank rankData={mockRankData} />);

      const flags = screen.getAllByTestId('flag-image');
      expect(flags[0]).toHaveAttribute('alt', 'Brazil flag');
      expect(flags[1]).toHaveAttribute('alt', 'Argentina flag');
      expect(flags[2]).toHaveAttribute('alt', 'Colombia flag');
    });

    it('should render position numbers with country names', () => {
      render(<FlagRank rankData={mockRankData} />);

      expect(screen.getByText('# 1 Brazil')).toBeInTheDocument();
      expect(screen.getByText('# 2 Argentina')).toBeInTheDocument();
      expect(screen.getByText('# 3 Colombia')).toBeInTheDocument();
    });

    it('should not render 4th and 5th positions', () => {
      render(<FlagRank rankData={mockRankData} />);

      expect(screen.queryByText(/Mexico/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Peru/)).not.toBeInTheDocument();
    });
  });

  describe('Position styling', () => {
    it('should pass correct position to flag items', () => {
      render(<FlagRank rankData={mockRankData} />);

      const flagItems = screen.getAllByTestId('flag-item');
      expect(flagItems[0]).toHaveAttribute('data-position', '1');
      expect(flagItems[1]).toHaveAttribute('data-position', '2');
      expect(flagItems[2]).toHaveAttribute('data-position', '3');
    });

    it('should pass correct position to flag text', () => {
      render(<FlagRank rankData={mockRankData} />);

      const flagTexts = screen.getAllByTestId('flag-text');
      expect(flagTexts[0]).toHaveAttribute('data-position', '1');
      expect(flagTexts[1]).toHaveAttribute('data-position', '2');
      expect(flagTexts[2]).toHaveAttribute('data-position', '3');
    });
  });

  describe('Flag image handling', () => {
    it('should not render flag image when flag is "flag"', () => {
      const dataWithNoFlag = {
        label: 'Test',
        rank: [
          {
            countryName: 'Brazil',
            position: '1',
            flag: 'flag',
            value: '95',
            measure: 'pts',
          },
          {
            countryName: 'Argentina',
            position: '2',
            flag: 'ar.png',
            value: '88',
            measure: 'pts',
          },
          {
            countryName: 'Colombia',
            position: '3',
            flag: 'co.png',
            value: '75',
            measure: 'pts',
          },
        ],
      };
      render(<FlagRank rankData={dataWithNoFlag} />);

      const flags = screen.getAllByTestId('flag-image');
      expect(flags).toHaveLength(2);
    });
  });

  describe('Empty data handling', () => {
    it('should handle undefined rank data', () => {
      const emptyData = { label: 'Empty', rank: undefined as unknown as [] };

      render(<FlagRank rankData={emptyData} />);

      expect(screen.queryByTestId('flags-box')).not.toBeInTheDocument();
      expect(screen.queryByTestId('flag-item')).not.toBeInTheDocument();
    });

    it('should handle empty rank array', () => {
      const emptyData = { label: 'Empty', rank: [] };

      render(<FlagRank rankData={emptyData} />);

      expect(screen.queryByTestId('flags-box')).not.toBeInTheDocument();
      expect(screen.queryByTestId('flag-item')).not.toBeInTheDocument();
    });

    it('should handle less than 3 items', () => {
      const partialData = {
        label: 'Partial',
        rank: [
          {
            countryName: 'Brazil',
            position: '1',
            flag: 'br.png',
            value: '95',
            measure: 'pts',
          },
        ],
      };
      render(<FlagRank rankData={partialData} />);

      const flagItems = screen.getAllByTestId('flag-item');
      expect(flagItems).toHaveLength(1);
    });
  });
});

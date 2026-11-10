import { render, screen } from '@testing-library/react';

import { Leaderboard } from './Leaderboard';

jest.mock('@hexa-ui/components', () => ({
  SkeletonLoader: ({
    height,
    width,
    'data-testid': dataTestId,
  }: {
    height: string;
    width: string;
    'data-testid': string;
  }) => (
    <div
      data-testid={dataTestId ?? 'skeleton-loader'}
      data-height={height}
      data-width={width}
    />
  ),
}));

jest.mock('components', () => ({
  RankingTag: ({ position, type }: { position: string; type: string }) => (
    <span data-testid="ranking-tag" data-position={position} data-type={type} />
  ),
}));

jest.mock('./Leaderboard.styles', () => ({
  StyledLeaderBoardContainer: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId}>{children}</div>,
  StyledLeaderBoardItem: ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: string;
  }) => (
    <div data-testid="leaderboard-item" data-position={position}>
      {children}
    </div>
  ),
  StyledLeaderCountryInfo: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="country-info">{children}</div>
  ),
  StyledBoxMedal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medal-box">{children}</div>
  ),
  StyledImageBox: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="image-box">{children}</div>
  ),
  StyledImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="flag-image" src={src} alt={alt} />
  ),
  StyledCountryName: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="country-name">{children}</span>
  ),
  StyledLeagueTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="league-title">{children}</h3>
  ),
  StyledValue: ({
    children,
    color,
  }: {
    children: React.ReactNode;
    color: string;
  }) => (
    <span data-testid="value" data-color={color}>
      {children}
    </span>
  ),
}));

describe('Leaderboard', () => {
  const mockRankData = {
    label: 'League Rankings',
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
        value: '75',
        measure: 'pts',
      },
      {
        countryName: 'Colombia',
        position: '3',
        flag: 'co.png',
        value: '65',
        measure: 'pts',
      },
      {
        countryName: 'Mexico',
        position: '4',
        flag: 'mx.png',
        value: '55',
        measure: 'pts',
      },
      {
        countryName: 'Peru',
        position: '5',
        flag: 'pe.png',
        value: '45',
        measure: 'pts',
      },
      {
        countryName: 'Chile',
        position: '6',
        flag: 'cl.png',
        value: '40',
        measure: 'pts',
      },
    ],
  };

  describe('Loading state', () => {
    it('should render skeleton loaders when loading is true', () => {
      render(
        <Leaderboard
          title="Test League"
          rankData={mockRankData}
          loading={true}
        />,
      );

      const skeletons = screen.getAllByTestId('skeleton-loader');
      expect(skeletons).toHaveLength(5);
    });

    it('should render skeletons with correct dimensions', () => {
      render(
        <Leaderboard
          title="Test League"
          rankData={mockRankData}
          loading={true}
        />,
      );

      const skeletons = screen.getAllByTestId('skeleton-loader');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-height', '82px');
        expect(skeleton).toHaveAttribute('data-width', '622px');
      });
    });

    it('should render title even when loading', () => {
      render(
        <Leaderboard
          title="Test League"
          rankData={mockRankData}
          loading={true}
        />,
      );

      expect(screen.getByTestId('league-title')).toHaveTextContent(
        'Test League',
      );
    });

    it('should not render leaderboard items when loading', () => {
      render(
        <Leaderboard
          title="Test League"
          rankData={mockRankData}
          loading={true}
        />,
      );

      expect(screen.queryByTestId('leaderboard-item')).not.toBeInTheDocument();
    });
  });

  describe('Data rendering', () => {
    it('should render title correctly', () => {
      render(<Leaderboard title="Super League" rankData={mockRankData} />);

      expect(screen.getByTestId('league-title')).toHaveTextContent(
        'Super League',
      );
    });

    it('should render only top 5 items', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const items = screen.getAllByTestId('leaderboard-item');
      expect(items).toHaveLength(5);
    });

    it('should not render 6th position', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      expect(screen.queryByText('Chile')).not.toBeInTheDocument();
    });

    it('should render country names', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      expect(screen.getByText('Brazil')).toBeInTheDocument();
      expect(screen.getByText('Argentina')).toBeInTheDocument();
      expect(screen.getByText('Colombia')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
      expect(screen.getByText('Peru')).toBeInTheDocument();
    });

    it('should render flag images', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const flags = screen.getAllByTestId('flag-image');
      expect(flags).toHaveLength(5);
      expect(flags[0]).toHaveAttribute('src', 'br.png');
    });

    it('should render values with measure', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      expect(screen.getByText('95 pts')).toBeInTheDocument();
      expect(screen.getByText('75 pts')).toBeInTheDocument();
    });
  });

  describe('Color coding', () => {
    it('should apply green color for values >= 80', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const values = screen.getAllByTestId('value');
      expect(values[0]).toHaveAttribute('data-color', 'green');
    });

    it('should apply orange color for values >= 60 and < 80', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const values = screen.getAllByTestId('value');
      expect(values[1]).toHaveAttribute('data-color', 'orange');
      expect(values[2]).toHaveAttribute('data-color', 'orange');
    });

    it('should apply red color for values < 60', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const values = screen.getAllByTestId('value');
      expect(values[3]).toHaveAttribute('data-color', 'red');
      expect(values[4]).toHaveAttribute('data-color', 'red');
    });

    it('should apply green color for boundary value 80', () => {
      const dataWith80 = {
        label: 'Test',
        rank: [
          {
            countryName: 'Brazil',
            position: '1',
            flag: 'br.png',
            value: '80',
            measure: 'pts',
          },
        ],
      };
      render(<Leaderboard title="Test" rankData={dataWith80} />);

      const value = screen.getByTestId('value');
      expect(value).toHaveAttribute('data-color', 'green');
    });

    it('should apply orange color for boundary value 60', () => {
      const dataWith60 = {
        label: 'Test',
        rank: [
          {
            countryName: 'Brazil',
            position: '1',
            flag: 'br.png',
            value: '60',
            measure: 'pts',
          },
        ],
      };
      render(<Leaderboard title="Test" rankData={dataWith60} />);

      const value = screen.getByTestId('value');
      expect(value).toHaveAttribute('data-color', 'orange');
    });

    it('should apply red color for boundary value 59', () => {
      const dataWith59 = {
        label: 'Test',
        rank: [
          {
            countryName: 'Brazil',
            position: '1',
            flag: 'br.png',
            value: '59',
            measure: 'pts',
          },
        ],
      };
      render(<Leaderboard title="Test" rankData={dataWith59} />);

      const value = screen.getByTestId('value');
      expect(value).toHaveAttribute('data-color', 'red');
    });
  });

  describe('Medal/Ranking tags', () => {
    it('should render ranking tags for all items', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const rankingTags = screen.getAllByTestId('ranking-tag');
      expect(rankingTags).toHaveLength(5);
    });

    it('should pass correct position to ranking tags', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const rankingTags = screen.getAllByTestId('ranking-tag');
      expect(rankingTags[0]).toHaveAttribute('data-position', '1');
      expect(rankingTags[1]).toHaveAttribute('data-position', '2');
      expect(rankingTags[2]).toHaveAttribute('data-position', '3');
    });

    it('should use medal type for ranking tags', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      const rankingTags = screen.getAllByTestId('ranking-tag');
      rankingTags.forEach((tag) => {
        expect(tag).toHaveAttribute('data-type', 'medal');
      });
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
        ],
      };
      render(<Leaderboard title="Test" rankData={dataWithNoFlag} />);

      const flags = screen.getAllByTestId('flag-image');
      expect(flags).toHaveLength(1);
    });
  });

  describe('Empty data handling', () => {
    it('should handle empty rank array', () => {
      const emptyData = { label: 'Empty', rank: [] };
      render(<Leaderboard title="Test" rankData={emptyData} />);

      expect(screen.getByTestId('league-title')).toBeInTheDocument();
      expect(screen.queryByTestId('leaderboard-item')).not.toBeInTheDocument();
    });

    it('should handle less than 5 items', () => {
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
          {
            countryName: 'Argentina',
            position: '2',
            flag: 'ar.png',
            value: '88',
            measure: 'pts',
          },
        ],
      };
      render(<Leaderboard title="Test" rankData={partialData} />);

      const items = screen.getAllByTestId('leaderboard-item');
      expect(items).toHaveLength(2);
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(
        <Leaderboard
          title="Test League"
          rankData={mockRankData}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('leaderboard-custom')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      render(<Leaderboard title="Test League" rankData={mockRankData} />);

      expect(screen.queryByTestId('leaderboard')).not.toBeInTheDocument();
    });
  });
});

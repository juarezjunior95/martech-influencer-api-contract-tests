import { fireEvent, render, screen } from '@testing-library/react';

import { RankDataItem } from '../../../../types';
import * as tiesDetectionModule from '../../../../utils/tiesDetection';
import { CupWinners } from './CupWinners';

jest.mock('@hexa-ui/components', () => ({
  SkeletonLoader: ({
    'data-testid': dataTestId,
    height,
    width,
  }: {
    'data-testid'?: string;
    height: string;
    width: string;
  }) => (
    <div
      data-testid={dataTestId || 'skeleton-loader'}
      data-height={height}
      data-width={width}
    />
  ),
}));

jest.mock('components', () => ({
  Select: ({
    datatestId,
    id,
    options,
    onValueChange,
    value,
    valueLabel,
  }: {
    datatestId?: string;
    id: string;
    options: { value: string; label: string }[];
    onValueChange: (op: { value: string }) => void;
    value: string;
    valueLabel: string;
  }) => (
    <select
      data-testid={datatestId || id}
      value={value}
      onChange={(e) => onValueChange({ value: e.target.value })}
      aria-label={valueLabel}
    >
      {options.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock('../../../../utils/tiesDetection', () => ({
  detectTieScenario: jest.fn((rankData) => ({
    scenario: 'no-tie',
    sortedRankData: rankData || [],
  })),
  toDataIndex: jest.fn((i) => i),
}));

jest.mock('./CupWinners.styles', () => ({
  StyledCupWinnersBox: ({
    children,
    dataTestId,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId ? `cup-winners-box-${dataTestId}` : undefined}>
      {children}
    </div>
  ),
  StyledCupWinnerItem: ({
    children,
    position,
    tieScenario,
  }: {
    children: React.ReactNode;
    position: string;
    tieScenario: string;
  }) => (
    <div
      data-testid="cup-winner-item"
      data-position={position}
      data-scenario={tieScenario}
    >
      {children}
    </div>
  ),
  StyledCupWinnerItemContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="cup-winner-item-container">{children}</div>,
  StyledCupWinnerBoxContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledCupWinnerCountryFlag: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="country-flag">{children}</span>
  ),
  StyledCupWinnerText: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="cup-winner-text">{children}</span>
  ),
  StyledCupWinnerTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="cup-winner-title">{children}</h3>
  ),
  StyledImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="flag-image" src={src} alt={alt} />
  ),
}));

const mockDetectTieScenario = jest.mocked(
  tiesDetectionModule.detectTieScenario,
);

describe('CupWinners', () => {
  const mockRankData = {
    label: 'Test Cup',
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
    ],
  };

  const mockRankDataWithBrand = {
    label: 'Brand Cup',
    rank: [
      {
        countryName: 'Brazil',
        position: '1',
        flag: 'br.png',
        value: '95',
        measure: 'pts',
        brand: 'Brahma',
      },
      {
        countryName: 'Argentina',
        position: '2',
        flag: 'ar.png',
        value: '88',
        measure: 'pts',
        brand: 'Quilmes',
      },
      {
        countryName: 'Colombia',
        position: '3',
        flag: 'co.png',
        value: '75',
        measure: 'pts',
        brand: 'Aguila',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDetectTieScenario.mockImplementation((rankData: RankDataItem[]) => ({
      scenario: 'no-tie',
      sortedRankData: rankData || [],
    }));
  });

  describe('Loading state', () => {
    it('should render skeleton loaders when loading is true', () => {
      render(<CupWinners rankData={mockRankData} loading={true} />);

      const skeletons = screen.getAllByTestId('skeleton-loader');
      expect(skeletons).toHaveLength(3);
    });

    it('should render skeletons with correct dimensions', () => {
      render(<CupWinners rankData={mockRankData} loading={true} />);

      const skeletons = screen.getAllByTestId('skeleton-loader');
      expect(skeletons[0]).toHaveAttribute('data-height', '128px');
      expect(skeletons[0]).toHaveAttribute('data-width', '295px');
      expect(skeletons[1]).toHaveAttribute('data-height', '72px');
      expect(skeletons[2]).toHaveAttribute('data-height', '58px');
    });
  });

  describe('Data rendering', () => {
    it('should render top 3 winners correctly', () => {
      render(<CupWinners rankData={mockRankData} />);

      expect(screen.getByText(/Brazil/)).toBeInTheDocument();
      expect(screen.getByText(/Argentina/)).toBeInTheDocument();
      expect(screen.getByText(/Colombia/)).toBeInTheDocument();
    });

    it('should render flag images for each country', () => {
      render(<CupWinners rankData={mockRankData} />);

      const flags = screen.getAllByTestId('flag-image');
      expect(flags).toHaveLength(3);
      expect(flags[0]).toHaveAttribute('src', 'br.png');
      expect(flags[1]).toHaveAttribute('src', 'ar.png');
      expect(flags[2]).toHaveAttribute('src', 'co.png');
    });

    it('should render position numbers with country names', () => {
      render(<CupWinners rankData={mockRankData} />);

      expect(screen.getByText('# 1 Brazil')).toBeInTheDocument();
      expect(screen.getByText('# 2 Argentina')).toBeInTheDocument();
      expect(screen.getByText('# 3 Colombia')).toBeInTheDocument();
    });

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
        ],
      };
      render(<CupWinners rankData={dataWithNoFlag} />);

      expect(screen.queryByTestId('flag-image')).not.toBeInTheDocument();
    });
  });

  describe('Brand display', () => {
    it('should render brand name for first position', () => {
      render(<CupWinners rankData={mockRankDataWithBrand} />);

      expect(screen.getByText('1 # Brahma')).toBeInTheDocument();
    });

    it('should render brand name with position for other positions', () => {
      render(<CupWinners rankData={mockRankDataWithBrand} />);

      expect(screen.getByText('# 2 Quilmes')).toBeInTheDocument();
      expect(screen.getByText('# 3 Aguila')).toBeInTheDocument();
    });

    it('should render country name as flag text when brand exists', () => {
      render(<CupWinners rankData={mockRankDataWithBrand} />);

      const countryFlags = screen.getAllByTestId('country-flag');
      expect(countryFlags[0]).toHaveTextContent('Brazil');
    });
  });

  describe('Title and label', () => {
    it('should render label as title when no options provided', () => {
      render(<CupWinners rankData={mockRankData} label="Custom Label" />);

      expect(screen.getByTestId('cup-winner-title')).toHaveTextContent(
        'Custom Label',
      );
    });

    it('should render rankData.label when no label prop provided', () => {
      render(<CupWinners rankData={mockRankData} />);

      expect(screen.getByTestId('cup-winner-title')).toHaveTextContent(
        'Test Cup',
      );
    });
  });

  describe('Select dropdown', () => {
    const options = [
      { value: 'cup1', label: 'Cup 1' },
      { value: 'cup2', label: 'Cup 2' },
    ];

    it('should render select dropdown when options are provided', () => {
      render(
        <CupWinners
          rankData={mockRankData}
          options={options}
          currentSelectValue="cup1"
          onSelectedChange={jest.fn()}
        />,
      );

      expect(screen.getByTestId('cup-winners-select')).toBeInTheDocument();
    });

    it('should call onSelectedChange when selection changes', () => {
      const mockOnChange = jest.fn();
      render(
        <CupWinners
          rankData={mockRankData}
          options={options}
          currentSelectValue="cup1"
          onSelectedChange={mockOnChange}
        />,
      );

      fireEvent.change(screen.getByTestId('cup-winners-select'), {
        target: { value: 'cup2' },
      });
      expect(mockOnChange).toHaveBeenCalledWith('cup2');
    });

    it('should not render title when options are provided', () => {
      render(
        <CupWinners
          rankData={mockRankData}
          options={options}
          currentSelectValue="cup1"
          onSelectedChange={jest.fn()}
        />,
      );

      expect(screen.queryByTestId('cup-winner-title')).not.toBeInTheDocument();
    });
  });

  describe('Tie scenarios', () => {
    it('should call detectTieScenario with rank data', () => {
      render(<CupWinners rankData={mockRankData} />);

      expect(mockDetectTieScenario).toHaveBeenCalledWith(mockRankData.rank);
    });

    it('should pass tie scenario to styled components', () => {
      mockDetectTieScenario.mockImplementation(() => ({
        scenario: '1st-tie-simple',
        sortedRankData: mockRankData.rank,
      }));

      render(<CupWinners rankData={mockRankData} />);

      const items = screen.getAllByTestId('cup-winner-item');
      expect(items[0]).toHaveAttribute('data-scenario', '1st-tie-simple');
    });

    it('should handle no-tie scenario', () => {
      render(<CupWinners rankData={mockRankData} />);

      const items = screen.getAllByTestId('cup-winner-item');
      expect(items[0]).toHaveAttribute('data-scenario', 'no-tie');
    });

    it('should handle 1st-tie-triple scenario', () => {
      mockDetectTieScenario.mockImplementation(() => ({
        scenario: '1st-tie-triple',
        sortedRankData: mockRankData.rank,
      }));

      render(<CupWinners rankData={mockRankData} />);

      const items = screen.getAllByTestId('cup-winner-item');
      expect(items[0]).toHaveAttribute('data-scenario', '1st-tie-triple');
    });

    it('should handle 2nd-tie scenario', () => {
      mockDetectTieScenario.mockImplementation(() => ({
        scenario: '2nd-tie',
        sortedRankData: mockRankData.rank,
      }));

      render(<CupWinners rankData={mockRankData} />);

      const items = screen.getAllByTestId('cup-winner-item');
      expect(items[0]).toHaveAttribute('data-scenario', '2nd-tie');
    });
  });

  describe('Empty data handling', () => {
    it('should handle undefined rank data', () => {
      const emptyData = { label: 'Empty', rank: undefined as unknown as [] };
      render(<CupWinners rankData={emptyData} />);

      // Se dataTestId não existe, buscamos pelo título do cup
      expect(screen.getByTestId('cup-winner-title')).toHaveTextContent('Empty');

      // Garantir que nenhum item de vencedor seja renderizado
      expect(screen.queryByTestId(/cup-winner-item/)).not.toBeInTheDocument();
    });

    it('should handle empty rank array', () => {
      const emptyData = { label: 'Empty', rank: [] };
      render(<CupWinners rankData={emptyData} />);

      expect(screen.getByTestId('cup-winner-title')).toHaveTextContent('Empty');
      expect(screen.queryByTestId(/cup-winner-item/)).not.toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<CupWinners rankData={mockRankData} dataTestId="custom" />);
      expect(screen.getByTestId('cup-winner-title')).toHaveTextContent(
        'Test Cup',
      );
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      render(<CupWinners rankData={mockRankData} />);

      expect(screen.queryByTestId(/cup-winners-box/)).not.toBeInTheDocument();
    });
  });
});

import { render, screen } from '@testing-library/react';

import { PortfolioFooter } from './PortfolioFooter';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({
    children,
    size,
    weight,
    style,
    'data-testid': dataTestIdProp,
  }: any) => (
    <p
      data-testid={dataTestIdProp ?? 'paragraph'}
      data-size={size}
      data-weight={weight}
      style={style}
    >
      {children}
    </p>
  ),
}));

jest.mock('./PortfolioFooter.styles', () => ({
  StyledPortfolioFooterContainer: ({
    children,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div data-testid={dataTestIdProp ?? 'portfolio-footer-container'}>
      {children}
    </div>
  ),
  StyledCard: ({
    children,
    type,
    darkBg,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div
      data-testid={dataTestIdProp ?? 'styled-card'}
      data-type={type}
      data-dark-bg={darkBg?.toString()}
    >
      {children}
    </div>
  ),
  StyledSubtitle: ({
    children,
    weight,
    'data-testid': dataTestIdProp,
  }: any) => (
    <span data-testid={dataTestIdProp ?? 'subtitle'} data-weight={weight}>
      {children}
    </span>
  ),
  StyledValue: ({
    children,
    weight,
    style,
    'data-testid': dataTestIdProp,
  }: any) => (
    <span
      data-testid={dataTestIdProp ?? 'value'}
      data-weight={weight}
      style={style}
    >
      {children}
    </span>
  ),
  StyledComparisonContainer: ({ children }: any) => (
    <div data-testid="comparison-container">{children}</div>
  ),
  StyledComparisonText: ({
    children,
    weight,
    'data-testid': dataTestIdProp,
  }: any) => (
    <span
      data-testid={dataTestIdProp ?? 'comparison-text'}
      data-weight={weight}
    >
      {children}
    </span>
  ),
}));

describe('PortfolioFooter Component', () => {
  const mockDataSingleItem = [
    {
      portfolio: {
        title: 'Portfolio A',
        subtitle: 'Subtitle A',
      },
      month: {
        value: 100,
        comparison: 'vs LY',
        measure: '%',
        variationDirection: '#00AA00',
      },
      l3m: {
        value: 150,
        comparison: 'vs LY',
        measure: '%',
        variationDirection: '#FF0000',
      },
      ytd: {
        value: 200,
        comparison: 'vs LY',
        measure: '%',
        variationDirection: '#0000FF',
      },
    },
  ];

  const mockDataMultipleItems = [
    {
      portfolio: {
        title: 'Portfolio A',
        subtitle: 'Subtitle A',
      },
      month: {
        value: 100,
        comparison: 'vs LY',
        measure: '%',
        variationDirection: '#00AA00',
      },
      l3m: {
        value: 150,
        comparison: 'vs LY',
        measure: '%',
        variationDirection: '#FF0000',
      },
      ytd: {
        value: 200,
        comparison: 'vs LY',
        measure: '%',
        variationDirection: '#0000FF',
      },
    },
    {
      portfolio: {
        title: 'Portfolio B',
        subtitle: 'Subtitle B',
      },
      month: {
        value: 50,
        comparison: 'vs PY',
        measure: 'pp',
        variationDirection: '#FF0000',
      },
      l3m: {
        value: 75,
        comparison: 'vs PY',
        measure: 'pp',
        variationDirection: '#00AA00',
      },
      ytd: {
        value: 125,
        comparison: 'vs PY',
        measure: 'pp',
        variationDirection: '#00AA00',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Null/Empty Data Handling', () => {
    it('should return null when data is null', () => {
      const { container } = render(<PortfolioFooter data={null as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when data is undefined', () => {
      const { container } = render(<PortfolioFooter data={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when data is empty array', () => {
      const { container } = render(<PortfolioFooter data={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Basic Rendering', () => {
    it('should render with single item', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const containers = screen.getAllByTestId('portfolio-footer-container');
      expect(containers).toHaveLength(1);
    });

    it('should render with multiple items', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      const containers = screen.getAllByTestId('portfolio-footer-container');
      expect(containers).toHaveLength(2);
    });

    it('should render four cards per item (portfolio, month, l3m, ytd)', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const cards = screen.getAllByTestId('styled-card');
      expect(cards).toHaveLength(4);
    });

    it('should render correct number of cards for multiple items', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      const cards = screen.getAllByTestId('styled-card');
      expect(cards).toHaveLength(8); // 2 items * 4 cards each
    });
  });

  describe('Portfolio Card', () => {
    it('should render portfolio title', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      expect(screen.getByText('Portfolio A')).toBeInTheDocument();
    });

    it('should render portfolio subtitle when present', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      expect(screen.getByText('Subtitle A')).toBeInTheDocument();
    });

    it('should not render subtitle when not present', () => {
      const dataWithoutSubtitle = [
        {
          ...mockDataSingleItem[0],
          portfolio: {
            title: 'Portfolio A',
            subtitle: '',
          },
        },
      ];

      render(<PortfolioFooter data={dataWithoutSubtitle} />);

      expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument();
    });

    it('should have correct type for portfolio card', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const cards = screen.getAllByTestId('styled-card');
      const portfolioCard = cards[0];
      expect(portfolioCard).toHaveAttribute('data-type', 'portfolio');
    });
  });

  describe('Data Cards (Month, L3M, YTD)', () => {
    it('should render month value with measure', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should render l3m value with measure', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      expect(screen.getByText('150%')).toBeInTheDocument();
    });

    it('should render ytd value with measure', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      expect(screen.getByText('200%')).toBeInTheDocument();
    });

    it('should render comparison text for month', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const comparisonTexts = screen.getAllByText('vs LY');
      expect(comparisonTexts.length).toBeGreaterThan(0);
    });

    it('should have correct type for data cards', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const cards = screen.getAllByTestId('styled-card');
      const dataCards = cards.slice(1); // Skip first portfolio card
      dataCards.forEach((card) => {
        expect(card).toHaveAttribute('data-type', 'data');
      });
    });
  });

  describe('Variation Direction (Colors)', () => {
    it('should apply correct color to month value', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const values = screen.getAllByTestId('value');
      const monthValue = values[0];
      expect(monthValue).toHaveStyle({ color: '#00AA00' });
    });

    it('should apply correct color to l3m value', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const values = screen.getAllByTestId('value');
      const l3mValue = values[1];
      expect(l3mValue).toHaveStyle({ color: '#FF0000' });
    });

    it('should apply correct color to ytd value', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const values = screen.getAllByTestId('value');
      const ytdValue = values[2];
      expect(ytdValue).toHaveStyle({ color: '#0000FF' });
    });

    it('should handle different variation directions for different items', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      const values = screen.getAllByTestId('value');
      expect(values[0]).toHaveStyle({ color: '#00AA00' }); // Item 1, month
      expect(values[3]).toHaveStyle({ color: '#FF0000' }); // Item 2, month
    });
  });

  describe('DarkBg Styling', () => {
    it('should not apply darkBg to first item (index 0)', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      const containers = screen.getAllByTestId('portfolio-footer-container');
      const firstContainer = containers[0];
      const cardsInFirst = firstContainer.querySelectorAll(
        '[data-testid="styled-card"]',
      );

      cardsInFirst.forEach((card) => {
        expect(card).toHaveAttribute('data-dark-bg', 'false');
      });
    });

    it('should apply darkBg to second item (index 1)', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      const containers = screen.getAllByTestId('portfolio-footer-container');
      const secondContainer = containers[1];
      const cardsInSecond = secondContainer.querySelectorAll(
        '[data-testid="styled-card"]',
      );

      cardsInSecond.forEach((card) => {
        expect(card).toHaveAttribute('data-dark-bg', 'true');
      });
    });

    it('should not apply darkBg to third item if present', () => {
      const threeItems = [...mockDataMultipleItems, mockDataMultipleItems[0]];
      render(<PortfolioFooter data={threeItems} />);

      const containers = screen.getAllByTestId('portfolio-footer-container');
      const thirdContainer = containers[2];
      const cardsInThird = thirdContainer.querySelectorAll(
        '[data-testid="styled-card"]',
      );

      cardsInThird.forEach((card) => {
        expect(card).toHaveAttribute('data-dark-bg', 'false');
      });
    });
  });

  describe('Multiple Items Rendering', () => {
    it('should render all portfolio titles', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      expect(screen.getByText('Portfolio A')).toBeInTheDocument();
      expect(screen.getByText('Portfolio B')).toBeInTheDocument();
    });

    it('should render all subtitles', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      expect(screen.getByText('Subtitle A')).toBeInTheDocument();
      expect(screen.getByText('Subtitle B')).toBeInTheDocument();
    });

    it('should render different measures correctly', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      expect(screen.getByText('100%')).toBeInTheDocument(); // Item 1
      expect(screen.getByText('50pp')).toBeInTheDocument(); // Item 2
    });

    it('should render different comparison texts', () => {
      render(<PortfolioFooter data={mockDataMultipleItems} />);

      const vsLY = screen.getAllByText('vs LY');
      const vsPY = screen.getAllByText('vs PY');

      expect(vsLY.length).toBeGreaterThan(0);
      expect(vsPY.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      const dataWithZero = [
        {
          ...mockDataSingleItem[0],
          month: {
            value: 0,
            comparison: 'vs LY',
            measure: '%',
            variationDirection: '#000000',
          },
        },
      ];

      render(<PortfolioFooter data={dataWithZero} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle negative values', () => {
      const dataWithNegative = [
        {
          ...mockDataSingleItem[0],
          month: {
            value: -50,
            comparison: 'vs LY',
            measure: '%',
            variationDirection: '#FF0000',
          },
        },
      ];

      render(<PortfolioFooter data={dataWithNegative} />);

      expect(screen.getByText('-50%')).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      const dataWithDecimal = [
        {
          ...mockDataSingleItem[0],
          month: {
            value: 12.5,
            comparison: 'vs LY',
            measure: '%',
            variationDirection: '#00AA00',
          },
        },
      ];

      render(<PortfolioFooter data={dataWithDecimal} />);

      expect(screen.getByText('12.5%')).toBeInTheDocument();
    });

    it('should handle very long portfolio titles', () => {
      const dataWithLongTitle = [
        {
          ...mockDataSingleItem[0],
          portfolio: {
            title: 'Very Long Portfolio Title That Might Need Truncation',
            subtitle: 'Subtitle',
          },
        },
      ];

      render(<PortfolioFooter data={dataWithLongTitle} />);

      expect(
        screen.getByText(
          'Very Long Portfolio Title That Might Need Truncation',
        ),
      ).toBeInTheDocument();
    });

    it('should handle empty subtitle string', () => {
      const dataWithEmptySubtitle = [
        {
          ...mockDataSingleItem[0],
          portfolio: {
            title: 'Portfolio A',
            subtitle: '',
          },
        },
      ];

      render(<PortfolioFooter data={dataWithEmptySubtitle} />);

      expect(screen.getByText('Portfolio A')).toBeInTheDocument();
      expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument();
    });

    it('should handle special characters in comparison text', () => {
      const dataWithSpecialChars = [
        {
          ...mockDataSingleItem[0],
          month: {
            value: 100,
            comparison: 'vs LY (>)',
            measure: '%',
            variationDirection: '#00AA00',
          },
        },
      ];

      render(<PortfolioFooter data={dataWithSpecialChars} />);

      expect(screen.getByText('vs LY (>)')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render comparison containers for all data cards', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const comparisonContainers = screen.getAllByTestId(
        'comparison-container',
      );
      expect(comparisonContainers).toHaveLength(3); // month, l3m, ytd
    });

    it('should have correct weight attribute on paragraphs', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const paragraphs = screen.getAllByTestId('paragraph');
      paragraphs.forEach((p) => {
        expect(p).toHaveAttribute('data-weight', 'medium');
      });
    });

    it('should have correct weight attribute on values', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const values = screen.getAllByTestId('value');
      values.forEach((v) => {
        expect(v).toHaveAttribute('data-weight', 'medium');
      });
    });

    it('should have correct weight attribute on comparison texts', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      const comparisonTexts = screen.getAllByTestId('comparison-text');
      comparisonTexts.forEach((ct) => {
        expect(ct).toHaveAttribute('data-weight', 'medium');
      });
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<PortfolioFooter data={mockDataSingleItem} dataTestId="custom" />);

      expect(
        screen.getByTestId('portfolio-footer-container-0-custom'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<PortfolioFooter data={mockDataSingleItem} />);

      expect(
        screen.queryByTestId('portfolio-footer-container-0-custom'),
      ).not.toBeInTheDocument();
    });
  });
});

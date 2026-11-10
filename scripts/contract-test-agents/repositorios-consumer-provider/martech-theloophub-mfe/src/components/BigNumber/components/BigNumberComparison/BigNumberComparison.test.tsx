import { render, screen } from '@testing-library/react';
import { BigNumberData } from 'components/BigNumber/types';

import { BigNumberComparison } from './BigNumberComparison';

jest.mock('components/BigNumber/BigNumber.styles', () => ({
  StyledComparison: ({ children, size, style }: any) => (
    <span data-testid="comparison" data-size={size} style={style}>
      {children}
    </span>
  ),
  StyledComparisonNumber: ({ children, size, style }: any) => (
    <span data-testid="comparison-number" data-size={size} style={style}>
      {children}
    </span>
  ),
}));

jest.mock('../BigNumberContent/BigNumberContent.styles', () => ({
  StyledBigNumberComparisonContainer: ({ children }: any) => (
    <div data-testid="comparison-container">{children}</div>
  ),
}));

const mockItemWithValue: BigNumberData = {
  comparison: {
    value: '+10%',
    label: 'vs last year',
  },
};

const mockItemWithNumber: BigNumberData = {
  comparison: {
    value: 'YoY',
    number: {
      value: '+5',
      measure: 'pts',
      color: '#00FF00',
    },
    label: 'Growth',
  },
};

const mockItemWithNumberNoColor: BigNumberData = {
  comparison: {
    value: 'MoM',
    number: {
      value: '-3',
      measure: '%',
    },
    label: 'Change',
  },
};

const mockItemEmpty: BigNumberData = {
  comparison: undefined,
};

const mockItemNoValue: BigNumberData = {
  comparison: {
    label: 'Some label',
  },
};

describe('BigNumberComparison', () => {
  describe('Basic Rendering', () => {
    it('should render comparison container when value is present', () => {
      render(<BigNumberComparison item={mockItemWithValue} />);

      expect(screen.getByTestId('comparison-container')).toBeInTheDocument();
    });

    it('should return null when comparison is undefined', () => {
      const { container } = render(
        <BigNumberComparison item={mockItemEmpty} />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('should return null when comparison value is undefined', () => {
      const { container } = render(
        <BigNumberComparison item={mockItemNoValue} />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Comparison Without Number', () => {
    it('should render label as comparison text', () => {
      render(<BigNumberComparison item={mockItemWithValue} />);

      expect(screen.getByText('vs last year')).toBeInTheDocument();
    });

    it('should render value', () => {
      render(<BigNumberComparison item={mockItemWithValue} />);

      expect(screen.getByText('+10%')).toBeInTheDocument();
    });

    it('should not render comparison number', () => {
      render(<BigNumberComparison item={mockItemWithValue} />);

      expect(screen.queryByTestId('comparison-number')).not.toBeInTheDocument();
    });
  });

  describe('Comparison With Number', () => {
    it('should render comparison number with value and measure', () => {
      render(<BigNumberComparison item={mockItemWithNumber} />);

      const comparisonNumber = screen.getByTestId('comparison-number');
      expect(comparisonNumber).toBeInTheDocument();
      expect(comparisonNumber).toHaveTextContent('+5');
      expect(comparisonNumber).toHaveTextContent('pts');
    });

    it('should apply custom color to comparison number', () => {
      render(<BigNumberComparison item={mockItemWithNumber} />);

      const comparisonNumber = screen.getByTestId('comparison-number');
      expect(comparisonNumber).toHaveStyle({ color: '#00FF00' });
    });

    it('should use default color when not specified', () => {
      render(<BigNumberComparison item={mockItemWithNumberNoColor} />);

      const comparisonNumber = screen.getByTestId('comparison-number');
      expect(comparisonNumber).toHaveStyle({ color: '#141414' });
    });

    it('should render label when number is present', () => {
      render(<BigNumberComparison item={mockItemWithNumber} />);

      expect(screen.getByText('Growth')).toBeInTheDocument();
    });

    it('should render value alongside number', () => {
      render(<BigNumberComparison item={mockItemWithNumber} />);

      expect(screen.getByText('YoY')).toBeInTheDocument();
    });
  });

  describe('Size Prop', () => {
    it('should pass small size to styled comparison', () => {
      render(<BigNumberComparison item={mockItemWithValue} size="small" />);

      const comparisons = screen.getAllByTestId('comparison');
      comparisons.forEach((comp) => {
        expect(comp).toHaveAttribute('data-size', 'small');
      });
    });

    it('should pass medium size to styled comparison', () => {
      render(<BigNumberComparison item={mockItemWithValue} size="medium" />);

      const comparisons = screen.getAllByTestId('comparison');
      comparisons.forEach((comp) => {
        expect(comp).toHaveAttribute('data-size', 'medium');
      });
    });

    it('should pass large size to styled comparison', () => {
      render(<BigNumberComparison item={mockItemWithValue} size="large" />);

      const comparisons = screen.getAllByTestId('comparison');
      comparisons.forEach((comp) => {
        expect(comp).toHaveAttribute('data-size', 'large');
      });
    });

    it('should pass size to comparison number', () => {
      render(<BigNumberComparison item={mockItemWithNumber} size="large" />);

      const comparisonNumber = screen.getByTestId('comparison-number');
      expect(comparisonNumber).toHaveAttribute('data-size', 'large');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as value', () => {
      const item: BigNumberData = {
        comparison: {
          value: '',
          label: 'Label',
        },
      };

      const { container } = render(<BigNumberComparison item={item} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should handle number value as 0', () => {
      const item: BigNumberData = {
        comparison: {
          value: 'YoY',
          number: {
            value: '0',
            measure: '%',
          },
        },
      };

      render(<BigNumberComparison item={item} />);

      const comparisonNumber = screen.getByTestId('comparison-number');
      expect(comparisonNumber).toBeInTheDocument();
      expect(comparisonNumber).toHaveTextContent('0');
    });

    it('should handle missing measure in number', () => {
      const item: BigNumberData = {
        comparison: {
          value: 'Change',
          number: {
            value: '+10',
          },
        },
      };

      render(<BigNumberComparison item={item} />);

      expect(screen.getByText('+10')).toBeInTheDocument();
    });

    it('should handle missing label', () => {
      const item: BigNumberData = {
        comparison: {
          value: '+15%',
        },
      };

      render(<BigNumberComparison item={item} />);

      expect(screen.getByText('+15%')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply fontWeight 400 to label comparison', () => {
      render(<BigNumberComparison item={mockItemWithValue} />);

      const comparisons = screen.getAllByTestId('comparison');
      const labelComparison = comparisons[0];
      expect(labelComparison).toHaveStyle({ fontWeight: '400' });
    });

    it('should apply fontWeight 500 to value comparison', () => {
      render(<BigNumberComparison item={mockItemWithValue} />);

      const comparisons = screen.getAllByTestId('comparison');
      const valueComparison = comparisons[1];
      expect(valueComparison).toHaveStyle({ fontWeight: '500' });
    });
  });
});

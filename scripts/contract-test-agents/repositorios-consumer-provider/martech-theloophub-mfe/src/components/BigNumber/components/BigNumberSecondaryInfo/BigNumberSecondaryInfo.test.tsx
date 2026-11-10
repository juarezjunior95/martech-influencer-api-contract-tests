import { render, screen } from '@testing-library/react';
import { BigNumberData } from 'components/BigNumber/types';

import { BigNumberSecondaryInfo } from './BigNumberSecondaryInfo';

jest.mock('components/BigNumber/BigNumber.styles', () => ({
  StyledMeasure: ({ children, size, style }: any) => (
    <span data-testid="measure" data-size={size} style={style}>
      {children}
    </span>
  ),
  StyledPeriodLabel: ({ children }: any) => (
    <span data-testid="period-label">{children}</span>
  ),
  StyledPeriodValue: ({ children }: any) => (
    <span data-testid="period-value">{children}</span>
  ),
  StyledSecondaryValue: ({ children, size }: any) => (
    <p data-testid="secondary-value" data-size={size}>
      {children}
    </p>
  ),
}));

jest.mock('../BigNumberContent/BigNumberContent.styles', () => ({
  StyledBigNumberSecondaryInfoContainer: ({ children }: any) => (
    <div data-testid="secondary-info-container">{children}</div>
  ),
  StyledBigNumberSecondaryInfoValue: ({ children }: any) => (
    <div data-testid="secondary-info-value">{children}</div>
  ),
}));

const mockItemWithSecondaryInfo: BigNumberData = {
  secondaryInfo: {
    value: '150',
    measure: 'units',
    label: 'Target',
  },
};

const mockItemWithPeriod: BigNumberData = {
  secondaryInfo: {
    value: '200',
    label: 'Total',
    period: {
      label: 'Period',
      value: 'Jan 2024',
    },
  },
};

const mockItemComplete: BigNumberData = {
  secondaryInfo: {
    value: '100',
    measure: '%',
    label: 'Achievement',
    period: {
      label: 'As of',
      value: 'Q4 2024',
    },
  },
};

const mockItemEmpty: BigNumberData = {
  secondaryInfo: undefined,
};

const mockItemMinimal: BigNumberData = {
  secondaryInfo: {
    value: '50',
  },
};

describe('BigNumberSecondaryInfo', () => {
  describe('Basic Rendering', () => {
    it('should render secondary info container when secondaryInfo is present', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      expect(
        screen.getByTestId('secondary-info-container'),
      ).toBeInTheDocument();
    });

    it('should return null when secondaryInfo is undefined', () => {
      const { container } = render(
        <BigNumberSecondaryInfo item={mockItemEmpty} />,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Value and Measure', () => {
    it('should render value', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      const secondaryValue = screen.getByTestId('secondary-value');
      expect(secondaryValue).toHaveTextContent('150');
    });

    it('should render measure', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      const secondaryValue = screen.getByTestId('secondary-value');
      expect(secondaryValue).toHaveTextContent('units');
    });

    it('should render value and measure together in secondary value', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      const secondaryValue = screen.getByTestId('secondary-value');
      expect(secondaryValue).toHaveTextContent('150');
      expect(secondaryValue).toHaveTextContent('units');
    });

    it('should handle missing measure', () => {
      render(<BigNumberSecondaryInfo item={mockItemMinimal} />);

      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  describe('Label', () => {
    it('should render label', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      expect(screen.getByText('Target')).toBeInTheDocument();
    });

    it('should apply correct color to label', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      const measure = screen.getByTestId('measure');
      expect(measure).toHaveStyle({ color: '#5C5C5C' });
    });

    it('should handle missing label', () => {
      render(<BigNumberSecondaryInfo item={mockItemMinimal} />);

      expect(screen.getByTestId('measure')).toBeInTheDocument();
    });
  });

  describe('Period', () => {
    it('should render period when present', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithPeriod} />);

      expect(screen.getByTestId('period-label')).toBeInTheDocument();
      expect(screen.getByTestId('period-value')).toBeInTheDocument();
    });

    it('should render period label', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithPeriod} />);

      expect(screen.getByText(/Period/)).toBeInTheDocument();
    });

    it('should render period value', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithPeriod} />);

      expect(screen.getByText('Jan 2024')).toBeInTheDocument();
    });

    it('should not render period when not present', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      expect(screen.queryByTestId('period-label')).not.toBeInTheDocument();
      expect(screen.queryByTestId('period-value')).not.toBeInTheDocument();
    });
  });

  describe('Size Prop', () => {
    it('should pass small size to secondary value', () => {
      render(
        <BigNumberSecondaryInfo
          item={mockItemWithSecondaryInfo}
          size="small"
        />,
      );

      const secondaryValue = screen.getByTestId('secondary-value');
      expect(secondaryValue).toHaveAttribute('data-size', 'small');
    });

    it('should pass medium size to secondary value', () => {
      render(
        <BigNumberSecondaryInfo
          item={mockItemWithSecondaryInfo}
          size="medium"
        />,
      );

      const secondaryValue = screen.getByTestId('secondary-value');
      expect(secondaryValue).toHaveAttribute('data-size', 'medium');
    });

    it('should pass large size to secondary value', () => {
      render(
        <BigNumberSecondaryInfo
          item={mockItemWithSecondaryInfo}
          size="large"
        />,
      );

      const secondaryValue = screen.getByTestId('secondary-value');
      expect(secondaryValue).toHaveAttribute('data-size', 'large');
    });

    it('should pass size to measure', () => {
      render(
        <BigNumberSecondaryInfo
          item={mockItemWithSecondaryInfo}
          size="large"
        />,
      );

      const measure = screen.getByTestId('measure');
      expect(measure).toHaveAttribute('data-size', 'large');
    });
  });

  describe('Complete Data', () => {
    it('should render all elements when data is complete', () => {
      render(<BigNumberSecondaryInfo item={mockItemComplete} />);

      expect(
        screen.getByTestId('secondary-info-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('secondary-info-value')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-value')).toBeInTheDocument();
      expect(screen.getByTestId('measure')).toBeInTheDocument();
      expect(screen.getByTestId('period-label')).toBeInTheDocument();
      expect(screen.getByTestId('period-value')).toBeInTheDocument();
    });

    it('should display all values correctly', () => {
      render(<BigNumberSecondaryInfo item={mockItemComplete} />);

      const secondaryValue = screen.getByTestId('secondary-value');
      expect(secondaryValue).toHaveTextContent('100');
      expect(secondaryValue).toHaveTextContent('%');
      expect(screen.getByText('Achievement')).toBeInTheDocument();
      expect(screen.getByText(/As of/)).toBeInTheDocument();
      expect(screen.getByText('Q4 2024')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as value', () => {
      const item: BigNumberData = {
        secondaryInfo: {
          value: '',
          label: 'Empty',
        },
      };

      render(<BigNumberSecondaryInfo item={item} />);

      expect(
        screen.getByTestId('secondary-info-container'),
      ).toBeInTheDocument();
    });

    it('should handle numeric string as value', () => {
      const item: BigNumberData = {
        secondaryInfo: {
          value: '12345',
        },
      };

      render(<BigNumberSecondaryInfo item={item} />);

      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('should handle special characters in period value', () => {
      const item: BigNumberData = {
        secondaryInfo: {
          value: '100',
          period: {
            label: 'Date',
            value: '01/01/2024 - 31/12/2024',
          },
        },
      };

      render(<BigNumberSecondaryInfo item={item} />);

      expect(screen.getByText('01/01/2024 - 31/12/2024')).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('should render secondary value container', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithSecondaryInfo} />);

      expect(screen.getByTestId('secondary-info-value')).toBeInTheDocument();
    });

    it('should render period in a separate div', () => {
      render(<BigNumberSecondaryInfo item={mockItemWithPeriod} />);

      const periodLabel = screen.getByTestId('period-label');
      const periodValue = screen.getByTestId('period-value');

      expect(periodLabel.parentElement).toBe(periodValue.parentElement);
    });
  });
});

import { render, screen } from '@testing-library/react';
import { BigNumberData } from 'components/BigNumber/types';

import { BigNumberAudienceTargeting } from './BigNumberAudienceTargeting';

jest.mock('../BigNumberContent/BigNumberContent.styles', () => ({
  StyledBigNumberComparisonContainer: ({ children }: any) => (
    <div data-testid="audience-container">{children}</div>
  ),
}));

jest.mock('./BigNumberAudienceTargeting.style', () => ({
  StyledAudienceLabel: ({ children }: any) => (
    <span data-testid="audience-label">{children}</span>
  ),
  StyledAudienceRow: ({ children }: any) => (
    <div data-testid="audience-row">{children}</div>
  ),
  StyledAudienceValue: ({ children }: any) => (
    <span data-testid="audience-value">{children}</span>
  ),
}));

jest.mock('./components', () => ({
  AudienceValue: ({ fieldKey, value }: any) => (
    <span data-testid={`audience-value-${fieldKey}`}>
      {Array.isArray(value) ? value.join(', ') : value}
    </span>
  ),
}));

jest.mock('./utils/constants', () => ({
  AUDIENCE_LABELS: {
    gender: 'Gender',
    age: 'Age Range',
    incomeBracket: 'Income Bracket',
  },
}));

const mockItemWithGender: BigNumberData = {
  audience: {
    gender: ['Male', 'Female'],
  },
};

const mockItemWithAge: BigNumberData = {
  audience: {
    age: ['18-24', '25-34', '35-44'],
  },
};

const mockItemWithIncome: BigNumberData = {
  audience: {
    incomeBracket: ['Low', 'Medium', 'High'],
  },
};

const mockItemComplete: BigNumberData = {
  audience: {
    gender: ['Male'],
    age: ['25-34'],
    incomeBracket: ['High'],
  },
};

const mockItemEmpty: BigNumberData = {
  audience: undefined,
};

const mockItemEmptyAudience: BigNumberData = {
  audience: {},
};

describe('BigNumberAudienceTargeting', () => {
  describe('Basic Rendering', () => {
    it('should render audience container when audience is present', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      expect(screen.getByTestId('audience-container')).toBeInTheDocument();
    });

    it('should return null when audience is undefined', () => {
      const { container } = render(
        <BigNumberAudienceTargeting item={mockItemEmpty} />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('should render empty container when audience object is empty', () => {
      render(<BigNumberAudienceTargeting item={mockItemEmptyAudience} />);

      const container = screen.getByTestId('audience-container');
      expect(container).toBeInTheDocument();
      expect(screen.queryByTestId('audience-row')).not.toBeInTheDocument();
    });
  });

  describe('Gender Field', () => {
    it('should render gender row', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      expect(screen.getByTestId('audience-row')).toBeInTheDocument();
    });

    it('should render gender label', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      expect(screen.getByText('Gender')).toBeInTheDocument();
    });

    it('should render gender values', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      expect(screen.getByText('Male, Female')).toBeInTheDocument();
    });

    it('should pass correct fieldKey to AudienceValue', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      expect(screen.getByTestId('audience-value-gender')).toBeInTheDocument();
    });
  });

  describe('Age Field', () => {
    it('should render age row', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithAge} />);

      expect(screen.getByTestId('audience-row')).toBeInTheDocument();
    });

    it('should render age label', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithAge} />);

      expect(screen.getByText('Age Range')).toBeInTheDocument();
    });

    it('should render age values', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithAge} />);

      expect(screen.getByText('18-24, 25-34, 35-44')).toBeInTheDocument();
    });

    it('should pass correct fieldKey to AudienceValue', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithAge} />);

      expect(screen.getByTestId('audience-value-age')).toBeInTheDocument();
    });
  });

  describe('Income Bracket Field', () => {
    it('should render income bracket row', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithIncome} />);

      expect(screen.getByTestId('audience-row')).toBeInTheDocument();
    });

    it('should render income bracket label', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithIncome} />);

      expect(screen.getByText('Income Bracket')).toBeInTheDocument();
    });

    it('should render income bracket values', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithIncome} />);

      expect(screen.getByText('Low, Medium, High')).toBeInTheDocument();
    });

    it('should pass correct fieldKey to AudienceValue', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithIncome} />);

      expect(
        screen.getByTestId('audience-value-incomeBracket'),
      ).toBeInTheDocument();
    });
  });

  describe('Complete Audience Data', () => {
    it('should render all audience rows', () => {
      render(<BigNumberAudienceTargeting item={mockItemComplete} />);

      const rows = screen.getAllByTestId('audience-row');
      expect(rows).toHaveLength(3);
    });

    it('should render all labels', () => {
      render(<BigNumberAudienceTargeting item={mockItemComplete} />);

      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Age Range')).toBeInTheDocument();
      expect(screen.getByText('Income Bracket')).toBeInTheDocument();
    });

    it('should render all values', () => {
      render(<BigNumberAudienceTargeting item={mockItemComplete} />);

      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('25-34')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('should render audience label inside row', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      const label = screen.getByTestId('audience-label');
      const row = screen.getByTestId('audience-row');

      expect(row).toContainElement(label);
    });

    it('should render audience value inside row', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      const value = screen.getByTestId('audience-value');
      const row = screen.getByTestId('audience-row');

      expect(row).toContainElement(value);
    });
  });

  describe('Unknown Keys', () => {
    it('should use key as label when not in AUDIENCE_LABELS', () => {
      const item: BigNumberData = {
        audience: {
          customField: ['Value1', 'Value2'],
        } as any,
      };

      render(<BigNumberAudienceTargeting item={item} />);

      expect(screen.getByText('customField')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single value array', () => {
      const item: BigNumberData = {
        audience: {
          gender: ['Male'],
        },
      };

      render(<BigNumberAudienceTargeting item={item} />);

      expect(screen.getByText('Male')).toBeInTheDocument();
    });

    it('should handle empty array', () => {
      const item: BigNumberData = {
        audience: {
          gender: [],
        },
      };

      render(<BigNumberAudienceTargeting item={item} />);

      expect(screen.getByTestId('audience-value-gender')).toBeInTheDocument();
    });

    it('should render multiple fields in order', () => {
      render(<BigNumberAudienceTargeting item={mockItemComplete} />);

      const labels = screen.getAllByTestId('audience-label');
      expect(labels).toHaveLength(3);
    });
  });

  describe('Data Integrity', () => {
    it('should pass values array to AudienceValue', () => {
      render(<BigNumberAudienceTargeting item={mockItemWithGender} />);

      const audienceValue = screen.getByTestId('audience-value-gender');
      expect(audienceValue).toHaveTextContent('Male, Female');
    });

    it('should pass fieldKey to AudienceValue for each field', () => {
      render(<BigNumberAudienceTargeting item={mockItemComplete} />);

      expect(screen.getByTestId('audience-value-gender')).toBeInTheDocument();
      expect(screen.getByTestId('audience-value-age')).toBeInTheDocument();
      expect(
        screen.getByTestId('audience-value-incomeBracket'),
      ).toBeInTheDocument();
    });
  });
});

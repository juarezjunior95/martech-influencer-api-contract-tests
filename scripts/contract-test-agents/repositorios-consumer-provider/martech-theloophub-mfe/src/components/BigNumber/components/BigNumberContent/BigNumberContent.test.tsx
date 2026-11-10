import { render, screen } from '@testing-library/react';
import { BigNumberData } from 'components/BigNumber/types';

import { BigNumberContent } from './BigNumberContent';

jest.mock('@hexa-ui/components2', () => ({
  Tooltip: ({ children, content }: any) => (
    <div data-testid="tooltip" data-content={content}>
      {children}
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useTruncationDetection: (text: string) => ({
    ref: { current: null },
    displayText: text,
    isTruncated: false,
  }),
}));

jest.mock('components/BigNumber/BigNumber.styles', () => {
  const { forwardRef } = jest.requireActual<typeof import('react')>('react');
  const StyledBigNumberWithSuffix = forwardRef(
    ({ children, style }: any, ref: any) => (
      <div data-testid="big-number-with-suffix" ref={ref} style={style}>
        {children}
      </div>
    ),
  );
  StyledBigNumberWithSuffix.displayName = 'StyledBigNumberWithSuffix';

  return {
    StyledBigNumber: ({ children, size, style }: any) => (
      <span data-testid="styled-big-number" data-size={size} style={style}>
        {children}
      </span>
    ),
    StyledBigNumberWithSuffix,
    StyledBigNumberSuffix: ({ children, size, style }: any) => (
      <span data-testid="big-number-suffix" data-size={size} style={style}>
        {children}
      </span>
    ),
    StyledDivider: () => <div data-testid="divider" />,
  };
});

jest.mock('./BigNumberContent.styles', () => ({
  StyledBigNumberItemContainer: ({ children, orientation }: any) => (
    <div data-testid="item-container" data-orientation={orientation}>
      {children}
    </div>
  ),
  StyledBigNumberItemContent: ({ children, spacing, alignment }: any) => (
    <div
      data-testid="item-content"
      data-spacing={spacing}
      data-alignment={alignment}
    >
      {children}
    </div>
  ),
  StyledBigNumberMainContent: ({ children }: any) => (
    <div data-testid="main-content">{children}</div>
  ),
}));

jest.mock('../', () => ({
  BigNumberAudienceTargeting: ({ item }: any) => (
    <div data-testid="audience-targeting">
      {item.audience?.gender?.join(', ')}
    </div>
  ),
  BigNumberComparison: ({ item, size }: any) => (
    <div data-testid="comparison" data-size={size}>
      {item.comparison?.value}
    </div>
  ),
  BigNumberSecondaryInfo: ({ item, size }: any) => (
    <div data-testid="secondary-info" data-size={size}>
      {item.secondaryInfo?.value}
    </div>
  ),
}));

const mockDataBasic: BigNumberData[] = [
  {
    bigNumber: {
      value: '100',
      measure: '%',
      color: '#FF0000',
    },
  },
];

const mockDataWithComparison: BigNumberData[] = [
  {
    bigNumber: { value: '50', measure: 'pts' },
    comparison: {
      value: '+10%',
      label: 'vs last year',
    },
  },
];

const mockDataWithSecondaryInfo: BigNumberData[] = [
  {
    bigNumber: { value: '200' },
    secondaryInfo: {
      value: '150',
      measure: 'units',
      label: 'Target',
    },
  },
];

const mockDataWithAudience: BigNumberData[] = [
  {
    bigNumber: { value: '75' },
    audience: {
      gender: ['Male', 'Female'],
      age: ['18-24', '25-34'],
    },
  },
];

const mockDataMultiple: BigNumberData[] = [
  { bigNumber: { value: '10' } },
  { bigNumber: { value: '20' } },
  { bigNumber: { value: '30' } },
];

const mockDataComplete: BigNumberData[] = [
  {
    bigNumber: { value: '100', measure: '%', color: '#00FF00' },
    comparison: { value: '+5%', label: 'YoY' },
    secondaryInfo: { value: '80', label: 'Previous' },
    audience: { gender: ['Male'] },
  },
];

describe('BigNumberContent', () => {
  describe('Basic Rendering', () => {
    it('should render the item container', () => {
      render(<BigNumberContent data={mockDataBasic} />);

      expect(screen.getByTestId('item-container')).toBeInTheDocument();
    });

    it('should render big number value with measure', () => {
      render(<BigNumberContent data={mockDataBasic} />);

      const bigNumber = screen.getByTestId('styled-big-number');
      expect(bigNumber).toHaveTextContent('100');
      expect(bigNumber).toHaveTextContent('%');
    });

    it('should apply color to big number', () => {
      render(<BigNumberContent data={mockDataBasic} />);

      const bigNumber = screen.getByTestId('styled-big-number');
      expect(bigNumber).toHaveStyle({ color: '#FF0000' });
    });

    it('should use default color when not specified', () => {
      render(<BigNumberContent data={[{ bigNumber: { value: '50' } }]} />);

      const bigNumber = screen.getByTestId('styled-big-number');
      expect(bigNumber).toHaveStyle({ color: '#141414' });
    });
  });

  describe('Size Prop', () => {
    it('should pass size to styled big number', () => {
      render(<BigNumberContent data={mockDataBasic} size="large" />);

      const bigNumber = screen.getByTestId('styled-big-number');
      expect(bigNumber).toHaveAttribute('data-size', 'large');
    });

    it('should pass size to comparison', () => {
      render(<BigNumberContent data={mockDataWithComparison} size="small" />);

      const comparison = screen.getByTestId('comparison');
      expect(comparison).toHaveAttribute('data-size', 'small');
    });

    it('should pass size to secondary info', () => {
      render(
        <BigNumberContent data={mockDataWithSecondaryInfo} size="medium" />,
      );

      const secondaryInfo = screen.getByTestId('secondary-info');
      expect(secondaryInfo).toHaveAttribute('data-size', 'medium');
    });
  });

  describe('Spacing Prop', () => {
    it('should pass spacing to item content', () => {
      render(<BigNumberContent data={mockDataBasic} spacing="cozy" />);

      const itemContent = screen.getByTestId('item-content');
      expect(itemContent).toHaveAttribute('data-spacing', 'cozy');
    });

    it('should pass loose spacing', () => {
      render(<BigNumberContent data={mockDataBasic} spacing="loose" />);

      const itemContent = screen.getByTestId('item-content');
      expect(itemContent).toHaveAttribute('data-spacing', 'loose');
    });
  });

  describe('Alignment Prop', () => {
    it('should pass alignment to item content', () => {
      render(<BigNumberContent data={mockDataBasic} alignment="center" />);

      const itemContent = screen.getByTestId('item-content');
      expect(itemContent).toHaveAttribute('data-alignment', 'center');
    });

    it('should pass left alignment', () => {
      render(<BigNumberContent data={mockDataBasic} alignment="left" />);

      const itemContent = screen.getByTestId('item-content');
      expect(itemContent).toHaveAttribute('data-alignment', 'left');
    });
  });

  describe('Orientation Prop', () => {
    it('should pass orientation to item container', () => {
      render(
        <BigNumberContent data={mockDataBasic} orientation="horizontal" />,
      );

      const container = screen.getByTestId('item-container');
      expect(container).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should pass vertical orientation', () => {
      render(<BigNumberContent data={mockDataBasic} orientation="vertical" />);

      const container = screen.getByTestId('item-container');
      expect(container).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should render divider between items when orientation is not horizontal', () => {
      render(
        <BigNumberContent data={mockDataMultiple} orientation="vertical" />,
      );

      const dividers = screen.getAllByTestId('divider');
      expect(dividers).toHaveLength(2);
    });

    it('should not render divider when orientation is horizontal', () => {
      render(
        <BigNumberContent data={mockDataMultiple} orientation="horizontal" />,
      );

      expect(screen.queryByTestId('divider')).not.toBeInTheDocument();
    });
  });

  describe('Comparison Component', () => {
    it('should render comparison when present', () => {
      render(<BigNumberContent data={mockDataWithComparison} />);

      expect(screen.getByTestId('comparison')).toBeInTheDocument();
      expect(screen.getByText('+10%')).toBeInTheDocument();
    });

    it('should always render comparison component', () => {
      render(<BigNumberContent data={mockDataBasic} />);

      expect(screen.getByTestId('comparison')).toBeInTheDocument();
    });
  });

  describe('Secondary Info Component', () => {
    it('should render secondary info when present', () => {
      render(<BigNumberContent data={mockDataWithSecondaryInfo} />);

      expect(screen.getByTestId('secondary-info')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('should always render secondary info component', () => {
      render(<BigNumberContent data={mockDataBasic} />);

      expect(screen.getByTestId('secondary-info')).toBeInTheDocument();
    });
  });

  describe('Audience Targeting Component', () => {
    it('should render audience targeting when audience is present', () => {
      render(<BigNumberContent data={mockDataWithAudience} />);

      expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
      expect(screen.getByText('Male, Female')).toBeInTheDocument();
    });

    it('should not render audience targeting when audience is not present', () => {
      render(<BigNumberContent data={mockDataBasic} />);

      expect(
        screen.queryByTestId('audience-targeting'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Multiple Items', () => {
    it('should render multiple data items', () => {
      render(<BigNumberContent data={mockDataMultiple} />);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('should render correct number of item contents', () => {
      render(<BigNumberContent data={mockDataMultiple} />);

      const itemContents = screen.getAllByTestId('item-content');
      expect(itemContents).toHaveLength(3);
    });

    it('should render dividers between items (n-1 dividers)', () => {
      render(<BigNumberContent data={mockDataMultiple} />);

      const dividers = screen.getAllByTestId('divider');
      expect(dividers).toHaveLength(2);
    });
  });

  describe('Complete Data', () => {
    it('should render all components when data is complete', () => {
      render(<BigNumberContent data={mockDataComplete} />);

      expect(screen.getByTestId('styled-big-number')).toBeInTheDocument();
      expect(screen.getByTestId('comparison')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-info')).toBeInTheDocument();
      expect(screen.getByTestId('audience-targeting')).toBeInTheDocument();
    });

    it('should display all values correctly', () => {
      render(<BigNumberContent data={mockDataComplete} />);

      const bigNumber = screen.getByTestId('styled-big-number');
      expect(bigNumber).toHaveTextContent('100');
      expect(bigNumber).toHaveTextContent('%');

      expect(screen.getByText('+5%')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
    });
  });

  describe('Truncation Mode', () => {
    it('should render value and measure separately when enableTruncation is true', () => {
      render(<BigNumberContent data={mockDataBasic} enableTruncation />);

      const bigNumber = screen.getByTestId('styled-big-number');
      expect(bigNumber).toHaveTextContent('100');

      const suffix = screen.getByTestId('big-number-suffix');
      expect(suffix).toHaveTextContent('%');
    });

    it('should render with suffix wrapper when enableTruncation is true', () => {
      render(<BigNumberContent data={mockDataBasic} enableTruncation />);

      expect(screen.getByTestId('big-number-with-suffix')).toBeInTheDocument();
    });

    it('should not render suffix wrapper when enableTruncation is false', () => {
      render(<BigNumberContent data={mockDataBasic} />);

      expect(
        screen.queryByTestId('big-number-with-suffix'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Empty Value Handling', () => {
    it('should not render big number when value is not present', () => {
      render(<BigNumberContent data={[{ bigNumber: undefined }]} />);

      expect(screen.queryByTestId('styled-big-number')).not.toBeInTheDocument();
    });

    it('should handle empty data array', () => {
      render(<BigNumberContent data={[]} />);

      const container = screen.getByTestId('item-container');
      expect(container).toBeInTheDocument();
      expect(screen.queryByTestId('item-content')).not.toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('should handle all props together', () => {
      render(
        <BigNumberContent
          data={mockDataComplete}
          size="large"
          spacing="cozy"
          alignment="center"
          orientation="vertical"
        />,
      );

      const container = screen.getByTestId('item-container');
      expect(container).toHaveAttribute('data-orientation', 'vertical');

      const itemContent = screen.getByTestId('item-content');
      expect(itemContent).toHaveAttribute('data-spacing', 'cozy');
      expect(itemContent).toHaveAttribute('data-alignment', 'center');

      const bigNumber = screen.getByTestId('styled-big-number');
      expect(bigNumber).toHaveAttribute('data-size', 'large');
    });
  });
});

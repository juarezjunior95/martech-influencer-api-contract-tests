import { fireEvent, render, screen } from '@testing-library/react';

import { BigNumber } from './BigNumber';
import { BigNumberData } from './types';

jest.mock('./BigNumber.styles', () => ({
  StyledBigNumberCard: ({
    children,
    className,
    fullWidth,
    clickeable,
  }: any) => (
    <div
      data-testid="big-number-card"
      data-clickeable={clickeable}
      data-full-width={fullWidth}
      className={className}
    >
      {children}
    </div>
  ),
  StyledBigNumberContainer: ({
    children,
    className,
    orientation,
    clickeable,
    spacing,
    onClick,
  }: any) => (
    <div
      data-testid="big-number-container"
      data-orientation={orientation}
      data-clickeable={clickeable}
      data-spacing={spacing}
      className={className}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  ),
  StyledBigNumberContentHeader: ({ children, orientation }: any) => (
    <div
      data-testid="big-number-content-wrapper"
      data-orientation={orientation}
    >
      {children}
    </div>
  ),
  StyledBigNumberContentBody: ({ children, orientation }: any) => (
    <div
      data-testid="big-number-content-wrapper"
      data-orientation={orientation}
    >
      {children}
    </div>
  ),
  StyledDivider: () => <div data-testid="divider" />,
}));

jest.mock('./components', () => ({
  BigNumberContent: ({ data, size, spacing, alignment, orientation }: any) => (
    <div
      data-testid="big-number-content"
      data-size={size}
      data-spacing={spacing}
      data-alignment={alignment}
      data-orientation={orientation}
    >
      {data.map((item: any, index: number) => (
        <span key={index}>{item.bigNumber?.value}</span>
      ))}
    </div>
  ),
  BigNumberNoData: ({
    orientation,
    text,
    emptyStateIcon,
    emptyStateConfig,
  }: any) => (
    <div
      data-testid="big-number-no-data"
      data-orientation={orientation}
      data-color={emptyStateConfig?.color}
      data-has-icon={emptyStateIcon ? 'true' : 'false'}
    >
      {emptyStateIcon && (
        <span data-testid="custom-empty-icon">{emptyStateIcon}</span>
      )}
      {text}
    </div>
  ),
}));

const mockData: BigNumberData[] = [
  {
    bigNumber: {
      value: '100',
      measure: '%',
      color: '#000',
    },
  },
];

const mockDataMultiple: BigNumberData[] = [
  { bigNumber: { value: '50', measure: '%' } },
  { bigNumber: { value: '75', measure: 'pts' } },
];

describe('BigNumber', () => {
  describe('Basic Rendering', () => {
    it('should render the BigNumber component without card by default', () => {
      render(<BigNumber data={mockData} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toBeInTheDocument();
      expect(screen.queryByTestId('big-number-card')).not.toBeInTheDocument();
    });

    it('should render the BigNumber component with card when asCard is true', () => {
      render(<BigNumber data={mockData} asCard />);

      const card = screen.getByTestId('big-number-card');
      expect(card).toBeInTheDocument();
    });

    it('should render header when provided', () => {
      render(
        <BigNumber
          data={mockData}
          header={<span data-testid="custom-header">Header</span>}
        />,
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('should not render header when not provided', () => {
      render(<BigNumber data={mockData} />);

      const wrappers = screen.getAllByTestId('big-number-content-wrapper');
      expect(wrappers).toHaveLength(1);
    });
  });

  describe('Orientation Prop', () => {
    it('should use vertical orientation by default', () => {
      render(<BigNumber data={mockData} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should use horizontal orientation when specified', () => {
      render(<BigNumber data={mockData} orientation="horizontal" />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should render divider when orientation is horizontal', () => {
      render(
        <BigNumber
          data={mockData}
          orientation="horizontal"
          header={<span>Header</span>}
        />,
      );

      expect(screen.getByTestId('divider')).toBeInTheDocument();
    });

    it('should not render divider when orientation is vertical', () => {
      render(
        <BigNumber
          data={mockData}
          orientation="vertical"
          header={<span>Header</span>}
        />,
      );

      expect(screen.queryByTestId('divider')).not.toBeInTheDocument();
    });
  });

  describe('Size Prop', () => {
    it('should use medium size by default', () => {
      render(<BigNumber data={mockData} />);

      const content = screen.getByTestId('big-number-content');
      expect(content).toHaveAttribute('data-size', 'medium');
    });

    it('should pass small size to content', () => {
      render(<BigNumber data={mockData} size="small" />);

      const content = screen.getByTestId('big-number-content');
      expect(content).toHaveAttribute('data-size', 'small');
    });

    it('should pass large size to content', () => {
      render(<BigNumber data={mockData} size="large" />);

      const content = screen.getByTestId('big-number-content');
      expect(content).toHaveAttribute('data-size', 'large');
    });
  });

  describe('Spacing Prop', () => {
    it('should use loose spacing by default', () => {
      render(<BigNumber data={mockData} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveAttribute('data-spacing', 'loose');
    });

    it('should pass cozy spacing', () => {
      render(<BigNumber data={mockData} spacing="cozy" />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveAttribute('data-spacing', 'cozy');
    });
  });

  describe('Alignment Prop', () => {
    it('should use left alignment by default', () => {
      render(<BigNumber data={mockData} />);

      const content = screen.getByTestId('big-number-content');
      expect(content).toHaveAttribute('data-alignment', 'left');
    });

    it('should pass center alignment', () => {
      render(<BigNumber data={mockData} alignment="center" />);

      const content = screen.getByTestId('big-number-content');
      expect(content).toHaveAttribute('data-alignment', 'center');
    });
  });

  describe('Click Behavior', () => {
    it('should handle onClick when provided and has data', () => {
      const handleClick = jest.fn();
      render(<BigNumber data={mockData} onClick={handleClick} />);

      const container = screen.getByTestId('big-number-container');
      fireEvent.click(container);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should set clickeable attribute when onClick is provided and has data', () => {
      const handleClick = jest.fn();
      render(<BigNumber data={mockData} onClick={handleClick} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveAttribute('data-clickeable', 'true');
    });

    it('should set clickeable to false when onClick is not provided', () => {
      render(<BigNumber data={mockData} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveAttribute('data-clickeable', 'false');
    });

    it('should set clickeable to false when has not data', () => {
      const handleClick = jest.fn();
      render(<BigNumber data={[]} onClick={handleClick} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveAttribute('data-clickeable', 'false');
    });
  });

  describe('Selected State', () => {
    it('should add selected class when isSelected is true', () => {
      render(<BigNumber data={mockData} isSelected />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveClass('selected');
    });

    it('should not add selected class when isSelected is false', () => {
      render(<BigNumber data={mockData} isSelected={false} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).not.toHaveClass('selected');
    });

    it('should add selected class to card when asCard and isSelected are true', () => {
      render(<BigNumber data={mockData} asCard isSelected />);

      const card = screen.getByTestId('big-number-card');
      expect(card).toHaveClass('selected');
    });
  });

  describe('FullWidth Prop', () => {
    it('should pass fullWidth false by default', () => {
      render(<BigNumber data={mockData} asCard />);

      const card = screen.getByTestId('big-number-card');
      expect(card).toHaveAttribute('data-full-width', 'false');
    });

    it('should pass fullWidth true when specified', () => {
      render(<BigNumber data={mockData} asCard fullWidth />);

      const card = screen.getByTestId('big-number-card');
      expect(card).toHaveAttribute('data-full-width', 'true');
    });
  });

  describe('Empty State', () => {
    it('should render BigNumberNoData when data array is empty', () => {
      render(<BigNumber data={[]} />);

      expect(screen.getByTestId('big-number-no-data')).toBeInTheDocument();
    });

    it('should pass emptyStateMessage to BigNumberNoData', () => {
      render(<BigNumber data={[]} emptyStateMessage="No data available" />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should pass emptyStateConfig to BigNumberNoData', () => {
      render(
        <BigNumber
          data={[]}
          emptyStateConfig={{ color: '#FF0000', justifyContent: 'center' }}
        />,
      );

      const noData = screen.getByTestId('big-number-no-data');
      expect(noData).toHaveAttribute('data-color', '#FF0000');
    });

    it('should not render BigNumberNoData when data has items', () => {
      render(<BigNumber data={mockData} />);

      expect(
        screen.queryByTestId('big-number-no-data'),
      ).not.toBeInTheDocument();
    });

    it('should pass emptyStateIcon to BigNumberNoData', () => {
      const CustomIcon = () => <span>Custom Icon</span>;
      render(<BigNumber data={[]} emptyStateIcon={<CustomIcon />} />);

      const noData = screen.getByTestId('big-number-no-data');
      expect(noData).toHaveAttribute('data-has-icon', 'true');
      expect(screen.getByTestId('custom-empty-icon')).toBeInTheDocument();
    });

    it('should not pass emptyStateIcon when not provided', () => {
      render(<BigNumber data={[]} />);

      const noData = screen.getByTestId('big-number-no-data');
      expect(noData).toHaveAttribute('data-has-icon', 'false');
      expect(screen.queryByTestId('custom-empty-icon')).not.toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('should render BigNumberContent with data', () => {
      render(<BigNumber data={mockData} />);

      expect(screen.getByTestId('big-number-content')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should render multiple data items', () => {
      render(<BigNumber data={mockDataMultiple} />);

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  describe('Container Classes', () => {
    it('should include bigNumberContainer class', () => {
      render(<BigNumber data={mockData} />);

      const container = screen.getByTestId('big-number-container');
      expect(container).toHaveClass('bigNumberContainer');
    });

    it('should include bigNumberCard class when asCard is true', () => {
      render(<BigNumber data={mockData} asCard />);

      const card = screen.getByTestId('big-number-card');
      expect(card).toHaveClass('bigNumberCard');
    });
  });

  describe('Combined Props', () => {
    it('should render with all props combined', () => {
      const handleClick = jest.fn();

      render(
        <BigNumber
          data={mockData}
          asCard
          header={<span data-testid="header">Header</span>}
          orientation="horizontal"
          size="large"
          spacing="cozy"
          alignment="center"
          onClick={handleClick}
          isSelected
          fullWidth
        />,
      );

      expect(screen.getByTestId('big-number-card')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('divider')).toBeInTheDocument();

      const card = screen.getByTestId('big-number-card');
      expect(card).toHaveClass('selected');
      expect(card).toHaveAttribute('data-full-width', 'true');

      const content = screen.getByTestId('big-number-content');
      expect(content).toHaveAttribute('data-size', 'large');
      expect(content).toHaveAttribute('data-spacing', 'cozy');
      expect(content).toHaveAttribute('data-alignment', 'center');
    });
  });
});

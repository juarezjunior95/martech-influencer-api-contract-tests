import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BigNumberData } from '../../types';
import {
  BigNumberWithContent,
  type BigNumberWithContentProps,
} from './BigNumberWithContent';

jest.mock('./BigNumberWithContent.styles', () => ({
  StyledBigNumberWithContentCard: ({
    children,
    className,
    fullWidth,
    clickeable,
    onClick,
  }: any) => (
    <div
      data-testid={'big-number-with-content'}
      data-clickeable={clickeable}
      data-full-width={fullWidth}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
    >
      {children}
    </div>
  ),
  StyledHeader: ({ children }: any) => (
    <div data-testid={'big-number-with-content-header'}>{children}</div>
  ),
  StyledBody: ({ children, fullWidth }: any) => (
    <div
      data-testid={'big-number-with-content-body'}
      data-full-width={fullWidth}
    >
      {children}
    </div>
  ),
  StyledBigNumberSection: ({ children, fullWidth }: any) => (
    <div
      data-testid={'big-number-with-content-bignumber'}
      data-full-width={fullWidth}
    >
      {children}
    </div>
  ),
  StyledContentSection: ({ children, fullWidth }: any) => (
    <div
      data-testid={'big-number-with-content-content'}
      data-full-width={fullWidth}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../BigNumber', () => ({
  BigNumber: ({ data, orientation, size, emptyStateMessage }: any) => (
    <div
      data-testid="big-number"
      data-orientation={orientation}
      data-size={size}
    >
      {data.length > 0 ? (
        data.map((item: any, index: number) => (
          <span key={index}>{item.bigNumber?.value}</span>
        ))
      ) : (
        <span>{emptyStateMessage}</span>
      )}
    </div>
  ),
}));

const mockData: BigNumberData[] = [
  {
    bigNumber: {
      value: '10.1',
      measure: '%',
      color: '#007800',
    },
    comparison: {
      label: 'vs',
      value: "Jul'25",
    },
  },
];

const mockDataMultiple: BigNumberData[] = [
  {
    bigNumber: { value: '50', measure: '%' },
    comparison: { label: 'vs', value: "Jul'25" },
  },
  {
    bigNumber: { value: '75', measure: 'pts' },
    comparison: { label: 'vs', value: "Aug'25" },
  },
];

const mockHeader = <div data-testid="mock-header">Market Share</div>;
const mockContent = <div data-testid="mock-content">Content Content</div>;

const renderWithData = (
  data: BigNumberData[],
  props: Partial<BigNumberWithContentProps> = {},
  children?: ReactNode,
) =>
  render(
    <BigNumberWithContent data={data} {...props}>
      {children}
    </BigNumberWithContent>,
  );

const renderComponent = (
  props: Partial<BigNumberWithContentProps> = {},
  children?: ReactNode,
) => renderWithData(mockData, props, children);

describe('BigNumberWithContent', () => {
  describe('Basic Rendering', () => {
    it('should render the BigNumberWithContent component', () => {
      renderComponent();

      expect(screen.getByTestId('big-number-with-content')).toBeInTheDocument();
      expect(
        screen.getByTestId('big-number-with-content-bignumber'),
      ).toBeInTheDocument();
    });

    it('should render with header when provided', () => {
      renderComponent({ header: mockHeader });

      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(
        screen.getByTestId('big-number-with-content-header'),
      ).toBeInTheDocument();
    });

    it('should not render header section when header is not provided', () => {
      renderComponent();

      expect(
        screen.queryByTestId('big-number-with-content-header'),
      ).not.toBeInTheDocument();
    });

    it('should render body with BigNumber section', () => {
      renderComponent();

      expect(
        screen.getByTestId('big-number-with-content-body'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('big-number-with-content-bignumber'),
      ).toBeInTheDocument();
    });
  });

  describe('Children (Content) Rendering', () => {
    it('should render content section when children is provided', () => {
      renderComponent({}, mockContent);

      expect(
        screen.getByTestId('big-number-with-content-content'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('mock-content')).toBeInTheDocument();
    });

    it('should not render content section when children is not provided', () => {
      renderComponent();

      expect(
        screen.queryByTestId('big-number-with-content-content'),
      ).not.toBeInTheDocument();
    });

    it('should render both BigNumber and Content sections together', () => {
      renderComponent({ header: mockHeader }, mockContent);

      expect(
        screen.getByTestId('big-number-with-content-bignumber'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('big-number-with-content-content'),
      ).toBeInTheDocument();
      expect(screen.getByText('10.1')).toBeInTheDocument();
      expect(screen.getByTestId('mock-content')).toBeInTheDocument();
    });
  });

  describe('Click Behavior', () => {
    it('should handle onClick when provided and has data', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderComponent({ onClick: handleClick });

      const card = screen.getByRole('button');
      await user.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should set clickeable to true when onClick is provided and has data', () => {
      const handleClick = jest.fn();
      renderComponent({ onClick: handleClick });

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveAttribute('data-clickeable', 'true');
    });

    it('should set clickeable to false when onClick is not provided', () => {
      renderComponent();

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveAttribute('data-clickeable', 'false');
    });

    it('should set clickeable to false and not trigger onClick when has no data', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderWithData([], { onClick: handleClick });

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveAttribute('data-clickeable', 'false');

      await user.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should support keyboard activation when clickable', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderComponent({ onClick: handleClick });

      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Selected State', () => {
    it('should add selected class when isSelected is true', () => {
      renderComponent({ isSelected: true });

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveClass('selected');
    });

    it('should not add selected class when isSelected is false', () => {
      renderComponent({ isSelected: false });

      const card = screen.getByTestId('big-number-with-content');
      expect(card).not.toHaveClass('selected');
    });

    it('should not add selected class by default', () => {
      renderComponent();

      const card = screen.getByTestId('big-number-with-content');
      expect(card).not.toHaveClass('selected');
    });
  });

  describe('FullWidth Prop', () => {
    it('should set fullWidth to false by default', () => {
      renderComponent();

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveAttribute('data-full-width', 'false');
    });

    it('should set fullWidth to true when specified', () => {
      renderComponent({ fullWidth: true });

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveAttribute('data-full-width', 'true');
    });

    it('should pass fullWidth prop to body', () => {
      renderComponent({ fullWidth: true });

      const body = screen.getByTestId('big-number-with-content-body');
      expect(body).toHaveAttribute('data-full-width', 'true');
    });

    it('should pass fullWidth prop to BigNumber section', () => {
      renderComponent({ fullWidth: true });

      const section = screen.getByTestId('big-number-with-content-bignumber');
      expect(section).toHaveAttribute('data-full-width', 'true');
    });

    it('should pass fullWidth prop to Content section when children exists', () => {
      renderComponent({ fullWidth: true }, mockContent);

      const contentSection = screen.getByTestId(
        'big-number-with-content-content',
      );
      expect(contentSection).toHaveAttribute('data-full-width', 'true');
    });
  });

  describe('Empty State', () => {
    it('should render empty state when data array is empty', () => {
      renderWithData([]);

      const bigNumber = screen.getByTestId('big-number-with-content-bignumber');
      expect(bigNumber).toBeInTheDocument();
    });

    it('should pass emptyStateMessage to BigNumber', () => {
      const emptyMessage = 'No data available for this period';
      renderWithData([], { emptyStateMessage: emptyMessage });

      expect(screen.getByText(emptyMessage)).toBeInTheDocument();
    });

    it('should render content section even with empty data when children provided', () => {
      renderWithData([], { emptyStateMessage: 'No data' }, mockContent);

      expect(
        screen.getByTestId('big-number-with-content-content'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('mock-content')).toBeInTheDocument();
    });
  });

  describe('Data Rendering', () => {
    it('should render BigNumber with single data item', () => {
      renderComponent();

      expect(screen.getByText('10.1')).toBeInTheDocument();
    });

    it('should render BigNumber with multiple data items', () => {
      renderWithData(mockDataMultiple);

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('should pass orientation prop to BigNumber', () => {
      renderComponent();

      const bigNumber = screen.getByTestId('big-number');
      expect(bigNumber).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should pass size prop to BigNumber (defaults to large)', () => {
      renderComponent();

      const bigNumber = screen.getByTestId('big-number');
      expect(bigNumber).toHaveAttribute('data-size', 'large');
    });
  });

  describe('Container Classes', () => {
    it('should include bigNumberwithContentCard class', () => {
      renderComponent();

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveClass('bigNumberwithContentCard');
    });

    it('should include selected class when isSelected', () => {
      renderComponent({ isSelected: true });

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveClass('selected', 'bigNumberwithContentCard');
    });
  });

  describe('Data Test IDs', () => {
    it('should have data-testid on main container', () => {
      renderComponent();

      expect(screen.getByTestId('big-number-with-content')).toBeInTheDocument();
    });

    it('should have data-testid on header when provided', () => {
      renderComponent({ header: mockHeader });

      expect(
        screen.getByTestId('big-number-with-content-header'),
      ).toBeInTheDocument();
    });

    it('should have data-testid on body', () => {
      renderComponent();

      expect(
        screen.getByTestId('big-number-with-content-body'),
      ).toBeInTheDocument();
    });

    it('should have data-testid on bignumber section', () => {
      renderComponent();

      expect(
        screen.getByTestId('big-number-with-content-bignumber'),
      ).toBeInTheDocument();
    });

    it('should have data-testid on content section when children provided', () => {
      renderComponent({}, mockContent);

      expect(
        screen.getByTestId('big-number-with-content-content'),
      ).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('should render with all props combined correctly', () => {
      const handleClick = jest.fn();

      renderComponent(
        {
          header: mockHeader,
          onClick: handleClick,
          isSelected: true,
          fullWidth: true,
          emptyStateMessage: 'No data',
        },
        mockContent,
      );

      const card = screen.getByTestId('big-number-with-content');
      expect(card).toHaveClass('selected', 'bigNumberwithContentCard');
      expect(card).toHaveAttribute('data-full-width', 'true');
      expect(card).toHaveAttribute('data-clickeable', 'true');
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();

      const body = screen.getByTestId('big-number-with-content-body');
      expect(body).toHaveAttribute('data-full-width', 'true');
      expect(screen.getByText('10.1')).toBeInTheDocument();
      expect(screen.getByTestId('mock-content')).toBeInTheDocument();

      expect(card).toHaveAttribute('role', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children correctly', () => {
      renderComponent({}, null);

      expect(
        screen.queryByTestId('big-number-with-content-content'),
      ).not.toBeInTheDocument();
    });

    it('should handle undefined children correctly', () => {
      renderComponent({}, undefined);

      expect(
        screen.queryByTestId('big-number-with-content-content'),
      ).not.toBeInTheDocument();
    });

    it('should render with only header and no content', () => {
      renderComponent({ header: mockHeader });

      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(
        screen.queryByTestId('big-number-with-content-content'),
      ).not.toBeInTheDocument();
    });

    it('should render with content but no header', () => {
      renderComponent({}, mockContent);

      expect(
        screen.queryByTestId('big-number-with-content-header'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('mock-content')).toBeInTheDocument();
    });
  });
});

/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from '@testing-library/react';

import { HoverState, LegendItem } from '../../types';
import { ChartLegend } from './ChartLegend';

jest.mock('../../InteractiveChartWrapper.styles', () => ({
  StyledLegendGrid: ({
    children,
    style,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    style?: React.CSSProperties;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId ?? 'legend-grid'} style={style}>
      {children}
    </div>
  ),
  StyledLegendItem: ({
    children,
    isHovered,
    isNeutral,
    'data-testid': dataTestId,
  }: {
    children?: React.ReactNode;
    isHovered?: boolean;
    isNeutral?: boolean;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'legend-item'}
      data-is-hovered={isHovered}
      data-is-neutral={isNeutral}
    >
      {children}
    </div>
  ),
}));

jest.mock('components/BrandAvatar/Components/BrandAvatarItem', () => ({
  BrandAvatarItem: (props: { title?: string; color?: string }) => (
    <div data-testid="brand-avatar-item" data-title={props.title}>
      {props.title}
    </div>
  ),
}));

const mockItems: LegendItem[] = [{ title: 'Brand A' }, { title: 'Brand B' }];

const mockGetItemHoverState = jest.fn(
  (_index: number): HoverState => 'neutral',
);

describe('ChartLegend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItemHoverState.mockReturnValue('neutral');
  });

  describe('Rendering', () => {
    it('should render the legend grid with data-testid', () => {
      render(
        <ChartLegend
          items={mockItems}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(screen.getByTestId('chart-legend-grid')).toBeInTheDocument();
    });

    it('should render legend items for each non-null item', () => {
      render(
        <ChartLegend
          items={mockItems}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(screen.getByTestId('chart-legend-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('chart-legend-item-1')).toBeInTheDocument();
    });

    it('should render BrandAvatarItem for each item', () => {
      render(
        <ChartLegend
          items={mockItems}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      const avatarItems = screen.getAllByTestId('brand-avatar-item');

      expect(avatarItems).toHaveLength(2);
      expect(avatarItems[0]).toHaveAttribute('data-title', 'Brand A');
      expect(avatarItems[1]).toHaveAttribute('data-title', 'Brand B');
    });

    it('should render empty item for null entries', () => {
      const itemsWithNull: (LegendItem | null)[] = [
        mockItems[0],
        null,
        mockItems[1],
      ];

      render(
        <ChartLegend
          items={itemsWithNull}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(
        screen.getByTestId('chart-legend-item-empty-after-Brand-A-nulls-0'),
      ).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should return null when items array is empty', () => {
      const { container } = render(
        <ChartLegend
          items={[]}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should apply hovered state when getItemHoverState returns "hovered"', () => {
      mockGetItemHoverState.mockReturnValue('hovered');

      render(
        <ChartLegend
          items={mockItems}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(screen.getByTestId('chart-legend-item-0')).toHaveAttribute(
        'data-is-hovered',
        'true',
      );
    });

    it('should apply neutral state when getItemHoverState returns "neutral"', () => {
      mockGetItemHoverState.mockReturnValue('neutral');

      render(
        <ChartLegend
          items={mockItems}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(screen.getByTestId('chart-legend-item-0')).toHaveAttribute(
        'data-is-neutral',
        'true',
      );
    });

    it('should apply grid style to the legend grid', () => {
      const gridStyle = { gridTemplateColumns: 'repeat(3, 1fr)' };

      render(
        <ChartLegend
          items={mockItems}
          gridStyle={gridStyle}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      const grid = screen.getByTestId('chart-legend-grid');

      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
    });
  });

  describe('Functionality', () => {
    it('should call getItemHoverState for each non-null item', () => {
      render(
        <ChartLegend
          items={mockItems}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(mockGetItemHoverState).toHaveBeenCalledWith(0);
      expect(mockGetItemHoverState).toHaveBeenCalledWith(1);
    });

    it('should not call getItemHoverState for null items', () => {
      const itemsWithNull: (LegendItem | null)[] = [null];

      render(
        <ChartLegend
          items={itemsWithNull}
          gridStyle={{}}
          getItemHoverState={mockGetItemHoverState}
        />,
      );

      expect(mockGetItemHoverState).not.toHaveBeenCalled();
    });
  });
});

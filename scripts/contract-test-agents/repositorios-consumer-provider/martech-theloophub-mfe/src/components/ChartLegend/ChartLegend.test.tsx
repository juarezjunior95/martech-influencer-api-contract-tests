import { fireEvent, render, screen } from '@testing-library/react';

import { ChartLegend, ChartLegendItem } from './ChartLegend';

jest.mock('assets/stripedBackground.svg', () => 'striped-background.svg');

jest.mock('./ChartLegend.styles', () => ({
  StyledChartLegendContainer: ({
    children,
    orientation,
    'data-testid': testId,
  }: any) => (
    <div
      className="legend-container"
      data-testid={testId}
      data-orientation={orientation}
    >
      {children}
    </div>
  ),
  StyledChartLegendItem: ({
    children,
    onClick,
    clickeable,
    'data-testid': testId,
  }: any) => (
    <button
      className="legend-item"
      data-testid={testId}
      onClick={onClick}
      onKeyDown={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-clickeable={clickeable}
    >
      {children}
    </button>
  ),
  StyledChartLegendShape: ({
    children,
    type,
    className,
    style,
    'data-testid': testId,
  }: any) => (
    <div
      className="legend-shape"
      data-testid={testId}
      data-type={type}
      data-classname={className}
      style={style}
    >
      {children}
    </div>
  ),
  StyledChartLegendLabel: ({
    children,
    size,
    strike,
    'data-testid': testId,
    fontWeight,
  }: any) => (
    <span
      className="legend-label"
      data-testid={testId}
      data-size={size}
      data-strike={strike}
      data-font-weight={fontWeight}
    >
      {children}
    </span>
  ),
  StyledChartLegendLayer: ({ className, style }: any) => (
    <div className="legend-layer" data-classname={className} style={style} />
  ),
}));

describe('ChartLegend Component', () => {
  const defaultItem: ChartLegendItem = {
    label: 'Test Label',
    shape: 'rectangle',
    color: '#FF0000',
    size: 'medium',
    decoration: 'none',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with single item', () => {
      const { container } = render(<ChartLegend items={[defaultItem]} />);

      expect(container.querySelector('.legend-container')).toBeInTheDocument();
      expect(container.querySelector('.legend-item')).toBeInTheDocument();
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should render multiple items', () => {
      const items: ChartLegendItem[] = [
        { ...defaultItem, label: 'Item 1' },
        { ...defaultItem, label: 'Item 2' },
        { ...defaultItem, label: 'Item 3' },
      ];

      const { container } = render(<ChartLegend items={items} />);

      const legendItems = container.querySelectorAll('.legend-item');
      expect(legendItems).toHaveLength(3);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should render empty legend when items array is empty', () => {
      const { container } = render(<ChartLegend items={[]} />);

      expect(container.querySelector('.legend-container')).toBeInTheDocument();
      expect(container.querySelectorAll('.legend-item')).toHaveLength(0);
    });

    it('should render with React node as label', () => {
      const customLabel = (
        <div data-testid="custom-label">Custom Component Label</div>
      );
      const itemWithCustomLabel: ChartLegendItem = {
        ...defaultItem,
        label: customLabel,
      };

      render(<ChartLegend items={[itemWithCustomLabel]} />);

      expect(screen.getByTestId('custom-label')).toBeInTheDocument();
      expect(screen.getByText('Custom Component Label')).toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('should render with default horizontal orientation', () => {
      const { container } = render(<ChartLegend items={[defaultItem]} />);

      const legendContainer = container.querySelector('.legend-container');
      expect(legendContainer).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should render with vertical orientation', () => {
      const { container } = render(
        <ChartLegend items={[defaultItem]} orientation="vertical" />,
      );

      const legendContainer = container.querySelector('.legend-container');
      expect(legendContainer).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should render with horizontal orientation when explicitly set', () => {
      const { container } = render(
        <ChartLegend items={[defaultItem]} orientation="horizontal" />,
      );

      const legendContainer = container.querySelector('.legend-container');
      expect(legendContainer).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  describe('Shapes', () => {
    it('should render rectangle shape', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        shape: 'rectangle',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveAttribute('data-type', 'rectangle');
    });

    it('should render circle shape', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        shape: 'circle',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveAttribute('data-type', 'circle');
    });

    it('should render square shape', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        shape: 'square',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveAttribute('data-type', 'square');
    });

    it('should render thinPill shape', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        shape: 'thinPill',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveAttribute('data-type', 'thinPill');
    });

    it('should render pill shape', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        shape: 'pill',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveAttribute('data-type', 'pill');
    });
  });

  describe('Sizes', () => {
    it('should render with small size', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        size: 'small',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const label = container.querySelector('.legend-label');
      const shape = container.querySelector('.legend-shape');

      expect(label).toHaveAttribute('data-size', 'small');
      expect(shape).toHaveAttribute('data-classname', 'small');
    });

    it('should render with medium size', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        size: 'medium',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const label = container.querySelector('.legend-label');
      const shape = container.querySelector('.legend-shape');

      expect(label).toHaveAttribute('data-size', 'medium');
      expect(shape).toHaveAttribute('data-classname', 'medium');
    });

    it('should render with large size', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        size: 'large',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const label = container.querySelector('.legend-label');
      const shape = container.querySelector('.legend-shape');

      expect(label).toHaveAttribute('data-size', 'large');
      expect(shape).toHaveAttribute('data-classname', 'large');
    });
  });

  describe('Colors', () => {
    it('should apply color to shape', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        color: '#FF5733',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveStyle({ background: '#FF5733' });
    });

    it('should render different colors for multiple items', () => {
      const items: ChartLegendItem[] = [
        { ...defaultItem, label: 'Red', color: '#FF0000' },
        { ...defaultItem, label: 'Blue', color: '#0000FF' },
        { ...defaultItem, label: 'Green', color: '#00FF00' },
      ];

      const { container } = render(<ChartLegend items={items} />);

      const shapes = container.querySelectorAll('.legend-shape');
      expect(shapes[0]).toHaveStyle({ background: '#FF0000' });
      expect(shapes[1]).toHaveStyle({ background: '#0000FF' });
      expect(shapes[2]).toHaveStyle({ background: '#00FF00' });
    });
  });

  describe('Decoration - None', () => {
    it('should render without decoration when decoration is none', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        decoration: 'none',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      const style = shape?.getAttribute('style');
      expect(style).not.toContain('backgroundImage');
      expect(container.querySelector('.legend-layer')).not.toBeInTheDocument();
    });
  });

  describe('Decoration - Dash', () => {
    it('should apply striped background when decoration is dash', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        decoration: 'dash',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveStyle({
        backgroundImage: 'url(striped-background.svg)',
      });
    });

    it('should not render layer when decoration is dash', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        decoration: 'dash',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      expect(container.querySelector('.legend-layer')).not.toBeInTheDocument();
    });
  });

  describe('Decoration - Layer', () => {
    it('should render layer when decoration is layer', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        decoration: 'layer',
        layerColor: '#00FF00',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const layer = container.querySelector('.legend-layer');
      expect(layer).toBeInTheDocument();
      expect(layer).toHaveStyle({ background: '#00FF00' });
    });

    it('should apply border when decoration is layer', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        decoration: 'layer',
        layerColor: '#00FF00',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveStyle({ border: '1px solid #14141424' });
    });

    it('should render layer with correct size class', () => {
      const items: ChartLegendItem[] = [
        {
          ...defaultItem,
          size: 'small',
          decoration: 'layer',
          layerColor: '#FF0000',
        },
        {
          ...defaultItem,
          size: 'medium',
          decoration: 'layer',
          layerColor: '#00FF00',
        },
        {
          ...defaultItem,
          size: 'large',
          decoration: 'layer',
          layerColor: '#0000FF',
        },
      ];

      const { container } = render(<ChartLegend items={items} />);

      const layers = container.querySelectorAll('.legend-layer');
      expect(layers[0]).toHaveAttribute('data-classname', 'small');
      expect(layers[1]).toHaveAttribute('data-classname', 'medium');
      expect(layers[2]).toHaveAttribute('data-classname', 'large');
    });
  });

  describe('Border', () => {
    it('should apply border when border prop is true', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        border: true,
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveStyle({ border: '1px solid #14141424' });
    });

    it('should not apply border when border prop is false', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        border: false,
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).not.toHaveStyle({ border: '1px solid #14141424' });
    });

    it('should not apply border when border prop is not provided', () => {
      const { container } = render(<ChartLegend items={[defaultItem]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).not.toHaveStyle({ border: '1px solid #14141424' });
    });
  });

  describe('Font Weight', () => {
    it('should apply fontWeight when provided', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        fontWeight: 'medium',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const label = container.querySelector('.legend-label');
      expect(label).toHaveAttribute('data-font-weight', 'medium');
    });

    it('should render different fontWeight values', () => {
      const items: ChartLegendItem[] = [
        { ...defaultItem, label: 'Normal', fontWeight: 'normal' },
        { ...defaultItem, label: 'Medium', fontWeight: 'medium' },
        { ...defaultItem, label: 'Semibold', fontWeight: 'semibold' },
        { ...defaultItem, label: 'Bold', fontWeight: 'bold' },
      ];

      const { container } = render(<ChartLegend items={items} />);

      const labels = container.querySelectorAll('.legend-label');
      expect(labels[0]).toHaveAttribute('data-font-weight', 'normal');
      expect(labels[1]).toHaveAttribute('data-font-weight', 'medium');
      expect(labels[2]).toHaveAttribute('data-font-weight', 'semibold');
      expect(labels[3]).toHaveAttribute('data-font-weight', 'bold');
    });

    it('should not set fontWeight attribute when not provided', () => {
      const { container } = render(<ChartLegend items={[defaultItem]} />);

      const label = container.querySelector('.legend-label');
      expect(label).not.toHaveAttribute('data-font-weight');
    });
  });

  describe('Strike', () => {
    it('should apply strike when strike prop is true', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        strike: true,
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const label = container.querySelector('.legend-label');
      expect(label).toHaveAttribute('data-strike', 'true');
    });

    it('should not apply strike when strike prop is false', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        strike: false,
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const label = container.querySelector('.legend-label');
      expect(label).toHaveAttribute('data-strike', 'false');
    });

    it('should not apply strike when strike prop is not provided', () => {
      const { container } = render(<ChartLegend items={[defaultItem]} />);

      const label = container.querySelector('.legend-label');
      expect(label).not.toHaveAttribute('data-strike', 'true');
    });
  });

  describe('onClick Interaction', () => {
    it('should call onClick when item is clicked', () => {
      const handleClick = jest.fn();
      const item: ChartLegendItem = {
        ...defaultItem,
        onClick: handleClick,
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const legendItem = container.querySelector('.legend-item');
      fireEvent.click(legendItem!);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should set clickeable attribute when onClick is provided', () => {
      const handleClick = jest.fn();
      const item: ChartLegendItem = {
        ...defaultItem,
        onClick: handleClick,
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const legendItem = container.querySelector('.legend-item');
      expect(legendItem).toHaveAttribute('data-clickeable', 'true');
    });

    it('should not set clickeable attribute when onClick is not provided', () => {
      const { container } = render(<ChartLegend items={[defaultItem]} />);

      const legendItem = container.querySelector('.legend-item');
      expect(legendItem).toHaveAttribute('data-clickeable', 'false');
    });

    it('should call different onClick handlers for multiple items', () => {
      const handleClick1 = jest.fn();
      const handleClick2 = jest.fn();
      const items: ChartLegendItem[] = [
        { ...defaultItem, label: 'Item 1', onClick: handleClick1 },
        { ...defaultItem, label: 'Item 2', onClick: handleClick2 },
      ];

      const { container } = render(<ChartLegend items={items} />);

      const legendItems = container.querySelectorAll('.legend-item');
      fireEvent.click(legendItems[0]);
      fireEvent.click(legendItems[1]);

      expect(handleClick1).toHaveBeenCalledTimes(1);
      expect(handleClick2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with all props provided', () => {
      const handleClick = jest.fn();
      const item: ChartLegendItem = {
        label: 'Complete Item',
        shape: 'circle',
        color: '#FF5733',
        size: 'large',
        strike: true,
        border: true,
        decoration: 'layer',
        layerColor: '#00FF00',
        onClick: handleClick,
      };

      const { container } = render(
        <ChartLegend items={[item]} orientation="vertical" />,
      );

      expect(screen.getByText('Complete Item')).toBeInTheDocument();
      expect(container.querySelector('.legend-container')).toHaveAttribute(
        'data-orientation',
        'vertical',
      );
      expect(container.querySelector('.legend-shape')).toHaveAttribute(
        'data-type',
        'circle',
      );
      expect(container.querySelector('.legend-shape')).toHaveStyle({
        background: '#FF5733',
      });
      expect(container.querySelector('.legend-label')).toHaveAttribute(
        'data-size',
        'large',
      );
      expect(container.querySelector('.legend-label')).toHaveAttribute(
        'data-strike',
        'true',
      );
      expect(container.querySelector('.legend-layer')).toBeInTheDocument();
    });

    it('should render multiple items with different configurations', () => {
      const items: ChartLegendItem[] = [
        {
          label: 'Rectangle',
          shape: 'rectangle',
          color: '#FF0000',
          size: 'small',
          decoration: 'none',
        },
        {
          label: 'Circle with dash',
          shape: 'circle',
          color: '#00FF00',
          size: 'medium',
          decoration: 'dash',
        },
        {
          label: 'Square with layer',
          shape: 'square',
          color: '#0000FF',
          size: 'large',
          decoration: 'layer',
          layerColor: '#FFFF00',
        },
      ];

      const { container } = render(<ChartLegend items={items} />);

      expect(screen.getByText('Rectangle')).toBeInTheDocument();
      expect(screen.getByText('Circle with dash')).toBeInTheDocument();
      expect(screen.getByText('Square with layer')).toBeInTheDocument();

      const shapes = container.querySelectorAll('.legend-shape');
      expect(shapes).toHaveLength(3);

      const layers = container.querySelectorAll('.legend-layer');
      expect(layers).toHaveLength(1);
    });

    it('should generate unique keys for items with same label', () => {
      const items: ChartLegendItem[] = [
        { ...defaultItem, label: 'Same Label' },
        { ...defaultItem, label: 'Same Label' },
      ];

      const { container } = render(<ChartLegend items={items} />);

      const legendItems = container.querySelectorAll('.legend-item');
      expect(legendItems).toHaveLength(2);
    });

    it('should handle items with strike and onClick together', () => {
      const handleClick = jest.fn();
      const item: ChartLegendItem = {
        ...defaultItem,
        strike: true,
        onClick: handleClick,
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const legendItem = container.querySelector('.legend-item');
      fireEvent.click(legendItem!);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(container.querySelector('.legend-label')).toHaveAttribute(
        'data-strike',
        'true',
      );
    });

    it('should handle items with border and dash decoration together', () => {
      const item: ChartLegendItem = {
        ...defaultItem,
        border: true,
        decoration: 'dash',
      };

      const { container } = render(<ChartLegend items={[item]} />);

      const shape = container.querySelector('.legend-shape');
      expect(shape).toHaveStyle({
        border: '1px solid #14141424',
        backgroundImage: 'url(striped-background.svg)',
      });
    });
  });

  describe('dataTestId prop', () => {
    it('should apply data-testid when dataTestId prop is provided', () => {
      render(
        <ChartLegend items={[defaultItem]} dataTestId="chart-legend-revenue" />,
      );

      expect(screen.getByTestId('chart-legend-revenue')).toBeInTheDocument();
    });

    it('should apply data-testid to items when dataTestId prop is provided', () => {
      const items: ChartLegendItem[] = [
        { ...defaultItem, label: 'Item 1' },
        { ...defaultItem, label: 'Item 2' },
      ];

      render(<ChartLegend items={items} dataTestId="chart-legend" />);

      expect(screen.getByTestId('chart-legend-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('chart-legend-item-1')).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-legend-item-0-shape'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-legend-item-1-shape'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-legend-item-0-label'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('chart-legend-item-1-label'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId prop is not provided', () => {
      const { container } = render(<ChartLegend items={[defaultItem]} />);

      expect(
        container.querySelector('[data-testid="chart-legend"]'),
      ).not.toBeInTheDocument();
      expect(container.querySelector('.legend-container')).toBeInTheDocument();
    });
  });
});

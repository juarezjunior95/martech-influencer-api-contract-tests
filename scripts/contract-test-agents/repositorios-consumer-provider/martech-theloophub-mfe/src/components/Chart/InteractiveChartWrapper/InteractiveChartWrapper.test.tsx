import { fireEvent, render, screen } from '@testing-library/react';

import { InteractiveChartWrapper } from './InteractiveChartWrapper';

describe('InteractiveChartWrapper', () => {
  const mockLabels = ['A', 'B', 'C'];
  const mockChild = <div data-testid="chart-child">Chart</div>;
  const testId = 'interactive-chart';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render wrapper and children', () => {
      render(
        <InteractiveChartWrapper labels={mockLabels} dataTestId={testId}>
          {mockChild}
        </InteractiveChartWrapper>,
      );

      expect(
        screen.getByTestId('interactive-chart-wrapper'),
      ).toBeInTheDocument();
      expect(screen.getByTestId(`${testId}-container`)).toBeInTheDocument();
      const children = screen.getAllByTestId('chart-child');
      expect(children.length).toBeGreaterThanOrEqual(1);
    });

    it('should render overlays for each label', () => {
      render(
        <InteractiveChartWrapper labels={mockLabels} dataTestId={testId}>
          {mockChild}
        </InteractiveChartWrapper>,
      );

      mockLabels.forEach((_, index) => {
        expect(screen.getByTestId('column-mask-overlay')).toBeInTheDocument();
        expect(
          screen.getByTestId(`${testId}-column-${index}`),
        ).toBeInTheDocument();
      });
    });

    it('should not render interactive columns when labels is empty', () => {
      render(
        <InteractiveChartWrapper labels={[]} dataTestId={testId}>
          {mockChild}
        </InteractiveChartWrapper>,
      );

      expect(
        screen.queryByTestId(`${testId}-column-0`),
      ).not.toBeInTheDocument();
    });

    it('should not render data-testid attributes when dataTestId prop is not provided', () => {
      render(
        <InteractiveChartWrapper labels={mockLabels}>
          {mockChild}
        </InteractiveChartWrapper>,
      );

      expect(
        screen.queryByTestId(`${testId}-container`),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`${testId}-column-0`),
      ).not.toBeInTheDocument();
    });
  });

  describe('disableOverlay prop', () => {
    it('should not render interactive columns when disableOverlay is true', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          disableOverlay
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      expect(
        screen.queryByTestId(`${testId}-column-0`),
      ).not.toBeInTheDocument();
    });

    it('should render interactive columns when disableOverlay is false', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          disableOverlay={false}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      expect(screen.getByTestId(`${testId}-column-0`)).toBeInTheDocument();
    });
  });

  describe('Interaction callbacks', () => {
    it('should call onItemHover when hovering over a clickable column', () => {
      const onItemHover = jest.fn();

      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          onItemHover={onItemHover}
          clickability={{ enabled: true }}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));
      expect(onItemHover).toHaveBeenCalledWith(0);

      fireEvent.mouseLeave(screen.getByTestId(`${testId}-column-0`));
      expect(onItemHover).toHaveBeenCalledWith(null);
    });

    it('should not call onItemHover when hovering over a non-clickable column', () => {
      const onItemHover = jest.fn();

      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          onItemHover={onItemHover}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));
      expect(onItemHover).not.toHaveBeenCalled();
    });

    it('should call onItemSelect when clicking a clickable column', () => {
      const onItemSelect = jest.fn();

      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          onItemSelect={onItemSelect}
          clickability={{ enabled: true }}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.click(screen.getByTestId(`${testId}-column-1`));
      expect(onItemSelect).toHaveBeenCalledWith(1);
    });

    it('should toggle selection when clicking the same column twice', () => {
      const onItemSelect = jest.fn();

      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          onItemSelect={onItemSelect}
          clickability={{ enabled: true }}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.click(screen.getByTestId(`${testId}-column-1`));
      expect(onItemSelect).toHaveBeenCalledWith(1);

      fireEvent.click(screen.getByTestId(`${testId}-column-1`));
      expect(onItemSelect).toHaveBeenCalledWith(null);
    });
  });

  describe('renderLegend', () => {
    it('should render legend with interaction context', () => {
      const renderLegend = jest.fn(({ getItemHoverState }) => (
        <div data-testid="legend">
          <span data-testid="hover-state">{getItemHoverState(0)}</span>
        </div>
      ));

      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          renderLegend={renderLegend}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      const legends = screen.getAllByTestId('legend');
      expect(legends.length).toBeGreaterThanOrEqual(1);
      expect(renderLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          getItemHoverState: expect.any(Function),
          hoveredIndex: null,
          selectedIndex: null,
        }),
      );
    });

    it('should update hover state in legend when hovering (dimming disabled by default)', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          clickability={{ enabled: true }}
          renderLegend={({ getItemHoverState }) => (
            <div data-testid="legend">
              <span data-testid="hover-state-0">{getItemHoverState(0)}</span>
              <span data-testid="hover-state-1">{getItemHoverState(1)}</span>
            </div>
          )}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      const getHoverState = (index: number) =>
        screen.getAllByTestId(`hover-state-${index}`).pop();

      expect(getHoverState(0)).toHaveTextContent('neutral');
      expect(getHoverState(1)).toHaveTextContent('neutral');

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));

      expect(getHoverState(0)).toHaveTextContent('hovered');
      expect(getHoverState(1)).toHaveTextContent('neutral');
    });

    it('should dim non-hovered items when disableLegendDimming is false', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          clickability={{ enabled: true }}
          disableLegendDimming={false}
          renderLegend={({ getItemHoverState }) => (
            <div data-testid="legend">
              <span data-testid="hover-state-0">{getItemHoverState(0)}</span>
              <span data-testid="hover-state-1">{getItemHoverState(1)}</span>
            </div>
          )}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));

      const getHoverState = (index: number) =>
        screen.getAllByTestId(`hover-state-${index}`).pop();

      expect(getHoverState(0)).toHaveTextContent('hovered');
      expect(getHoverState(1)).toHaveTextContent('dimmed');
    });
  });

  describe('chartOptions padding', () => {
    it('should apply custom padding from chartOptions.layout.padding', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          chartOptions={{ layout: { padding: { left: 32, right: 24 } } }}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      const overlay = screen.getByTestId('column-mask-overlay');
      expect(overlay).toHaveStyle({ left: expect.stringContaining('32px') });
    });
  });

  describe('showTooltip', () => {
    it('should not render tooltip by default when hovering over clickable column', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          clickability={{ enabled: true }}
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));

      expect(screen.queryByTestId(`${testId}-tooltip`)).not.toBeInTheDocument();
    });

    it('should render tooltip with label when showTooltip is true and hovering over clickable column', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          clickability={{ enabled: true }}
          showTooltip
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));

      const tooltip = screen.getByTestId(`${testId}-tooltip`);
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('A');
    });

    it('should not render tooltip when showTooltip is true but column is not clickable', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          clickability={{ enabled: true, disabledIndexes: [0] }}
          showTooltip
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));

      expect(screen.queryByTestId(`${testId}-tooltip`)).not.toBeInTheDocument();
    });

    it('should hide tooltip when mouse leaves the column', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          clickability={{ enabled: true }}
          showTooltip
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));
      expect(screen.getByTestId(`${testId}-tooltip`)).toBeInTheDocument();

      fireEvent.mouseLeave(screen.getByTestId(`${testId}-column-0`));
      expect(screen.queryByTestId(`${testId}-tooltip`)).not.toBeInTheDocument();
    });

    it('should display correct label when hovering over different columns', () => {
      render(
        <InteractiveChartWrapper
          labels={mockLabels}
          clickability={{ enabled: true }}
          showTooltip
          dataTestId={testId}
        >
          {mockChild}
        </InteractiveChartWrapper>,
      );

      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-0`));
      expect(screen.getByTestId(`${testId}-tooltip`)).toHaveTextContent('A');

      fireEvent.mouseLeave(screen.getByTestId(`${testId}-column-0`));
      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-1`));
      expect(screen.getByTestId(`${testId}-tooltip`)).toHaveTextContent('B');

      fireEvent.mouseLeave(screen.getByTestId(`${testId}-column-1`));
      fireEvent.mouseEnter(screen.getByTestId(`${testId}-column-2`));
      expect(screen.getByTestId(`${testId}-tooltip`)).toHaveTextContent('C');
    });
  });
});

export type HoverState = 'hovered' | 'dimmed' | 'neutral';

export interface InteractionContext {
  getItemHoverState: (index: number) => HoverState;
  hoveredIndex: number | null;
  selectedIndex: number | null;
}

export interface LegendItem {
  title: string;
  mainBrand?: {
    src: string;
    alt: string;
  };
}

export interface ChartLayoutPadding {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface ChartOptionsForWrapper {
  layout?: {
    padding?: ChartLayoutPadding;
  };
}

export interface ClickabilityConfig {
  enabled?: boolean;
  clickableIndexes?: number[];
  disabledIndexes?: number[];
}

export interface InteractiveChartWrapperProps {
  children: React.ReactNode;
  labels: string[];
  disableOverlay?: boolean;
  disableLegendDimming?: boolean;
  fillHeight?: boolean;
  indexAxis?: 'x' | 'y';
  onItemHover?: (index: number | null) => void;
  onItemSelect?: (index: number | null) => void;
  chartOptions?: ChartOptionsForWrapper;
  renderLegend?: (context: InteractionContext) => React.ReactNode;
  clickability?: ClickabilityConfig;
  showTooltip?: boolean;
  dataTestId?: string;
}

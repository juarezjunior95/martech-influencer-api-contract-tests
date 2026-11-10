export interface LineChartHighlightProps {
  display?: boolean;
  highlightIndex?: number;
  highlightColor?: string;
  highlightRadius?: number;
  showComparisonLine?: boolean;
  comparisonLineColor?: string;
  comparisonLineWidth?: number;
  comparisonLineDash?: number[];
}

export interface HighlightPoint {
  x: number;
  y: number;
  datasetIndex: number;
  index: number;
}

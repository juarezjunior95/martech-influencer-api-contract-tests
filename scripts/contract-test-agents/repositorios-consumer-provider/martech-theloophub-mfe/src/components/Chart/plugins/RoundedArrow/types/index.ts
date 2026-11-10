export interface RoudedArrowProps {
  comparison: number;
  unit_of_measure: string;
  direction: 'up' | 'down';
  midY?: number;
  chartType?: 'waterfall' | 'bar';
  startBarIndex?: number;
  prefix?: string;
}

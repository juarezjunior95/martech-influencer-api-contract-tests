export interface GanttHeader {
  weekRanges: string[];
  title: string;
  headerHeight?: number;
}

export interface GanttRow {
  id: string;
  cells: GanttCell[];
  style?: React.CSSProperties;
  mode?: GanttMode;
  tooltip?: GanttCellTooltip[];
}

export interface GanttCellTooltip {
  value: string;
  label: string;
}

export interface GanttCell {
  id: string;
  color?: string;
  milestone?: {
    color: string;
  };
  timing?: 'start' | 'end' | 'unique';
}

export type GanttMode = 'milestones' | 'bar';

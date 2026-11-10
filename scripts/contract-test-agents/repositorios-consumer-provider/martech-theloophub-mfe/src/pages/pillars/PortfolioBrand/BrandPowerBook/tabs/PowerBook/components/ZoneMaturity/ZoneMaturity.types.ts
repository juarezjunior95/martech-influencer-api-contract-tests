export type ViewType = 'zone' | 'maturity';

export type RowSelectionHandler = (value: string) => void;

export interface TableData {
  header: Array<{ field: string; headerName: string }>;
  rows: Array<Record<string, unknown>>;
}

export type BorderRadius =
  'small' | 'none' | 'medium' | 'large' | 'x-large' | 'x-small';

export interface SkeletonProps {
  length: number;
  width: string;
  height: string;
  borderRadius: BorderRadius;
}

export interface NoRowsMessage {
  title: string;
  description: string;
}

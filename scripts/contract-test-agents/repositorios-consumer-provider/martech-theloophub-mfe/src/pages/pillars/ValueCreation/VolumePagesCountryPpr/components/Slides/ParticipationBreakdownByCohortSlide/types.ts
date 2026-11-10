import type { ColumnDefsConfig } from 'components';
import type { TableDataType } from 'components/Table/types';

export interface ParticipationBreakdownByCohortSlideProps {
  loading: boolean;
  data: TableDataType & { empty?: boolean };
  config: ColumnDefsConfig;
  dataTestId?: string;
  isExport?: boolean;
  rowHeight?: number;
}

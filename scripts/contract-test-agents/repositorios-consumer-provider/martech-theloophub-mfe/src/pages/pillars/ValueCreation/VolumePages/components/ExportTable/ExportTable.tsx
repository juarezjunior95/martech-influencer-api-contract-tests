import { Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { tableConfigs } from './config';
import { StyledExportTable } from './ExportTable.styles';

interface ExportTableProps {
  data: TableDataType;
  headerHeight?: number;
  rowHeight?: number;
  dataTestId?: string;
  tableHeight?: number;
}

export const ExportTable: React.FC<ExportTableProps> = ({
  data,
  headerHeight = 45,
  rowHeight = 48,
  tableHeight = 238,
  dataTestId,
}) => {
  if (!data) return null;

  return (
    <Table
      dataTestId={dataTestId ? `table-${dataTestId}` : undefined}
      data={data}
      fixedHeight={`${tableHeight}px`}
      columnDefsConfig={tableConfigs}
      headerHeight={headerHeight}
      groupHeaderHeight={headerHeight}
      getRowHeight={() => rowHeight}
      style={StyledExportTable}
    />
  );
};

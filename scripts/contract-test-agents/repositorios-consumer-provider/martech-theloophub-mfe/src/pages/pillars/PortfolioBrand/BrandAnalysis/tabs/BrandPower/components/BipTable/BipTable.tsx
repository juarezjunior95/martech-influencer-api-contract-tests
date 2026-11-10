import { ColumnDefsConfig, Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { StyledBipTableContainer } from './BipTable.styles';

interface POSTableProps {
  data: TableDataType;
  config: ColumnDefsConfig;
  dataTestId?: string;
}

export const BipTable: React.FC<POSTableProps> = ({
  data,
  config,
  dataTestId,
}) => {
  return (
    <Table
      data={data}
      columnDefsConfig={config}
      style={StyledBipTableContainer}
      rowHeight={36}
      dataTestId={dataTestId}
    />
  );
};

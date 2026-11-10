import { Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { StyledOverviewTableContainer } from './OverviewTable.styles';

interface POSTableProps {
  data: TableDataType;
  dataTestId?: string;
}

export const OverviewTable: React.FC<POSTableProps> = ({
  data,
  dataTestId,
}) => {
  return (
    <Table
      data={data}
      style={StyledOverviewTableContainer}
      dataTestId={dataTestId}
      rowHeight={58}
      emptyRow={{
        addOnStart: true,
      }}
    />
  );
};

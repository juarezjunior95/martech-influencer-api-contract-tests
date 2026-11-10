import { Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { tableConfig } from './config';
import { InvestmentBreakdownTableStyles } from './InvestmentBreakdownTable.styles';

interface InvestmentBreakdownTableProps {
  data: TableDataType;
  dataTestId?: string;
}

export const InvestmentBreakdownTable: React.FC<
  InvestmentBreakdownTableProps
> = ({ data, dataTestId }) => {
  return (
    <Table
      data={data}
      style={InvestmentBreakdownTableStyles}
      rowHeight={34}
      headerHeight={34}
      groupHeaderHeight={44}
      columnDefsConfig={tableConfig}
      dataTestId={dataTestId}
    />
  );
};

import { Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { tableConfig } from './config';
import { StyledGrowthLeagueTable } from './GrowthLeagueTable.styles';

interface GrowthLeagueTableProps {
  dataTestId?: string;
  data: TableDataType;
  allIds?: string[];
  isBrandView?: boolean;
}

export const GrowthLeagueTable: React.FC<GrowthLeagueTableProps> = ({
  dataTestId,
  data,
  allIds,
  isBrandView,
}) => {
  return (
    <Table
      dataTestId={dataTestId ? `${dataTestId}-growth-league` : undefined}
      data={data}
      rowHeight={52}
      headerHeight={59}
      groupHeaderHeight={56}
      scrollbarWidth={0}
      getRowHeight={() => 52}
      columnDefsConfig={tableConfig(allIds, isBrandView)}
      style={StyledGrowthLeagueTable}
    />
  );
};

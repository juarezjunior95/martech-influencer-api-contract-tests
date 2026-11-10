import { Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { tableConfig } from './config';
import { StyledPortfolioPerformanceTableContainer } from './PortfolioPerformanceTable.styles';

interface PortfolioPerformanceTableProps {
  data: TableDataType;
  headerHeight?: number;
  dataTestId?: string;
  rowHeight?: number;
}

export const PortfolioPerformanceTable = ({
  data,
  headerHeight,
  dataTestId,
  rowHeight = 94,
}: PortfolioPerformanceTableProps) => {
  return (
    <Table
      data={data}
      columnDefsConfig={tableConfig}
      style={StyledPortfolioPerformanceTableContainer}
      rowHeight={rowHeight}
      headerHeight={headerHeight}
      scrollbarWidth={0}
      emptyRow={{
        addOnStart: true,
      }}
      {...({ dataTestId } as Record<string, unknown>)}
    />
  );
};

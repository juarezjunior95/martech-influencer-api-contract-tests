import { useMemo } from 'react';

import { Table } from 'components';
import { TableDataType } from 'components/Table/types';
import { splitGenericTable } from 'components/Table/utils';

import { tableConfig } from './config';
import {
  StyledPortfolioPerformanceTable,
  StyledPortfolioPerformanceTableContainer,
} from './PortfolioTable.styles';

interface PortfolioTableProps {
  data: TableDataType;
  dataTestId?: string;
}

export const PortfolioTable = ({ data, dataTestId }: PortfolioTableProps) => {
  const genericTableSplit = useMemo(
    () => splitGenericTable(data as any, data?.splits),
    [data],
  );

  return (
    <StyledPortfolioPerformanceTableContainer
      data-testid={dataTestId ? `portfolio-table-${dataTestId}` : undefined}
    >
      {Object.entries(genericTableSplit).map(([key, item], index) => (
        <Table
          dataTestId={dataTestId ? `${dataTestId}-${key}` : undefined}
          key={key}
          data={item}
          columnDefsConfig={tableConfig}
          style={StyledPortfolioPerformanceTable}
          rowHeight={80}
          headerHeight={key === 'Portfolio' ? 102 : 45}
          scrollbarWidth={0}
          emptyRow={{
            addOnStart: true,
          }}
        />
      ))}
    </StyledPortfolioPerformanceTableContainer>
  );
};

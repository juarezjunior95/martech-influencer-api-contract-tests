import React from 'react';

import { Skeleton } from 'components';
import { RowActionTable } from 'pages/components';

interface BrandBreakdownTableProps {
  loading: boolean;
  selectedPerformance: string;
  isExpanded: boolean;
  data: any;
  emptyTable: any;
  config: any;
  formatMessage: (descriptor: any) => string;
  dataTestId?: string;
}

export const BrandBreakdownTable: React.FC<BrandBreakdownTableProps> = ({
  loading,
  selectedPerformance,
  isExpanded,
  data,
  emptyTable,
  config,
  formatMessage,
  dataTestId,
}) => {
  if (loading) {
    return (
      <Skeleton length={1} width="100%" height="388px" borderRadius="none" />
    );
  }

  if (!selectedPerformance) {
    return (
      <RowActionTable
        data={emptyTable}
        rowSelection={false}
        columnDefsConfig={config}
        fixedHeight="388px"
        dataTestId={dataTestId ? `${dataTestId}-empty` : undefined}
        noRowsMessage={{
          title: formatMessage({
            id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.brandBreakdown.noRowsMessage.title',
          }),
          description: formatMessage({
            id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.brandBreakdown.noRowsMessage.description',
          }),
        }}
      />
    );
  }

  return isExpanded ? (
    <RowActionTable
      key="no-fixed-height"
      data={data}
      rowSelection={false}
      columnDefsConfig={config}
      dataTestId={dataTestId ? `${dataTestId}-expanded` : undefined}
    />
  ) : (
    <RowActionTable
      key="fixed-height"
      data={data}
      rowSelection={false}
      columnDefsConfig={config}
      fixedHeight="388px"
      dataTestId={dataTestId}
    />
  );
};

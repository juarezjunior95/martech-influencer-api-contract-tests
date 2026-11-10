import { useEffect, useState } from 'react';

import { ErrorMessage } from 'components';
import { AgGridData, TableDataType } from 'components/Table/types';
import { splitGenericTable } from 'components/Table/utils/splitGenericTable';
import { transformAgGridData } from 'components/Table/utils/transformAgGridData';
import { ContainerWithScroll } from 'utils/container';

import { PortfolioPerformanceTable, PortfolioSkeleton } from './components';
import {
  tableWidths as defaultTableWidths,
  includesHeaderHeight,
} from './constants';
import { StyledPortfolioPerformanceTable } from './PortfolioPerformance.styles';
import { applyTotalRowNeutralVariationColor } from './utils/applyTotalRowNeutralVariation';

interface PortfolioPerformanceProps {
  data: AgGridData | PortfolioData | { empty: boolean };
  error: Error | null;
  loading: boolean;
  dataTestId?: string;
  tableWidths?: string[];
  headerHeight?: number;
  rowHeight?: number;
}

export type PortfolioData = Record<string, TableDataType> | null;

export const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  data,
  error,
  loading,
  dataTestId,
  tableWidths = defaultTableWidths,
  headerHeight = 56,
  rowHeight = 94,
}) => {
  const [portfolioPerformanceData, setPortfolioPerformanceData] =
    useState<Record<string, TableDataType> | null>(null);

  useEffect(() => {
    const isAgGridData = (value: typeof data): value is AgGridData =>
      !!value && 'columnDefs' in value && Array.isArray(value.rowData);

    const splitTableData = async () => {
      if (!data || ('empty' in data && data.empty)) {
        setPortfolioPerformanceData(null);
        return;
      }

      if (isAgGridData(data)) {
        const genericTable = transformAgGridData(data);
        const withNeutral = applyTotalRowNeutralVariationColor(genericTable);
        const genericTableSplit = splitGenericTable(
          withNeutral,
          data.splits ?? [],
        );

        setPortfolioPerformanceData(genericTableSplit);
        return;
      }

      const asGenericTable = data as TableDataType;
      if (
        Array.isArray(asGenericTable.header) &&
        Array.isArray(asGenericTable.rows)
      ) {
        const withNeutral = applyTotalRowNeutralVariationColor(asGenericTable);
        const genericTableSplit = splitGenericTable(
          withNeutral,
          asGenericTable.splits ?? [],
        );

        setPortfolioPerformanceData(genericTableSplit);
        return;
      }

      setPortfolioPerformanceData(
        Object.fromEntries(
          Object.entries(data as Record<string, TableDataType>).map(
            ([key, table]) => [key, applyTotalRowNeutralVariationColor(table)],
          ),
        ),
      );
    };
    splitTableData();
  }, [data]);

  if (loading) {
    return <PortfolioSkeleton />;
  }

  const isEmptyData = data && 'empty' in data && data.empty;

  if (error || !data || isEmptyData || !portfolioPerformanceData) {
    return <ErrorMessage />;
  }

  return (
    <div data-testid={dataTestId}>
      <ContainerWithScroll>
        <StyledPortfolioPerformanceTable>
          {Object.entries(portfolioPerformanceData).map(
            ([key, item], index) => (
              <div
                key={key}
                style={{
                  minWidth: tableWidths[index],
                }}
              >
                <PortfolioPerformanceTable
                  data={item}
                  headerHeight={
                    includesHeaderHeight[index]
                      ? 2 * headerHeight - 6
                      : headerHeight
                  }
                  dataTestId={
                    dataTestId ? `${dataTestId}-table-${key}` : undefined
                  }
                  rowHeight={rowHeight}
                />
              </div>
            ),
          )}
        </StyledPortfolioPerformanceTable>
      </ContainerWithScroll>
    </div>
  );
};

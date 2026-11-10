import { useMemo } from 'react';

import { AgGridData, TableDataType } from 'components/Table/types';
import {
  getAllIds,
  splitGenericTable,
} from 'components/Table/utils/splitGenericTable';
import { transformAgGridData } from 'components/Table/utils/transformAgGridData';
import { GrowthLeagueTable } from 'pages/pillars/ValueCreation/GrowthLeague/components';
import { TABLE_WIDTHS } from 'pages/pillars/ValueCreation/GrowthLeague/constants';
import { TableContainer } from 'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles';

interface GridTableProps {
  data: AgGridData | TableDataType | null;
  leagueType: string;
  isBrandView?: boolean;
  dataTestId?: string;
}

const isTableData = (data: AgGridData | TableDataType): data is TableDataType =>
  'header' in data;

export const GridTable = ({
  data,
  leagueType,
  isBrandView = false,
  dataTestId,
}: GridTableProps) => {
  const firstSplitedTableIndex = 0;
  const secondSplitedTableIndex = 1;

  const splitGenericData = useMemo<Record<string, TableDataType>>(() => {
    if (!data) return {};

    const genericTable = isTableData(data) ? data : transformAgGridData(data);

    if (!genericTable || !data.splits) return {};

    return splitGenericTable(genericTable, data.splits);
  }, [data]);

  const allIds = useMemo(() => {
    if (!data) return [];

    const genericTable = isTableData(data) ? data : transformAgGridData(data);
    return getAllIds(genericTable.header);
  }, [data]);

  const getMinWidth = (index: number, leagueType: string): string => {
    const baseWidth = TABLE_WIDTHS[leagueType]?.[index] || 'auto';

    return baseWidth;
  };

  const getPositionStyle = (index: number) => {
    return index === firstSplitedTableIndex ? 'absolute' : 'relative';
  };

  const getMarginLeftStyle = (index: number, leagueType: string): string => {
    if (index === secondSplitedTableIndex) {
      const firstContainerWidth = getMinWidth(
        firstSplitedTableIndex,
        leagueType,
      );
      return `calc(${firstContainerWidth} + 16px)`;
    }
    return '0';
  };

  const getZIndexStyle = (index: number): number => {
    return index === firstSplitedTableIndex ? 10 : 1;
  };

  return (
    <TableContainer
      data-testid={
        dataTestId ? `grid-table-${leagueType}-${dataTestId}` : undefined
      }
      key={leagueType}
    >
      {Object.entries(splitGenericData).map(([key, item], index) => (
        <div
          data-testid={
            dataTestId
              ? `grid-table-section-${leagueType}-${key}-${dataTestId}`
              : undefined
          }
          key={leagueType + key}
          style={{
            minWidth: getMinWidth(index, leagueType),
            position: getPositionStyle(index),
            marginLeft: getMarginLeftStyle(index, leagueType),
            zIndex: getZIndexStyle(index),
            background: 'white',
            height: 'min-content',
          }}
        >
          <GrowthLeagueTable
            dataTestId={
              dataTestId
                ? `${dataTestId}-grid-table-${leagueType}-${key}`
                : undefined
            }
            data={item}
            allIds={allIds}
            isBrandView={isBrandView}
          />
        </div>
      ))}
    </TableContainer>
  );
};

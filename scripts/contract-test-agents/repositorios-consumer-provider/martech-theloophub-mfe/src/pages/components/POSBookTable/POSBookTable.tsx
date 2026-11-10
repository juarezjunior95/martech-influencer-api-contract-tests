import { useMemo } from 'react';

import { ColumnDefsConfig, Table } from 'components';
import { TableDataType } from 'components/Table/types';
import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';
import { NoDataAvailable } from 'pages/pillars/Category/POSBook/components';

import { SkeletonLoader } from './components/SkeletonLoader';
import { StyledPOSBookTableContainer } from './POSBookTable.styles';

interface POSTableProps {
  loading: boolean;
  data: (TableDataType & { empty?: boolean }) | null;
  config: ColumnDefsConfig;
  groupHeaderHeight?: number;
  rowHeight?: number;
  posKpi?: string;
  dataTestId?: string;
  isExport?: boolean;
}
const calculateColumnMaxValues = (
  rows: TableDataType['rows'],
): Record<string, number> => {
  const columnMaxValues: Record<string, number> = {};
  let globalMaxValue = 0;

  if (!rows) return columnMaxValues;

  rows.forEach((group) => {
    group.forEach((row) => {
      Object.entries(row).forEach(([columnKey, cellData]) => {
        if (
          cellData?.chartData?.data &&
          Array.isArray(cellData.chartData.data)
        ) {
          const maxValueInCell = Math.max(...cellData.chartData.data);
          columnMaxValues[columnKey] = Math.max(
            columnMaxValues[columnKey] || 0,
            maxValueInCell,
          );
          globalMaxValue = Math.max(globalMaxValue, maxValueInCell);
        }
      });
    });
  });

  Object.keys(columnMaxValues).forEach((columnKey) => {
    columnMaxValues[columnKey] = globalMaxValue;
  });

  return columnMaxValues;
};

const getDefaultRowHeight = (isExport: boolean) => (isExport ? 56 : 44);

export const POSBookTable: React.FC<POSTableProps> = ({
  loading,
  data,
  config,
  groupHeaderHeight = 64,
  rowHeight,
  posKpi,
  dataTestId,
  isExport = false,
}) => {
  const [isUSADisabled, isUSALoading] = useFeatureToggle(
    featureToggles.pillar.category.submenus.posBook.disableUsa,
  );

  const rows = useMemo(() => {
    if (isUSADisabled && !isUSALoading) {
      return data?.rows?.map((group) => {
        return group.filter((row) => {
          const rowData = row as Record<string, { value?: string }>;
          return rowData?.country?.value !== 'USA';
        });
      });
    }

    return data?.rows;
  }, [data, isUSADisabled, isUSALoading]);

  const columnMaxValues = useMemo(() => calculateColumnMaxValues(rows), [rows]);

  const computedRowHeight = rowHeight ?? getDefaultRowHeight(isExport);

  if (loading) {
    return <SkeletonLoader isExport={isExport} dataTestId={dataTestId} />;
  }

  if (!data || data.empty) {
    return <NoDataAvailable dataTestId={dataTestId} />;
  }

  return (
    <Table
      data={{ ...data, rows }}
      chartType="single-bar"
      headerHeight={0}
      groupHeaderHeight={groupHeaderHeight}
      scrollbarWidth={0}
      columnDefsConfig={config}
      rowHeight={computedRowHeight}
      style={StyledPOSBookTableContainer}
      emptyRow={{
        addOnStart: true,
      }}
      context={{ posKpi, columnMaxValues }}
      suppressColumnVirtualisation
      suppressRowVirtualisation
      dataTestId={dataTestId}
    />
  );
};

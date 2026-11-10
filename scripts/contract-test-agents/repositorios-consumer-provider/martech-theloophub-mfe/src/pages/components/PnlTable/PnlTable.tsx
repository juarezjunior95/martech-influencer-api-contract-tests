import { ColumnDefsConfig, Table, TableFilter } from 'components/Table/Table';
import { TableChartType, TableDataType } from 'components/Table/types';
import { useIsInExportPage } from 'hooks';

import { PnlSkeleton } from './components';
import { customRowHeight } from './config/helpers/helper';
import { tableConfigs as tableConfigsDefault } from './config/tableConfigs';
import { StyledPnlTable } from './PnlTable.styles';

interface PnlTableProps {
  data: TableDataType;
  loading?: boolean;
  filter?: TableFilter;
  tableView: string;
  chartType?: TableChartType;
  dataTestId?: string;
  rowHeight?: number;
  tableConfigs?: ColumnDefsConfig;
}

export const PnlTable: React.FC<PnlTableProps> = ({
  data,
  loading,
  filter,
  tableView,
  chartType = null,
  dataTestId,
  rowHeight,
  tableConfigs,
}) => {
  const isExportPage = useIsInExportPage();

  if (loading) {
    return (
      <PnlSkeleton
        dataTestId={dataTestId ? `${dataTestId}-skeleton` : undefined}
        isExportPage={isExportPage}
      />
    );
  }

  return (
    <Table
      data={data}
      columnDefsConfig={tableConfigs ?? tableConfigsDefault(isExportPage)}
      headerHeight={tableView === 'brands' ? 40 : 36}
      rowHeight={rowHeight ?? (isExportPage ? 24 : 36)}
      style={StyledPnlTable}
      filter={filter}
      getRowHeightCallback={(params) =>
        customRowHeight(params, tableView, isExportPage, rowHeight)
      }
      fixedHeight={isExportPage ? '762px' : ''}
      chartType={chartType}
      {...({ dataTestId } as Record<string, unknown>)}
    />
  );
};

import React from 'react';
import { useIntl } from 'react-intl';

import { Table } from 'components';
import { Skeleton } from 'components/Skeleton/Skeleton';
import { TableDataType } from 'components/Table/types';
import { usePageFilterApplied, useSubFilters } from 'hooks';
import { DeepDiveChartHeader } from 'pages/components/ConnectionsCreativity';

import { RESOURCE_ALLOCATION_MEDIA_PAGE_NAME } from '../../../../ResourceAllocationMedia';
import deepDiveConfig, {
  createGuidelineColumnConfig,
} from '../../config/tableConfig/tableConfig';
import { getDeepDiveHeaderMessage } from '../../utils';
import { StyledOverviewTable } from './TableView.styles';

interface TableViewProps {
  tableData: TableDataType;
  loadingTableBreakdown: boolean;
  selectedView?: string;
  dataTestId?: string;
}

export const TableView: React.FC<TableViewProps> = ({
  tableData,
  loadingTableBreakdown,
  selectedView,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { isGlobalZone } = usePageFilterApplied(
    RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
  );
  const { activeSubFilters } = useSubFilters();

  const tableHeaderMessage = getDeepDiveHeaderMessage({
    activeSubFilters,
    isGlobalZone,
    data: tableData,
    formatMessage,
    selectedView,
  });

  const dynamicTableConfig = {
    ...deepDiveConfig,
    guideline: createGuidelineColumnConfig(
      tableHeaderMessage.shouldShowGuidelineColumnTooltip,
      tableHeaderMessage.guidelineColumnTooltipMessage,
    ),
  };

  if (loadingTableBreakdown) {
    return (
      <Skeleton
        dataTestId={
          dataTestId ? `skeleton-s${dataTestId}-table-view` : undefined
        }
        length={1}
        width="100%"
        height="500px"
      />
    );
  }

  return (
    <>
      <DeepDiveChartHeader
        dataTestId={dataTestId}
        title={tableHeaderMessage.title}
        measure={tableHeaderMessage.measure}
        tooltip={tableHeaderMessage.tooltip}
      />
      {tableData && (
        <Table
          data={tableData}
          columnDefsConfig={dynamicTableConfig}
          headerHeight={36}
          rowHeight={36}
          style={StyledOverviewTable}
          dataTestId={dataTestId ? `${dataTestId}-table-view` : undefined}
        />
      )}
    </>
  );
};

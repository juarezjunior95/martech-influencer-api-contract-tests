import { ColumnDefsConfig, NoResultsState, TableFilter } from 'components';
import { FILTER_MODAL_NAME } from 'components/Filter';
import { TableDataType } from 'components/Table/types';
import { useScopedModal } from 'contexts';
import { usePageFilterApplied } from 'hooks';
import { PERFORMANCE_PAGE_NAME } from 'pages/pillars/PortfolioBrand/Performance/Performance';

import { PnlTable } from '../../PnlTable';

interface PnlTableProps {
  data: TableDataType;
  loading?: boolean;
  tableFilter?: TableFilter;
  dataTestId?: string;
  pageFilterPageName?: string;
  rowHeight?: number;
  tableConfigs?: ColumnDefsConfig;
  isExportPage?: boolean;
}

export const PnlBrands: React.FC<PnlTableProps> = ({
  data,
  loading,
  tableFilter,
  dataTestId,
  pageFilterPageName,
  rowHeight,
  tableConfigs,
}) => {
  const { open: openModal } = useScopedModal(FILTER_MODAL_NAME);
  const { isGlobalZone } = usePageFilterApplied(
    pageFilterPageName ?? PERFORMANCE_PAGE_NAME,
  );

  return (
    <div data-testid={dataTestId}>
      {isGlobalZone ? (
        <NoResultsState
          type={'brandPnl'}
          openModal={openModal}
          headerTitleId="PortfolioBrand.PortfolioPerformance.Pnl.noCountrySelectedTitle"
          descriptionId="PortfolioBrand.PortfolioPerformance.Pnl.noCountrySelectedDescription"
          buttonTextId="PortfolioBrand.PortfolioPerformance.Pnl.selectACountry"
        />
      ) : (
        <PnlTable
          data={data}
          loading={loading}
          filter={tableFilter}
          tableView="brands"
          chartType="standart-deviation"
          dataTestId={dataTestId ? `${dataTestId}-table` : undefined}
          rowHeight={rowHeight}
          tableConfigs={tableConfigs}
        />
      )}
    </div>
  );
};

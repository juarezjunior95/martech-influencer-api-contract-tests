import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';
import { CalendarClock } from '@hexa-ui/icons2';
import { BasicContainer, Select, Tag } from 'components';
import { CountryFlag } from 'components/Filter/components';
import { TableDataType } from 'components/Table/types';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { useLastDataRefresh } from 'contexts/LastDataRefresh/LastDataRefresh';
import { useBffData } from 'hooks';
import { FilterValue, Option } from 'models/Filters';
import { PnlBrands, PnlSkeleton, PnlTable } from 'pages/components/PnlTable';
import { KPI_GROUPS } from 'pages/constants';
import { StyledTooltip } from 'shared/Styles';
import { buildDataTestId } from 'utils';
import {
  getAllValuesForMultiSelect,
  revertValuesFilteredOnSelect,
} from 'utils/form';

import {
  deepDiveTableFilterOptions,
  PNL_TAB_NAME,
  portfolioTableFilterOptions,
} from './constants';
import { usePnlSubFilters } from './hooks/usePnlSubFilters';
import { StyledRightContent } from './Pnl.styles';

const VIEW_TYPES = {
  PORTFOLIO: 'portfolio',
  DEEP_DIVE: 'deep_dive',
  BRANDS: 'brands',
} as const;

interface PnlProps {
  dataTestId?: string;
  pageName?: string;
}

export const Pnl: React.FC<PnlProps> = ({ dataTestId, pageName }) => {
  useDataRefreshForTab(PNL_TAB_NAME);
  const { formatMessage } = useIntl();
  const [selectedView, setSelectedView] = useState<string>(
    VIEW_TYPES.PORTFOLIO,
  );
  const [selectedColumns, setSelectedColumns] = useState<FilterValue[]>([]);

  const { lastDataRefreshKpisFormated, lastDataRefreshKpisDateMonthYear } =
    useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshKpisFormated?.finance;

  const pnlSubFilters = usePnlSubFilters({
    lastDataRefreshKpisDateMonthYear,
    pageName,
  });

  const { data: pnlData, loading: pnlDataLoading } = useBffData({
    id: 'value-creation_portfolio-performance_pl',
    kpiGroup: KPI_GROUPS.finance,
    subFilters: pnlSubFilters,
  });

  const pnlPortfolioData = useMemo(() => {
    return pnlData?.['plPortfolio'] ?? null;
  }, [pnlData]);

  const pnlDeepDiveData = useMemo(() => {
    return pnlData?.['plDeepDive'] ?? null;
  }, [pnlData]);

  const brandsData = useMemo(() => {
    return pnlData?.['plBrand'] ?? null;
  }, [pnlData]);

  const multiSelectOptions = useMemo(() => {
    if (selectedView === VIEW_TYPES.PORTFOLIO)
      return portfolioTableFilterOptions;
    if (selectedView === VIEW_TYPES.DEEP_DIVE)
      return deepDiveTableFilterOptions;
    return [];
  }, [selectedView]);

  useEffect(() => {
    const flatOptions = multiSelectOptions
      .flatMap((group) => group.values)
      .flatMap((op) => op.value);
    setSelectedColumns(flatOptions);
  }, [multiSelectOptions]);

  const tableFilter = useMemo(() => {
    if (multiSelectOptions.length === 0) {
      return {
        allFieldsToFilter: [],
        fieldsToHide: [],
      };
    }

    const allFieldsToFilter = getAllValuesForMultiSelect(multiSelectOptions);
    const newTableFilter = {
      allFieldsToFilter,
      fieldsToHide: revertValuesFilteredOnSelect(
        selectedColumns,
        allFieldsToFilter,
      ),
    };

    return newTableFilter;
  }, [multiSelectOptions, selectedColumns]);

  const handleMultiSelectChange = (op: Option[]) => {
    setSelectedColumns(op.map((item) => item.value));
  };

  return (
    <BasicContainer
      dataTestId={buildDataTestId('', dataTestId, 'tabpanel-pnl')}
      header={{
        title: formatMessage({
          id: 'PortfolioBrand.PortfolioPerformance.Pnl.title',
          defaultMessage: 'P&L',
        }),
        subtitle: '[Beer + Adj]',
        titleSize: 'H2',
        tooltip: (
          <StyledTooltip
            data-testid={buildDataTestId('tabpanel-pnl-tooltip', dataTestId)}
            size="small"
          >
            {formatMessage({
              id: 'PortfolioBrand.PortfolioPerformance.Pnl.tooltip',
              defaultMessage: '',
            })}
          </StyledTooltip>
        ),
        rightContent: (
          <StyledRightContent>
            <SegmentedControl
              data-testid={buildDataTestId(
                'tabpanel-pnl-view-selector',
                dataTestId,
              )}
              options={[
                {
                  value: VIEW_TYPES.PORTFOLIO,
                  label: formatMessage({ id: 'Label.portfolio' }),
                },
                {
                  value: VIEW_TYPES.DEEP_DIVE,
                  label: formatMessage({ id: 'Label.deepDive' }),
                },
                {
                  value: VIEW_TYPES.BRANDS,
                  label: formatMessage({ id: 'Label.brands' }),
                },
              ]}
              onValueChange={setSelectedView}
            />

            <Select
              dataTestId={buildDataTestId(
                '',
                dataTestId,
                'tabpanel-pnl-table-customization',
              )}
              id="pnl-table-customization"
              options={multiSelectOptions}
              value={selectedColumns as string[]}
              valueLabel={formatMessage({
                id: 'PortfolioBrand.PortfolioPerformance.Pnl.tableCustomization',
              })}
              onValueChange={handleMultiSelectChange}
              multiple
              shape="pill"
              size="medium"
            />

            <CountryFlag
              dataTestId={buildDataTestId(
                '',
                dataTestId,
                'tabpanel-pnl-right-content',
              )}
            />
          </StyledRightContent>
        ),
        bottomTag:
          selectedView !== VIEW_TYPES.BRANDS && lastDataRefresh ? (
            <Tag
              dataTestId={buildDataTestId(
                '',
                dataTestId,
                'tabpanel-pnl-bottom-tag',
              )}
              Icon={CalendarClock}
              text={`: ${lastDataRefresh}`}
            />
          ) : null,
      }}
    >
      {selectedView === VIEW_TYPES.PORTFOLIO && (
        <PnlTable
          dataTestId={buildDataTestId(
            '',
            dataTestId,
            'tabpanel-pnl-overview-table',
          )}
          key="pnlOverviewTable"
          loading={pnlDataLoading}
          data={pnlPortfolioData as TableDataType}
          filter={tableFilter}
          tableView={selectedView}
        />
      )}

      {selectedView === VIEW_TYPES.DEEP_DIVE && (
        <PnlTable
          dataTestId={buildDataTestId(
            '',
            dataTestId,
            'tabpanel-pnl-deep-dive-table',
          )}
          key="pnlDeepDiveTable"
          loading={pnlDataLoading}
          data={pnlDeepDiveData as TableDataType}
          filter={tableFilter}
          tableView={selectedView}
        />
      )}

      {selectedView === VIEW_TYPES.BRANDS &&
        (pnlDataLoading ? (
          <PnlSkeleton
            dataTestId={buildDataTestId(
              '',
              dataTestId,
              'tabpanel-pnl-skeleton',
            )}
          />
        ) : (
          <PnlBrands
            dataTestId={buildDataTestId(
              '',
              dataTestId,
              'tabpanel-pnl-brands-table',
            )}
            key="pnlBrandsTable"
            loading={pnlDataLoading}
            data={brandsData as TableDataType}
            tableFilter={tableFilter}
          />
        ))}
    </BasicContainer>
  );
};

export default Pnl;

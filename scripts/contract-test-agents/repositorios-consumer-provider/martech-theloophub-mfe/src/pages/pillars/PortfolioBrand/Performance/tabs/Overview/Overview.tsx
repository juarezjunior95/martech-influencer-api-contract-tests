import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { BasicContainer } from 'components';
import { CountryFlag } from 'components/Filter/components';
import { TableDataType } from 'components/Table/types';
import { splitGenericTable } from 'components/Table/utils';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { FilterDataAccessor } from 'domain/Filter';
import { useBffData, usePageFilterApplied, usePageFilterData } from 'hooks';
import { PortfolioPerformance } from 'pages/components';
import { getJanuaryFirstYmdFromDtEnd } from 'utils/date';
import { getViewtype, normalizeFilters } from 'utils/filter';

import { PERFORMANCE_PAGE_NAME } from '../../Performance';

const subtitleBeerAdj = '[Beer + Adj]';

interface OverviewProps {
  dataTestId?: string;
}

export const Overview: React.FC<OverviewProps> = ({ dataTestId }) => {
  useDataRefreshForTab('Portfolio Performance - Overview');
  const { applied } = usePageFilterApplied(PERFORMANCE_PAGE_NAME);
  const { dataFilters } = usePageFilterData(PERFORMANCE_PAGE_NAME);
  const { lastDataRefreshKpisDateMonthYear } = useLastDataRefresh();
  const { formatMessage } = useIntl();

  const overviewSubFilters = useMemo(() => {
    const dt_ini = FilterDataAccessor.getInstance().getTimeFrame(
      dataFilters,
      'ini',
    );
    const volume_dt_end = lastDataRefreshKpisDateMonthYear?.volume;
    const finance_dt_end = lastDataRefreshKpisDateMonthYear?.finance;
    const market_share_dt_end = lastDataRefreshKpisDateMonthYear?.market_share;
    const power_dt_end = lastDataRefreshKpisDateMonthYear?.power;
    const pos_dt_end = lastDataRefreshKpisDateMonthYear?.pos;
    const is_period_ytd_applied = applied?.['ytd-month'] === 'YTD';

    const normalized = normalizeFilters(applied);
    const { zone, country } = normalized;
    const viewtype = getViewtype(normalized?.country);

    if (!dt_ini || !volume_dt_end || zone == null || country == null) {
      return null;
    }

    const baseFilter = {
      viewtype,
      dt_ini: is_period_ytd_applied
        ? getJanuaryFirstYmdFromDtEnd(finance_dt_end)
        : finance_dt_end,
      dt_end: finance_dt_end,
      zone,
      country,
      period: applied?.['ytd-month'],
    };

    const marketShareFilter = {
      ...baseFilter,
      dt_ini: is_period_ytd_applied
        ? getJanuaryFirstYmdFromDtEnd(market_share_dt_end)
        : market_share_dt_end,
      dt_end: market_share_dt_end,
    };

    const powerFilter = {
      ...baseFilter,
      dt_ini: is_period_ytd_applied
        ? getJanuaryFirstYmdFromDtEnd(power_dt_end)
        : power_dt_end,
      dt_end: power_dt_end,
    };

    const posFilter = {
      ...baseFilter,
      dt_ini: is_period_ytd_applied
        ? getJanuaryFirstYmdFromDtEnd(pos_dt_end)
        : pos_dt_end,
      dt_end: pos_dt_end,
    };

    return {
      dt_ini: is_period_ytd_applied ? dt_ini : volume_dt_end,
      finance: baseFilter,
      market_share: marketShareFilter,
      power: powerFilter,
      pos: posFilter,
    };
  }, [applied, dataFilters, lastDataRefreshKpisDateMonthYear]);

  const {
    data: portfolioPerformance,
    loading: portfolioPerformanceLoading,
    error: portfolioPerformanceError,
  } = useBffData({
    id: 'value-creation_portfolio-performance_overview_overview',
    kpiGroup: 'volume',
    subFilters: overviewSubFilters,
  });

  const portfolioPerformanceData = useMemo(() => {
    const rawData = portfolioPerformance?.['portfolioPerformance'] ?? null;

    const splitTableData = splitGenericTable(
      rawData as TableDataType,
      rawData?.splits ?? [],
    );

    return splitTableData;
  }, [portfolioPerformance]);

  return (
    <div
      data-testid={dataTestId ? `tabpanel-overview-${dataTestId}` : undefined}
      className="overview"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <BasicContainer
        dataTestId={
          dataTestId
            ? `${dataTestId}-tabpanel-overview-portfolio-performance`
            : undefined
        }
        header={{
          title: formatMessage({
            id: 'PortfolioBrand.PortfolioPerformance.PortfolioPerformance.title',
            defaultMessage: '',
          }),
          titleSize: 'H2',
          subtitle: subtitleBeerAdj,
          rightContent: (
            <div>
              <CountryFlag />
            </div>
          ),
        }}
      >
        <PortfolioPerformance
          dataTestId={
            dataTestId
              ? `${dataTestId}-tabpanel-overview-portfolio-performance`
              : undefined
          }
          data={portfolioPerformanceData}
          error={portfolioPerformanceError}
          loading={portfolioPerformanceLoading}
        />
      </BasicContainer>
    </div>
  );
};

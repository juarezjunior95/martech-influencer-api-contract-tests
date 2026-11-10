import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import { CalendarClock } from '@hexa-ui/icons';
import { BasicContainer, CountryFlag, Tag } from 'components';
import { SubFilterSelect } from 'components/SubFilter/components/SubFilterSelect';
import { useLastDataRefresh } from 'contexts';
import {
  useBffData,
  useCurrentPage,
  usePageFilterApplied,
  usePageFilterStatus,
  useSubFilters,
} from 'hooks';
import { StyledTooltip } from 'shared/Styles';

import { BigNumbers } from '../Overview/components/BigNumbers/BigNumbers';
import { BigNumbersItem } from '../Overview/types';
import { InnovationPerfomance } from './components/InnovationPerfomance/InnovationPerfomance';
import { InnovationPerformanceData } from './types';

interface PerformanceAndBreakdownProps {
  dataTestId?: string;
}

export const PerformanceAndBreakdown: React.FC<
  PerformanceAndBreakdownProps
> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();

  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshKpisFormated?.innovation;
  const { currentPage } = useCurrentPage();
  const { applied: appliedFilters } = usePageFilterApplied(currentPage);
  const { isLoading: filtersLoading } = usePageFilterStatus(currentPage);
  const { activeSubFilters, setSubFilterValue } = useSubFilters();
  const { kpi } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  const location = useLocation();

  const kpiFilter: Record<string, string[]> = {
    volume: ['volume', 'volumeMix'],
    nr: ['nr'],
    maco: ['maco'],
  };

  const performanceAndBreakdownData = useBffData({
    id: 'innovation_innovation_performance-breakdown_overview',
    kpiGroup: 'innovation',
    subFilters: {
      country: appliedFilters.country,
      zone: appliedFilters.zone,
    },
    skipRequest: filtersLoading,
  });

  const bigNumbersData =
    (performanceAndBreakdownData.data?.['big-numbers'] as BigNumbersItem[]) ||
    [];

  const performanceVolumeData =
    (performanceAndBreakdownData.data?.[
      'performance-volume'
    ] as InnovationPerformanceData) || undefined;

  const performanceNrData =
    (performanceAndBreakdownData.data?.[
      'performance-nr'
    ] as InnovationPerformanceData) || undefined;

  const performanceMacoData =
    (performanceAndBreakdownData.data?.[
      'performance-maco'
    ] as InnovationPerformanceData) || undefined;

  const breakdownVolumeData =
    (performanceAndBreakdownData.data?.[
      'breakdown-volume'
    ] as InnovationPerformanceData) || undefined;

  const breakdownNrData =
    (performanceAndBreakdownData.data?.[
      'breakdown-nr'
    ] as InnovationPerformanceData) || undefined;

  const breakdownMacoData =
    (performanceAndBreakdownData.data?.[
      'breakdown-maco'
    ] as InnovationPerformanceData) || undefined;

  useEffect(() => {
    if (kpi && kpi !== activeSubFilters.kpis) {
      setSubFilterValue('kpis', kpi);
    }
  }, [kpi, activeSubFilters.kpis, setSubFilterValue]);

  useEffect(() => {
    if (
      location.pathname.includes('performance-and-breakdown') &&
      activeSubFilters.kpis &&
      activeSubFilters.kpis !== kpi
    ) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('kpi', activeSubFilters.kpis as string);
        return newParams;
      });
    }
  }, [activeSubFilters.kpis, kpi, setSearchParams, location.pathname]);

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.title',
        }),
        rightContent: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SubFilterSelect
              name="kpis"
              apiKey="kpis_innovation"
              dataApiKey="kpis"
              stateKey="kpis"
              params={{}}
              loading={filtersLoading}
              dataTestId={
                dataTestId ? `${dataTestId}-subfilter-select` : undefined
              }
            />
            <div
              style={{ width: 1, height: 40, backgroundColor: '#C8C6C8' }}
              data-testid={dataTestId ? `${dataTestId}-divider` : undefined}
            />
            <CountryFlag
              dataTestId={dataTestId ? `${dataTestId}-country-flag` : undefined}
            />
          </div>
        ),
        tooltip: (
          <StyledTooltip
            size="small"
            data-testid={dataTestId ? `${dataTestId}-tooltip` : undefined}
          >
            {formatMessage({
              id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.tooltip',
            })}
          </StyledTooltip>
        ),
        titleSize: 'H2',
        bottomTag: lastDataRefresh ? (
          <Tag Icon={CalendarClock} text={`: ${lastDataRefresh}`} />
        ) : null,
      }}
      layout={{
        border: 'small',
        shadow: 'small',
        bodyPadding: false,
      }}
      dataTestId={dataTestId ? `${dataTestId}-container` : undefined}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          padding: '0 24px 24px 24px',
        }}
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
      >
        <BigNumbers
          data={bigNumbersData}
          loading={performanceAndBreakdownData.loading}
          kpiFilter={kpiFilter}
          orientation={{ header: 'horizontal', body: 'vertical' }}
          dataTestId={dataTestId ? `${dataTestId}-big-numbers` : undefined}
        />

        <InnovationPerfomance
          performanceData={{
            volume: performanceVolumeData,
            nr: performanceNrData,
            maco: performanceMacoData,
          }}
          breakdownData={{
            volume: breakdownVolumeData,
            nr: breakdownNrData,
            maco: breakdownMacoData,
          }}
          loading={performanceAndBreakdownData.loading}
          dataTestId={
            dataTestId ? `${dataTestId}-innovation-performance` : undefined
          }
        />
      </div>
    </BasicContainer>
  );
};

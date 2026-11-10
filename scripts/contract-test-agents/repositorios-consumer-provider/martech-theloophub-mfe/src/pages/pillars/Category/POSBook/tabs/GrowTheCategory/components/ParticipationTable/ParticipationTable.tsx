import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { SubFilter } from 'components';
import { useLastDataRefresh } from 'contexts';
import { usePageFilterApplied, useSubFilters } from 'hooks';
import { POSBookTable } from 'pages/components';
import { POS_BOOK_PAGE_NAME } from 'pages/pillars/Category/POSBook/POSBook';
import { normalizeString } from 'utils/format';
import { vsLastYearByTimePeriod } from 'utils/timePeriod';

import { TableHeader } from '../../../../components';
import {
  COHORTS_KEY,
  DEFAULT_POS_KPI,
  POS_KPI_KEY,
  TRANSLATION_KEY_PREFIX,
  VIEW_TYPES,
} from '../../constants';
import { useGrowTheCategoryData } from '../../hooks/useGrowTheCategoryData';
import { ParticipationViewType } from '../../types';
import { getPOSBookTableConfig } from '../../utils';
import {
  StyledParticipationTableContainer,
  StyledParticipationTableHeaderContainer,
} from './ParticipationTable.styles';

interface ParticipationTableProps {
  selectedView: string;
  hasPosKpi?: boolean;
  dataTestId?: string;
}

export const ParticipationTable: React.FC<ParticipationTableProps> = ({
  selectedView,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { lastDataRefreshKpisDate } = useLastDataRefresh();
  const { activeSubFilters } = useSubFilters();
  const { applied } = usePageFilterApplied(POS_BOOK_PAGE_NAME);

  const timePeriod = useMemo(() => applied?.pos_periods, [applied]);

  const vsLastYearDataRefresh = useMemo(() => {
    return vsLastYearByTimePeriod(lastDataRefreshKpisDate?.pos, timePeriod);
  }, [lastDataRefreshKpisDate, timePeriod]);

  const posKpi = useMemo(() => {
    return (activeSubFilters?.[POS_KPI_KEY] || DEFAULT_POS_KPI) as string;
  }, [activeSubFilters]);

  const filterCohort = useMemo(() => {
    return activeSubFilters?.[COHORTS_KEY] || '';
  }, [activeSubFilters]);

  const { participationData, loading } = useGrowTheCategoryData(
    selectedView as ParticipationViewType,
  );

  const hasCohortFilter = useMemo(() => {
    return selectedView !== VIEW_TYPES.COHORT;
  }, [selectedView]);

  const formattedData = useMemo(() => {
    return participationData || null;
  }, [participationData]);

  const title = useMemo(() => {
    const normalizedKpi = normalizeString(posKpi, 'Pascal');
    const viewTitle = formatMessage({
      id: `${TRANSLATION_KEY_PREFIX}.${selectedView}.title`,
    });

    return `${normalizedKpi} ${viewTitle}`;
  }, [posKpi, selectedView, formatMessage]);

  const tableConfig = useMemo(() => {
    return getPOSBookTableConfig(selectedView);
  }, [selectedView]);

  return (
    <StyledParticipationTableContainer
      data-testid={dataTestId ? `table-${dataTestId}` : undefined}
    >
      <StyledParticipationTableHeaderContainer
        data-testid={
          dataTestId ? `table-header-container-${dataTestId}` : undefined
        }
      >
        <TableHeader
          title={title}
          lastDataRefresh={vsLastYearDataRefresh}
          dataTestId={dataTestId}
          filters={
            <>
              <SubFilter.Select
                apiKey="pos-kpi"
                stateKey={POS_KPI_KEY}
                valueLabel="POS KPI"
                chips
                clearChips={false}
              />
              {hasCohortFilter && (
                <SubFilter.Select
                  apiKey="cohorts"
                  stateKey={COHORTS_KEY}
                  value={filterCohort === 'All' ? '' : filterCohort}
                  valueLabel={
                    filterCohort === 'All' ? 'Select a Cohort' : 'Cohort'
                  }
                  placeholder=""
                  chips
                />
              )}
            </>
          }
        />
      </StyledParticipationTableHeaderContainer>

      <POSBookTable
        loading={loading}
        data={formattedData}
        config={tableConfig}
        posKpi={posKpi}
        dataTestId={dataTestId}
      />
    </StyledParticipationTableContainer>
  );
};

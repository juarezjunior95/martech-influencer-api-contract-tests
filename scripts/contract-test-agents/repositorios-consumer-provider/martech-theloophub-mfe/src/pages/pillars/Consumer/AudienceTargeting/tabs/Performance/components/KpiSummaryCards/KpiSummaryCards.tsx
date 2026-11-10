import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLastDataRefresh } from 'contexts/LastDataRefresh/LastDataRefresh';
import { formatDateToQuarterYear } from 'utils/format';

import { KpiCard } from './components/KpiCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { StyledKpiSummaryCards } from './KpiSummaryCards.styles';
import { KpiSummaryCardsProps } from './types';

export const KpiSummaryCards = ({
  data,
  defaultSelected = 'participation',
  onSelectionChange,
  loading,
  dataTestId,
}: KpiSummaryCardsProps) => {
  const { lastDataRefreshKpisDate } = useLastDataRefresh();

  const formattedDate = useMemo(() => {
    return formatDateToQuarterYear(lastDataRefreshKpisDate?.pos);
  }, [lastDataRefreshKpisDate]);

  const [selectedKpi, setSelectedKpi] = useState<string>(defaultSelected);

  useEffect(() => {
    setSelectedKpi(defaultSelected);
  }, [defaultSelected]);

  const handleSelectKpi = useCallback(
    (id: string) => {
      setSelectedKpi(id);
      onSelectionChange?.(id);
    },
    [onSelectionChange],
  );

  return (
    <StyledKpiSummaryCards
      data-testid={
        dataTestId ? `${dataTestId}-kpi-summary-cards` : 'kpi-summary-cards'
      }
    >
      {loading ? (
        <LoadingSkeleton dataTestId={dataTestId} />
      ) : (
        data.map((item) => (
          <KpiCard
            key={item.id}
            data={item}
            isSelected={selectedKpi === item.id}
            onSelect={handleSelectKpi}
            period={formattedDate}
          />
        ))
      )}
    </StyledKpiSummaryCards>
  );
};

import { useCallback, useEffect } from 'react';

import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { usePageFilterApplied, usePageFilterManagement } from 'hooks';

import {
  AudienceTargetingError,
  FILTER_CONFIG_PERFORMANCE,
} from '../../constants';
import { Breakdown, CoreAudiencePerformance } from './components';
import { BreakdownTier, BreakdownVariant } from './components/Breakdown/types';
import { KpiSummaryCardData } from './components/KpiSummaryCards/types';
import { PerformanceContainer } from './Performance.styles';

const KPI_MAP: Array<[cardId: string, filterValue: string]> = [
  ['participation', 'p4w'],
  ['occasions', 'occasion'],
  ['brandPower', 'power'],
];

const KPI_CARD_TO_FILTER = Object.fromEntries(KPI_MAP);
const FILTER_TO_KPI_CARD = Object.fromEntries(
  KPI_MAP.map(([card, filter]) => [filter, card]),
);
const FILTER_TO_BREAKDOWN_VARIANT: Record<string, BreakdownVariant> = {
  p4w: 'p4w',
  occasion: 'occasions',
  power: 'power',
};

const isKpiCardEmpty = (card: KpiSummaryCardData | undefined): boolean =>
  card == null || card.empty === true;

interface PerformanceProps {
  dataTestId?: string;
  audiencePerformanceData?: KpiSummaryCardData[];
  participationBreakdownData?: BreakdownTier[];
  audiencePerformanceError?: Error | null;
  isAudienceLoading?: boolean;
  isBreakdownLoading?: boolean;
  breakdownError?: Error | null;
}

export const Performance = ({
  dataTestId,
  audiencePerformanceData,
  participationBreakdownData,
  audiencePerformanceError,
  isAudienceLoading,
  isBreakdownLoading,
  breakdownError,
}: PerformanceProps) => {
  useDataRefreshForTab('Audience Targeting - Performance');

  const { applied } = usePageFilterApplied(FILTER_CONFIG_PERFORMANCE.pageName);
  const { updateForm, apply } = usePageFilterManagement(
    FILTER_CONFIG_PERFORMANCE.pageName,
  );

  const handleKpiSelectionChange = useCallback(
    (cardId: string) => {
      const filterValue = KPI_CARD_TO_FILTER[cardId] ?? cardId;
      updateForm('kpis', filterValue);
      apply();
    },
    [updateForm, apply],
  );

  useEffect(() => {
    if (isAudienceLoading) return;
    const cards = audiencePerformanceData;
    if (!cards?.length) return;

    const currentCardId =
      FILTER_TO_KPI_CARD[String(applied.kpis)] ?? 'participation';
    const currentCard = cards.find((c) => c.id === currentCardId);

    if (!isKpiCardEmpty(currentCard)) return;

    const fallback = cards.find((c) => !isKpiCardEmpty(c));
    if (!fallback || fallback.id === currentCardId) return;

    const filterValue = KPI_CARD_TO_FILTER[fallback.id] ?? fallback.id;
    updateForm('kpis', filterValue);
    apply();
  }, [
    isAudienceLoading,
    audiencePerformanceData,
    applied.kpis,
    updateForm,
    apply,
  ]);

  const currentKpiFilter = (applied.kpis as string) ?? 'p4w';
  const defaultSelectedCard =
    FILTER_TO_KPI_CARD[currentKpiFilter] ?? 'participation';

  const error = audiencePerformanceError ?? breakdownError ?? null;

  const isCompetitorWithoutData =
    error?.message === AudienceTargetingError.CompetitorWithoutData;

  return (
    <PerformanceContainer>
      <CoreAudiencePerformance
        data={audiencePerformanceData ?? []}
        isLoading={isAudienceLoading}
        dataTestId={`${dataTestId}-brand-audience`}
        defaultSelected={defaultSelectedCard}
        onSelectionChange={handleKpiSelectionChange}
        error={
          isCompetitorWithoutData ? null : (audiencePerformanceError ?? null)
        }
        competitorWithoutData={isCompetitorWithoutData}
      />
      <Breakdown
        variant={FILTER_TO_BREAKDOWN_VARIANT[String(applied.kpis)] ?? 'p4w'}
        isLoading={isBreakdownLoading ?? false}
        error={isCompetitorWithoutData ? null : (breakdownError ?? null)}
        data={participationBreakdownData ?? []}
        dataTestId={`${dataTestId}-participation-breakdown`}
        competitorWithoutData={isCompetitorWithoutData}
      />
    </PerformanceContainer>
  );
};

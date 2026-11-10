import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { DataStateHandler } from 'components';
import { useMediaQuery } from 'hooks';
import {
  getKpiOverviewCardSkeletonProps,
  KpiOverviewCard,
} from 'pages/components/KpiOverviewCard';

import {
  INNOVATION_HUB_KPIS_CHART_COLORS,
  INNOVATION_HUB_TOTAL_PERFORMANCE_EMPTY_DESCRIPTION_I18N_ID,
  INNOVATION_HUB_TOTAL_PERFORMANCE_EMPTY_TITLE_I18N_ID,
  INNOVATION_HUB_TOTAL_PERFORMANCE_ERROR_DESCRIPTION_I18N_ID,
  INNOVATION_HUB_TOTAL_PERFORMANCE_ERROR_TITLE_I18N_ID,
  INNOVATION_HUB_TOTAL_PERFORMANCE_TOOLTIP_IDS,
  KPI_OVERVIEW_CARD_VARIATION_INNOVATION_HUB,
} from '../../constants';
import { useInnovationHubKpiPresetCardIds } from '../../hooks/useInnovationHubKpiPresetCardIds/useInnovationHubKpiPresetCardIds';
import { useInnovationHubOverviewData } from '../../hooks/useInnovationHubOverviewData/useInnovationHubOverviewData';
import { useInnovationHubPerformanceBreakdownNavigation } from '../../hooks/useInnovationHubPerformanceBreakdownNavigation/useInnovationHubPerformanceBreakdownNavigation';
import { StyledMainCardsGrid } from './TotalInnovationPerformance.styles';

interface TotalInnovationPerformanceProps {
  dataTestId?: string;
}

export const TotalInnovationPerformance: React.FC<
  TotalInnovationPerformanceProps
> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();
  const { orderedCardIds, navigableCardIds } =
    useInnovationHubKpiPresetCardIds();
  const { resolveOnClick } =
    useInnovationHubPerformanceBreakdownNavigation(navigableCardIds);
  const { view, mainCards } = useInnovationHubOverviewData();
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const isDesktopXLarge = useMediaQuery('(min-width: 1920px)');

  const prefix = dataTestId ?? 'innovation-hub-total-innovation-performance';

  const getTooltip = useCallback(
    (cardId: string) => {
      const id = INNOVATION_HUB_TOTAL_PERFORMANCE_TOOLTIP_IDS[cardId];
      return id ? formatMessage({ id }) : cardId;
    },
    [formatMessage],
  );

  const stateMessage = useMemo(() => {
    if (view === 'error') {
      return {
        title: formatMessage({
          id: INNOVATION_HUB_TOTAL_PERFORMANCE_ERROR_TITLE_I18N_ID,
        }),
        description: formatMessage({
          id: INNOVATION_HUB_TOTAL_PERFORMANCE_ERROR_DESCRIPTION_I18N_ID,
        }),
      };
    }
    if (view === 'empty') {
      return {
        title: formatMessage({
          id: INNOVATION_HUB_TOTAL_PERFORMANCE_EMPTY_TITLE_I18N_ID,
        }),
        description: formatMessage({
          id: INNOVATION_HUB_TOTAL_PERFORMANCE_EMPTY_DESCRIPTION_I18N_ID,
        }),
      };
    }
    return undefined;
  }, [formatMessage, view]);

  const cardIdsWithData = useMemo(() => {
    if (!mainCards) {
      return [];
    }
    return orderedCardIds.filter((id) => mainCards[id] != null);
  }, [mainCards, orderedCardIds]);

  const kpiSkeletonProps = useMemo(
    () =>
      getKpiOverviewCardSkeletonProps(
        isDesktopXLarge,
        isDesktopLarge,
        KPI_OVERVIEW_CARD_VARIATION_INNOVATION_HUB,
      ),
    [isDesktopLarge, isDesktopXLarge],
  );

  return (
    <StyledMainCardsGrid data-testid={`${prefix}-grid`}>
      <DataStateHandler
        loading={view === 'loading'}
        error={view === 'error'}
        empty={view === 'empty'}
        dataTestId={prefix}
        message={stateMessage}
        skeletonProps={kpiSkeletonProps}
      >
        {view === 'ready' && mainCards
          ? cardIdsWithData.map((cardId) => (
              <KpiOverviewCard
                key={cardId}
                dataTestId={`${prefix}-kpi-${cardId}`}
                variation={KPI_OVERVIEW_CARD_VARIATION_INNOVATION_HUB}
                data={mainCards[cardId]}
                tooltip={getTooltip(cardId)}
                chartColors={INNOVATION_HUB_KPIS_CHART_COLORS}
                onClick={resolveOnClick(cardId)}
              />
            ))
          : null}
      </DataStateHandler>
    </StyledMainCardsGrid>
  );
};

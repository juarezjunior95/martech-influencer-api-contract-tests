import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { innovationHubMainCardsMock } from '../../../../__mocks__/innovationHubTestFixtures';
import {
  INNOVATION_HUB_OVERVIEW_KPI_DATA_NOT_AVAILABLE_I18N_ID,
  INNOVATION_HUB_OVERVIEW_MOCK_FORCE_EMPTY_STATE,
  INNOVATION_HUB_OVERVIEW_MOCK_FORCE_SKELETON_STATE,
} from '../../constants';
import type {
  InnovationHubMainCards,
  InnovationHubOverviewMockDataResult,
} from '../../types';
import { mapInnovationHubMainCardsToEmptyNotice } from '../../utils/mapInnovationHubMainCardsToEmptyNotice';

export function useInnovationHubOverviewMockData(): InnovationHubOverviewMockDataResult {
  const { formatMessage } = useIntl();

  return useMemo((): InnovationHubOverviewMockDataResult => {
    if (INNOVATION_HUB_OVERVIEW_MOCK_FORCE_SKELETON_STATE) {
      return {
        view: 'loading',
        mainCards: null,
        refetch: () => Promise.resolve(),
      };
    }

    const mainCards: InnovationHubMainCards =
      INNOVATION_HUB_OVERVIEW_MOCK_FORCE_EMPTY_STATE
        ? mapInnovationHubMainCardsToEmptyNotice(
            innovationHubMainCardsMock,
            formatMessage({
              id: INNOVATION_HUB_OVERVIEW_KPI_DATA_NOT_AVAILABLE_I18N_ID,
            }),
          )
        : innovationHubMainCardsMock;

    return {
      view: 'ready',
      mainCards,
      refetch: () => Promise.resolve(),
    };
  }, [formatMessage]);
}

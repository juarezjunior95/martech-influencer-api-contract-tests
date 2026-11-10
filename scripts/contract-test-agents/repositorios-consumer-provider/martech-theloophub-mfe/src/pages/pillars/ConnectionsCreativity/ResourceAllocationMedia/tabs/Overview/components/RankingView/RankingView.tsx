import { useIntl } from 'react-intl';

import { Skeleton } from 'components/Skeleton/Skeleton';
import { usePageFilterApplied, useSubFilters } from 'hooks';
import {
  DeepDiveChartHeader,
  RankingChart,
} from 'pages/components/ConnectionsCreativity';

import { RESOURCE_ALLOCATION_MEDIA_PAGE_NAME } from '../../../../ResourceAllocationMedia';
import { ResourceAllocationData } from '../../types';
import { getDeepDiveHeaderMessage } from '../../utils';

interface RankingViewProps {
  data: ResourceAllocationData;
  loadingRanking: boolean;
  selectedView?: string;
  dataTestId?: string;
}

export const RankingView: React.FC<RankingViewProps> = ({
  data,
  loadingRanking,
  selectedView,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { isGlobalZone } = usePageFilterApplied(
    RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
  );
  const { activeSubFilters } = useSubFilters();

  const rankingHeaderMessage = getDeepDiveHeaderMessage({
    activeSubFilters,
    isGlobalZone,
    data,
    formatMessage,
    selectedView,
  });

  if (loadingRanking) {
    return (
      <Skeleton
        length={1}
        width="100%"
        height="450px"
        dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
      />
    );
  }

  return (
    <>
      <DeepDiveChartHeader
        title={rankingHeaderMessage.title}
        measure={rankingHeaderMessage.measure}
        tooltip={rankingHeaderMessage.tooltip}
        dataTestId={
          dataTestId ? `${dataTestId}-ranking-view-header` : undefined
        }
      />

      <RankingChart
        data={data}
        labelIconTooltip={rankingHeaderMessage.labelIconTooltip}
        horizontalDashedLineTooltip={
          rankingHeaderMessage.horizontalDashedLineTooltip
        }
        dataTestId={dataTestId}
      />
    </>
  );
};

import { Skeleton } from 'components/Skeleton';

import { StyledKpiSummaryCardsLoading } from '../../KpiSummaryCards.styles';

const SKELETON_HEIGHT = '160.205px';
const SKELETON_LENGTH = 1;
const SKELETON_KEYS = ['kpi-1', 'kpi-2', 'kpi-3'] as const;

interface LoadingSkeletonProps {
  dataTestId?: string;
}

export const LoadingSkeleton = ({ dataTestId }: LoadingSkeletonProps) => (
  <StyledKpiSummaryCardsLoading
    data-testid={
      dataTestId
        ? `${dataTestId}-skeleton-loading`
        : 'skeleton-kpi-summary-cards-loading'
    }
  >
    {SKELETON_KEYS.map((key) => (
      <Skeleton
        key={`skeleton-${key}`}
        width="100%"
        height={SKELETON_HEIGHT}
        length={SKELETON_LENGTH}
        borderRadius="small"
      />
    ))}
  </StyledKpiSummaryCardsLoading>
);

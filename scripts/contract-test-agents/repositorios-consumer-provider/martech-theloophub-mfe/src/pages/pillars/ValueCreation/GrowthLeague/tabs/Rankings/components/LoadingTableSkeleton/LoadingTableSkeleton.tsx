import { SkeletonLoader } from '@hexa-ui/components';
import { TableContainer } from 'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles';

interface LoadingTableSkeletonProps {
  dataTestId?: string;
}

const SKELETON_ROW_IDS = ['row-1', 'row-2', 'row-3', 'row-4'] as const;

export const LoadingTableSkeleton: React.FC<LoadingTableSkeletonProps> = ({
  dataTestId,
}) => (
  <TableContainer
    data-testid={
      dataTestId ? `loading-table-skeleton-${dataTestId}` : undefined
    }
  >
    {SKELETON_ROW_IDS.map((id, index) => (
      <SkeletonLoader
        key={id}
        height="550px"
        width="300px"
        data-testid={
          dataTestId
            ? `loading-table-skeleton-row-${index}-${dataTestId}`
            : undefined
        }
      />
    ))}
  </TableContainer>
);

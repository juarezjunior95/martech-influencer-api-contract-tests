import React from 'react';

import { Skeleton } from 'components/Skeleton/Skeleton';

import {
  StyledChartsContainer,
  StyledLegendContainer,
} from '../../.../../Overview.styles';
import {
  CustomSkeletonLoaderContainer,
  CustomSkeletonLoaderWrapper,
} from './CustomSkeletonLoader.styles';

interface CustomSkeletonLoaderProps {
  type: 'charts' | 'table';
  dataTestId?: string;
}

const LEGEND_ITEMS = [
  { id: 'legend-1', margin: '25px' },
  { id: 'legend-2', margin: '25px' },
  { id: 'legend-3', margin: '24px' },
];

const TableSkeleton: React.FC<{ dataTestId?: string }> = ({ dataTestId }) => {
  const buildTestId = (suffix: string) =>
    dataTestId ? `skeleton-${dataTestId}-${suffix}` : undefined;

  const headerRightTestId = dataTestId
    ? `${dataTestId}-skeleton-table-header-right`
    : undefined;

  return (
    <CustomSkeletonLoaderContainer data-testid={buildTestId('table-container')}>
      <CustomSkeletonLoaderWrapper
        marginBottom
        data-testid={buildTestId('table-wrapper-margin-bottom')}
      >
        <Skeleton
          width="125px"
          height="50px"
          length={1}
          dataTestId={buildTestId('table-header-left')}
        />
        <Skeleton
          width="276px"
          height="50px"
          length={4}
          dataTestId={headerRightTestId}
        />
      </CustomSkeletonLoaderWrapper>

      <CustomSkeletonLoaderWrapper data-testid={buildTestId('table-wrapper')}>
        <Skeleton
          width="125px"
          height="500px"
          length={1}
          dataTestId={buildTestId('table-body-left')}
        />
        <Skeleton
          width="276px"
          height="500px"
          length={4}
          dataTestId={buildTestId('table-body-right')}
        />
      </CustomSkeletonLoaderWrapper>
    </CustomSkeletonLoaderContainer>
  );
};

const ChartsSkeleton: React.FC<{ dataTestId?: string }> = ({ dataTestId }) => {
  const buildTestId = (suffix: string) =>
    dataTestId ? `skeleton-${dataTestId}-${suffix}` : undefined;

  return (
    <>
      <StyledChartsContainer data-testid={buildTestId('charts-container')}>
        <Skeleton
          width="309px"
          height="392px"
          length={4}
          dataTestId={buildTestId('charts')}
        />
      </StyledChartsContainer>

      <StyledLegendContainer data-testid={buildTestId('legend-container')}>
        {LEGEND_ITEMS.map(({ id, margin }, index) => (
          <div
            key={id}
            data-testid={buildTestId(`legend-container-${index}`)}
            style={{
              marginLeft: margin,
              marginBottom: '12px',
              marginTop: '12px',
            }}
          >
            <Skeleton
              width="160px"
              height="18px"
              length={1}
              dataTestId={buildTestId(`legend-${index}`)}
            />
          </div>
        ))}
      </StyledLegendContainer>
    </>
  );
};

export const CustomSkeletonLoader: React.FC<CustomSkeletonLoaderProps> = ({
  type,
  dataTestId,
}) => {
  if (type === 'table') {
    return <TableSkeleton dataTestId={dataTestId} />;
  }

  return <ChartsSkeleton dataTestId={dataTestId} />;
};

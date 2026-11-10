import React from 'react';

import { BasicContainer, Skeleton, StackedAreaContainer } from 'components';
import { StackedAreaData } from 'components/Chart/StackedArea/types';

import { NoDataAvailable } from '../NoDataAvailable/NoDataAvailable';

export interface ShareOfThroatData {
  title: string;
  subtitle?: string;
  chartData: StackedAreaData;
}

interface ShareOfThroatPerformanceProps {
  data?: ShareOfThroatData;
  dataTestId?: string;
  loading?: boolean;
}

export const ShareOfThroatPerformance: React.FC<
  ShareOfThroatPerformanceProps
> = ({ data, dataTestId, loading }) => {
  if (loading) {
    return (
      <Skeleton
        width="100%"
        height="400px"
        length={1}
        dataTestId={dataTestId ? `skeleton-${dataTestId}-sot` : undefined}
      />
    );
  }

  if (!data?.chartData?.columns?.length) {
    return <NoDataAvailable dataTestId={dataTestId} />;
  }

  return (
    <BasicContainer
      header={{
        title: 'Share of Throat Performance',
        titleSize: 'H2',
      }}
      layout={{ bodyPadding: true, background: '#F9F9F9' }}
      dataTestId={
        dataTestId ? `${dataTestId}-share-of-throat-performance` : undefined
      }
    >
      <StackedAreaContainer
        dataTestId={
          dataTestId ? `${dataTestId}-share-of-throat-performance` : undefined
        }
        data={data.chartData}
        size="medium"
        containerHeader={{
          title: data.title,
          subtitle: data.subtitle,
          titleSize: 'H4',
        }}
      />
    </BasicContainer>
  );
};

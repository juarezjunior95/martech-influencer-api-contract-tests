import React from 'react';

import { PortfolioPerformance } from 'pages/components';

import { StyledPortfolioPerformanceVolumePagesSlideRoot } from './PortfolioPerformanceVolumePagesSlide.styles';
import type { PortfolioPerformanceVolumePagesSlideProps } from './types';

export const PortfolioPerformanceVolumePagesSlide: React.FC<
  PortfolioPerformanceVolumePagesSlideProps
> = ({ data, error, loading, dataTestId }) => (
  <StyledPortfolioPerformanceVolumePagesSlideRoot>
    <PortfolioPerformance
      data={data}
      error={error}
      loading={loading}
      dataTestId={dataTestId}
      tableWidths={['238px', '320px', '418px', '194px', '322px']}
      headerHeight={64}
      rowHeight={115}
    />
  </StyledPortfolioPerformanceVolumePagesSlideRoot>
);

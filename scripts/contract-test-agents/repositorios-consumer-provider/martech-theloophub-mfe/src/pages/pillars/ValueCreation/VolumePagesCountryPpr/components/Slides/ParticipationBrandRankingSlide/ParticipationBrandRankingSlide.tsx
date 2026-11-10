import React from 'react';

import { DataStateHandler } from 'components';
import { BrandRanking } from 'pages/components/BrandRanking/BrandRanking';

import {
  getParticipationBrandRankingBarColors,
  PARTICIPATION_BRAND_RANKING_EXPORT_CAPTION,
} from './constants';
import {
  StyledParticipationBrandRankingChartPanel,
  StyledParticipationBrandRankingSlideRoot,
} from './ParticipationBrandRankingSlide.styles';
import type { ParticipationBrandRankingSlideProps } from './types';

export const ParticipationBrandRankingSlide: React.FC<
  ParticipationBrandRankingSlideProps
> = ({
  loading,
  error,
  empty,
  ranking,
  dataTestId,
  isExport = true,
  barThickness = 65,
}) => {
  return (
    <StyledParticipationBrandRankingSlideRoot data-testid={dataTestId}>
      <StyledParticipationBrandRankingChartPanel>
        <DataStateHandler
          loading={loading}
          error={error}
          empty={empty}
          skeletonProps={{
            height: '730px',
            width: '100%',
            length: 1,
            borderRadius: 'medium',
          }}
        >
          {ranking && (
            <BrandRanking
              ranking={ranking}
              caption={PARTICIPATION_BRAND_RANKING_EXPORT_CAPTION}
              getBarColors={getParticipationBrandRankingBarColors}
              barThickness={barThickness}
              dataTestId={dataTestId}
              isExport={isExport}
            />
          )}
        </DataStateHandler>
      </StyledParticipationBrandRankingChartPanel>
    </StyledParticipationBrandRankingSlideRoot>
  );
};

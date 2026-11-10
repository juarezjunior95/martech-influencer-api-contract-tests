import React from 'react';

import { CaptionItem, Legend } from 'components';
import { NoDataAvailable } from 'pages/pillars/Category/POSBook/components';
import { getBrandRankingLegendCaption } from 'pages/pillars/Category/POSBook/tabs/LeadTheCategory/utils/getBrandRankingLegendCaption';
import { StyledGridItem } from 'shared/Styles';

import { BrandRankingContainer } from './BrandRanking.styles';
import { RankedContainer } from './components/RankedContainer/RankedContainer';
import { getBarColors as defaultGetBarColors } from './components/RankedVerticalBar/utils';
import { BRAND_PARTICIPATION_CHART_CAPTION } from './constants';
import { RankedContainerData } from './types';

interface BrandRankingProps {
  ranking: RankedContainerData;
  caption?: CaptionItem[];
  getBarColors?: (source: string[]) => string[];
  isExport?: boolean;
  dataTestId?: string;
  barThickness?: number;
}

export const BrandRanking: React.FC<BrandRankingProps> = ({
  ranking,
  caption = BRAND_PARTICIPATION_CHART_CAPTION,
  getBarColors = defaultGetBarColors,
  isExport = false,
  dataTestId,
  barThickness = 40,
}) => {
  return (
    <BrandRankingContainer
      isExport={isExport}
      data-testid={dataTestId ? `section-${dataTestId}` : undefined}
    >
      <StyledGridItem
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        data-testid={dataTestId ? `grid-item-${dataTestId}` : undefined}
      >
        {!ranking || ranking?.['#empty'] ? (
          <NoDataAvailable dataTestId={dataTestId} />
        ) : (
          <div
            style={{ display: 'grid', gap: '24px' }}
            data-testid={dataTestId ? `content-${dataTestId}` : undefined}
          >
            <Legend
              caption={getBrandRankingLegendCaption(
                ranking,
                caption as CaptionItem[],
              )}
              legendPosition="left"
              font="heading"
            />
            <RankedContainer
              data={{
                ...ranking,
                labels: ranking?.labels || ([] as [string, string][]),
              }}
              getBarColors={getBarColors}
              dataTestId={dataTestId ? `${dataTestId}` : undefined}
              isExport={isExport}
              barThickness={barThickness}
            />
          </div>
        )}
      </StyledGridItem>
    </BrandRankingContainer>
  );
};

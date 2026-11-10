import React, { useMemo } from 'react';

import { DataStateHandler } from 'components';
import { KpiOverviewCard } from 'pages/components/KpiOverviewCard';
import { getKpiOverviewCardSkeletonProps } from 'pages/components/KpiOverviewCard/utils';
import {
  GrowthLeverCard,
  StrategyDriverCard,
} from 'pages/components/ValueCreation';
import { IMAGES, KPIS } from 'pages/pillars/ValueCreation/Home/constants';
import {
  getGrowthLeverCardSkeletonProps,
  getStrategyDriverCardSkeletonProps,
} from 'pages/pillars/ValueCreation/Home/utils';

import {
  StyledCardsGrid,
  StyledGrowthLeversContainer,
  StyledGrowthLeversGrid,
  StyledStrategyDriversGrid,
  StyledSustainableGrowthSlideRoot,
} from './SustainableGrowthOverviewSlide.styles';
import type { SustainableGrowthOverviewSlideProps } from './types';

export const SustainableGrowthOverviewSlide: React.FC<
  SustainableGrowthOverviewSlideProps
> = ({ loading = false, error, data, dataTestId, showGrowthLevers = true }) => {
  const { sustainableGrowthOverview, strategyDrivers, growthLevers } = data;

  const growthLeversEmpty = useMemo(
    () => !Object.keys(growthLevers ?? {}).length,
    [growthLevers],
  );

  return (
    <StyledSustainableGrowthSlideRoot data-testid={dataTestId}>
      <StyledCardsGrid>
        <DataStateHandler
          loading={loading}
          error={error}
          empty={!Object.keys(KPIS).length}
          skeletonProps={getKpiOverviewCardSkeletonProps(
            false,
            false,
            'export',
          )}
          dataTestId={
            dataTestId ? `${dataTestId}-sustainable-growth-overview` : undefined
          }
        >
          {Object.entries(KPIS).map(([key]) => {
            return (
              <KpiOverviewCard
                key={key}
                data={sustainableGrowthOverview?.[key]}
                variation="export"
                chartColors={{
                  striped: '#99D6FF',
                  current: '#FDD349',
                  default: '#DAC8A9',
                }}
              />
            );
          })}
        </DataStateHandler>
      </StyledCardsGrid>

      <StyledGrowthLeversContainer>
        <StyledStrategyDriversGrid>
          <DataStateHandler
            loading={loading}
            error={error}
            empty={!strategyDrivers?.length}
            skeletonProps={getStrategyDriverCardSkeletonProps(
              false,
              false,
              true,
            )}
            dataTestId={
              dataTestId ? `${dataTestId}-strategy-drivers` : undefined
            }
          >
            {strategyDrivers?.map((item) => (
              <StrategyDriverCard
                key={item.chartHeader.title}
                data={item}
                isExportPage
              />
            ))}
          </DataStateHandler>
        </StyledStrategyDriversGrid>

        {showGrowthLevers && (
          <StyledGrowthLeversGrid>
            <DataStateHandler
              loading={loading}
              error={error}
              empty={growthLeversEmpty}
              skeletonProps={getGrowthLeverCardSkeletonProps(
                false,
                false,
                true,
              )}
              dataTestId={
                dataTestId ? `${dataTestId}-growth-levers` : undefined
              }
            >
              {Object.entries(growthLevers ?? {}).map(([key, row]) => (
                <GrowthLeverCard
                  key={key}
                  image={IMAGES[key as keyof typeof IMAGES]}
                  data={row}
                  isExportPage
                />
              ))}
            </DataStateHandler>
          </StyledGrowthLeversGrid>
        )}
      </StyledGrowthLeversContainer>
    </StyledSustainableGrowthSlideRoot>
  );
};

import React from 'react';

import { GlobalOverflowXStyle } from 'shared/Styles';

import { borderRadius } from '../../constants';
import { KpiContent, ResourceAllocationData } from '../../types';
import { filterKpiContentByLabels } from '../../utils';

import { ChartContent } from '..';

import {
  StyledChartsAreaContainer,
  StyledChartsOverflowArea,
} from './ChartsArea.styles';

interface ChartsAreaProps {
  content: ResourceAllocationData;
  kpiFilters: string;
  selectedComparisons?: string[] | null;
  hoverable?: boolean;
  isScrollActive?: boolean;
  isGlobalZone?: boolean;
  pinnedLabel?: string | null;
  onCountryClick?: (country: string) => void;
  dataTestId?: string;
}

const EMPTY_KPI_CONTENT: KpiContent = {
  labels: [],
  datasets: [],
  total_allocation: { value: [] },
  caption_country_flag: {},
};

export const ChartsArea: React.FC<ChartsAreaProps> = ({
  content,
  kpiFilters,
  selectedComparisons = null,
  hoverable = false,
  isScrollActive = false,
  isGlobalZone = false,
  pinnedLabel = null,
  onCountryClick,
  dataTestId,
}) => {
  const media = filterKpiContentByLabels(
    content.media?.media ?? EMPTY_KPI_CONTENT,
    selectedComparisons,
  );
  const nwm = filterKpiContentByLabels(
    content.non_working_money?.non_working_money ?? EMPTY_KPI_CONTENT,
    selectedComparisons,
  );
  const sponsorship = filterKpiContentByLabels(
    content.sponsorship_activation?.sponsorship_activation ?? EMPTY_KPI_CONTENT,
    selectedComparisons,
  );

  return (
    <>
      <GlobalOverflowXStyle />

      <StyledChartsOverflowArea
        data-testid={dataTestId ? `${dataTestId}-overflow` : undefined}
      >
        <StyledChartsAreaContainer
          $scrollActive={isScrollActive}
          data-testid={dataTestId}
        >
          {media.labels.map((item, index) => {
            const hasData =
              media.datasets[index] ||
              sponsorship.datasets[index] ||
              nwm.datasets[index];

            if (!hasData) return null;

            return (
              <ChartContent
                key={item}
                media={media}
                sponsorship={sponsorship}
                nwm={nwm}
                index={index}
                item={item}
                kpiFilters={kpiFilters}
                borderRadius={borderRadius}
                hoverable={hoverable}
                isGlobalZone={isGlobalZone}
                pinnedLabel={pinnedLabel}
                onCountryClick={onCountryClick}
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-chart-content-${index}`
                    : undefined
                }
              />
            );
          })}
        </StyledChartsAreaContainer>
      </StyledChartsOverflowArea>
    </>
  );
};

import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import {
  SlideContent,
  TopBottomWaterfallSlideContent,
} from 'pages/components/ValueCreation';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { pageSections } from '../../../constants';
import type { UseVolumePprVolumeSlidesDataResult } from '../../../hooks';

const VOLUME_WATERFALL_LEGEND_TOP = [
  {
    label: 'Δ',
    shape: 'square' as const,
    icon: 'TrendingUp' as const,
    color: '#3CA91E',
  },
  {
    label: 'Δ',
    shape: 'square' as const,
    icon: 'TrendingDown' as const,
    color: '#E95858',
  },
  {
    label: 'Megabrands',
    shape: 'thinPill' as const,
    color: '#E5B611',
  },
  {
    label: 'Expansion',
    shape: 'thinPill' as const,
    color: '#C2346A',
  },
  {
    label: 'Sustain',
    shape: 'thinPill' as const,
    color: '#2F74AA',
  },
  {
    label: 'Tail',
    shape: 'thinPill' as const,
    color: '#4E579F',
  },
];

export interface VolumePprVolumeExportSectionsProps {
  period: string;
  countryId: string;
  countryLabel: string;
  dataTestId: string;
  isGlobalZone: boolean;
  getPageByName: (name: string) => { index: number } | undefined;
  volume: UseVolumePprVolumeSlidesDataResult;
}

const VolumePprVolumeExportSectionsComponent = ({
  period,
  countryId,
  countryLabel,
  dataTestId,
  isGlobalZone,
  getPageByName,
  volume,
}: VolumePprVolumeExportSectionsProps) => {
  const { volumeSlideRequest, volumeSlideContentData } = volume;

  return (
    <>
      <StyledExportPageSection data-page-name={pageSections.volume}>
        <TemplateSlide
          title={`${countryLabel} Volume`}
          measure="[k hl]"
          period={period}
          footnotes=""
          countryId={countryId}
          headerDivider={false}
          page={getPageByName(pageSections.volume)?.index}
          dataTestId={`${dataTestId}-volume-slide`}
        >
          <SlideContent
            loading={volumeSlideRequest.loading}
            error={volumeSlideRequest.error}
            data={{
              bigNumbersKpiData: volumeSlideContentData.bigNumbersKpiData,
              lineChartKpiData: volumeSlideContentData.lineChartKpiData,
              portfolioTableKpiData:
                volumeSlideContentData.portfolioTableKpiData,
              prioritiesTableKpiData:
                volumeSlideContentData.prioritiesTableKpiData,
              marketsTableKpiData: volumeSlideContentData.marketsTableKpiData,
            }}
            tableOrder={
              isGlobalZone
                ? ['portfolio', 'priorities', 'markets']
                : ['portfolio', 'priorities']
            }
            tableHeight={236}
          />
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection data-page-name={pageSections.volumeWaterfall}>
        <TemplateSlide
          title={`${countryLabel} Volume Brands Breakdown`}
          measure="[k hl]"
          period={period}
          countryId={countryId}
          headerDivider={false}
          page={getPageByName(pageSections.volumeWaterfall)?.index}
          dataTestId={`${dataTestId}-volume-waterfall-slide`}
        >
          <TopBottomWaterfallSlideContent
            chartHeight="188px"
            loading={volumeSlideRequest.loading}
            error={volumeSlideRequest.error}
            data={{
              topKpiData: {
                ...volumeSlideContentData.topWaterfallKpiData,
                legend: VOLUME_WATERFALL_LEGEND_TOP,
              },
              bottomKpiData: {
                ...volumeSlideContentData.bottomWaterfallKpiData,
                legend: VOLUME_WATERFALL_LEGEND_TOP,
              },
            }}
            dataTestId={`${dataTestId}-country-volume-brands-breakdown-slide`}
          />
        </TemplateSlide>
      </StyledExportPageSection>
    </>
  );
};

export const VolumePprVolumeExportSections = memo(
  VolumePprVolumeExportSectionsComponent,
);
VolumePprVolumeExportSections.displayName = 'VolumePprVolumeExportSections';

import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import type { SustainableGrowthOverviewByGrowthLeverSlideViewModel } from '../../../hooks';
import { SustainableGrowthOverviewSlide } from '../../Slides';

export interface VolumePprSustainableGrowthByLeverExportListProps {
  period: string;
  countryId: string;
  dataTestId: string;
  getPageByName: (name: string) => { index: number } | undefined;
  slides: SustainableGrowthOverviewByGrowthLeverSlideViewModel[];
}

const VolumePprSustainableGrowthByLeverExportListComponent = ({
  period,
  countryId,
  dataTestId,
  getPageByName,
  slides,
}: VolumePprSustainableGrowthByLeverExportListProps) => (
  <>
    {slides.map((slide) => (
      <StyledExportPageSection
        key={slide.id}
        data-page-name={slide.pageSection}
      >
        <TemplateSlide
          title={slide.title}
          period={period}
          countryId={countryId}
          headerDivider={false}
          page={getPageByName(slide.pageSection)?.index}
        >
          <SustainableGrowthOverviewSlide
            loading={slide.loading}
            error={slide.error}
            data={slide.data}
            dataTestId={`${dataTestId}-sustainable-growth-slide-${slide.id}`}
            showGrowthLevers={false}
          />
        </TemplateSlide>
      </StyledExportPageSection>
    ))}
  </>
);

export const VolumePprSustainableGrowthByLeverExportList = memo(
  VolumePprSustainableGrowthByLeverExportListComponent,
);
VolumePprSustainableGrowthByLeverExportList.displayName =
  'VolumePprSustainableGrowthByLeverExportList';

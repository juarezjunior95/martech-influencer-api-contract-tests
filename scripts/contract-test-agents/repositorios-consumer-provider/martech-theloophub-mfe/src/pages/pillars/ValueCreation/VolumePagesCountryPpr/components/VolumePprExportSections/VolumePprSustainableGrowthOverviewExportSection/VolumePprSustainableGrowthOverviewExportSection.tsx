import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { pageSections } from '../../../constants';
import {
  SustainableGrowthOverviewSlide,
  UseSustainableGrowthOverviewSlideDataResult,
} from '../../Slides';

export interface VolumePprSustainableGrowthOverviewExportSectionProps {
  period: string;
  countryId: string;
  dataTestId: string;
  getPageByName: (name: string) => { index: number } | undefined;
  sustainableGrowthOverview: UseSustainableGrowthOverviewSlideDataResult;
}

const VolumePprSustainableGrowthOverviewExportSectionComponent = ({
  period,
  countryId,
  dataTestId,
  getPageByName,
  sustainableGrowthOverview,
}: VolumePprSustainableGrowthOverviewExportSectionProps) => (
  <StyledExportPageSection
    data-page-name={pageSections.sustainableGrowthOverview}
  >
    <TemplateSlide
      title="Sustainable Growth Overview"
      period={period}
      countryId={countryId}
      headerDivider={false}
      page={getPageByName(pageSections.sustainableGrowthOverview)?.index}
    >
      <SustainableGrowthOverviewSlide
        loading={sustainableGrowthOverview.loading}
        error={sustainableGrowthOverview.error}
        data={sustainableGrowthOverview.data}
        dataTestId={`${dataTestId}-sustainable-growth-slide`}
      />
    </TemplateSlide>
  </StyledExportPageSection>
);

export const VolumePprSustainableGrowthOverviewExportSection = memo(
  VolumePprSustainableGrowthOverviewExportSectionComponent,
);
VolumePprSustainableGrowthOverviewExportSection.displayName =
  'VolumePprSustainableGrowthOverviewExportSection';

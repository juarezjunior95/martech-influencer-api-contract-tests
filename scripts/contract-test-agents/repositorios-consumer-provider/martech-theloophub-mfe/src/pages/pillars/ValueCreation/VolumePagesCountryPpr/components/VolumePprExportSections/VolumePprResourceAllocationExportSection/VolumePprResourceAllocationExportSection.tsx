import React, { memo } from 'react';
import { IntlFormatters } from 'react-intl';

import { TemplateSlide } from 'components';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { pageSections } from '../../../constants';
import type { UseVolumePprResourceAllocationOverviewResult } from '../../../hooks';
import { ResourceAllocationMediaSlideContent } from '../../Slides';

export interface VolumePprResourceAllocationExportSectionProps {
  period: string;
  countryId: string;
  dataTestId: string;
  isGlobalZone: boolean;
  formatMessage: IntlFormatters['formatMessage'];
  getPageByName: (name: string) => { index: number } | undefined;
  resourceAllocation: UseVolumePprResourceAllocationOverviewResult;
}

const VolumePprResourceAllocationExportSectionComponent = ({
  period,
  countryId,
  dataTestId,
  isGlobalZone,
  formatMessage,
  getPageByName,
  resourceAllocation,
}: VolumePprResourceAllocationExportSectionProps) => (
  <StyledExportPageSection
    data-page-name={pageSections.resourceAllocationMediaOverview}
  >
    <TemplateSlide
      title="Resource Allocation"
      period={period}
      footnotes=""
      page={getPageByName(pageSections.resourceAllocationMediaOverview)?.index}
      countryId={countryId}
      headerDivider={false}
      dataTestId={`${dataTestId}-resource-allocation-media-overview`}
    >
      <ResourceAllocationMediaSlideContent
        overviewData={resourceAllocation.overviewData}
        overviewLoading={resourceAllocation.overviewLoading}
        rankingKpiData={resourceAllocation.rankingKpiData}
        rankingLoading={resourceAllocation.rankingLoading}
        activeRankingSubfilter={resourceAllocation.activeRankingSubfilter}
        isGlobalZone={isGlobalZone}
        formatMessage={formatMessage}
        dataTestId={`${dataTestId}-resource-allocation-media`}
      />
    </TemplateSlide>
  </StyledExportPageSection>
);

export const VolumePprResourceAllocationExportSection = memo(
  VolumePprResourceAllocationExportSectionComponent,
);
VolumePprResourceAllocationExportSection.displayName =
  'VolumePprResourceAllocationExportSection';

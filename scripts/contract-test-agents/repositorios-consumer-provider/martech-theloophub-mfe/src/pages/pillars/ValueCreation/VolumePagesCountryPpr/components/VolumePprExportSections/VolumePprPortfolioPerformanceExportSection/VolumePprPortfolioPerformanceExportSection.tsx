import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import { PortfolioData } from 'pages/components';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { pageSections } from '../../../constants';
import type { UseVolumePprPortfolioPerformanceSlideDataResult } from '../../../hooks';
import { PortfolioPerformanceVolumePagesSlide } from '../../Slides';

export interface VolumePprPortfolioPerformanceExportSectionProps {
  period: string;
  countryId: string;
  dataTestId: string;
  getPageByName: (name: string) => { index: number } | undefined;
  portfolioPerformance: UseVolumePprPortfolioPerformanceSlideDataResult;
}

const VolumePprPortfolioPerformanceExportSectionComponent = ({
  period,
  countryId,
  dataTestId,
  getPageByName,
  portfolioPerformance,
}: VolumePprPortfolioPerformanceExportSectionProps) => {
  const { portfolioPerformanceSlideData } = portfolioPerformance;

  return (
    <StyledExportPageSection data-page-name={pageSections.portfolioPerformance}>
      <TemplateSlide
        title="Portfolio Performance"
        period={period}
        footnotes=""
        countryId={countryId}
        headerDivider={false}
        page={getPageByName(pageSections.portfolioPerformance)?.index}
        dataTestId={`${dataTestId}-portfolio-performance-slide`}
      >
        <PortfolioPerformanceVolumePagesSlide
          data={
            portfolioPerformanceSlideData.data?.[
              'portfolioPerformance'
            ] as PortfolioData
          }
          error={portfolioPerformanceSlideData.error}
          loading={portfolioPerformanceSlideData.loading}
          dataTestId={`${dataTestId}-portfolio-performance`}
        />
      </TemplateSlide>
    </StyledExportPageSection>
  );
};

export const VolumePprPortfolioPerformanceExportSection = memo(
  VolumePprPortfolioPerformanceExportSectionComponent,
);
VolumePprPortfolioPerformanceExportSection.displayName =
  'VolumePprPortfolioPerformanceExportSection';

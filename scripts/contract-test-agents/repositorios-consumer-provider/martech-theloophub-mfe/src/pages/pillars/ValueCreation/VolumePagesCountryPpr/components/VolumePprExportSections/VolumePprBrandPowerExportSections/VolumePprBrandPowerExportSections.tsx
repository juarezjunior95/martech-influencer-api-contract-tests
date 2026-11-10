import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import { StyledContent } from 'pages/components/PortfolioBrand/PortfolioBrand.styles';
import {
  CountrySlide,
  EvolutionSlide,
} from 'pages/components/PortfolioBrand/Slides';
import { PORTFOLIOS_TYPES } from 'pages/constants';
import { SharedKpis } from 'pages/enums';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import { pageSections } from '../../../constants';
import type { UseVolumePprBrandPowerSlidesDataResult } from '../../../hooks';

export interface VolumePprBrandPowerExportSectionsProps {
  period: string;
  countryId: string;
  dataTestId: string;
  getPageByName: (name: string) => { index: number } | undefined;
  brandPower: UseVolumePprBrandPowerSlidesDataResult;
  evolutionAlerts: string[];
  abiBrandInsights: string[];
  competitorBrandInsights: string[];
}

const VolumePprBrandPowerExportSectionsComponent = ({
  period,
  countryId,
  dataTestId,
  getPageByName,
  brandPower,
  evolutionAlerts,
  abiBrandInsights,
  competitorBrandInsights,
}: VolumePprBrandPowerExportSectionsProps) => {
  const { countryData, breakdownSegmentsData } = brandPower;

  return (
    <>
      <StyledExportPageSection data-page-name={pageSections.brandPower}>
        <TemplateSlide
          title="Brand Power Trends"
          period={period}
          footnotes=""
          page={getPageByName(pageSections.brandPower)?.index}
          countryId={countryId}
          headerDivider={false}
          dataTestId={`${dataTestId}-brand-power-evolution`}
        >
          <StyledContent>
            <EvolutionSlide
              evolutionSlideInfos={[
                {
                  firstChartData:
                    countryData.data?.ABI?.[SharedKpis.PERFORMANCE_TREND.id]
                      ?.yearPowerVsAc,
                  secondChartData:
                    countryData.data?.ABI?.[SharedKpis.PERFORMANCE_TREND.id]
                      ?.trendOverTime,
                  firstChartTitle: 'TT ABI Power',
                  secondChartTitle: 'Total ABI Power Trend',
                  evolutionSlideLoading: countryData.loading,
                  evolutionSlideError: countryData.error,
                  evolutionSlideEmpty:
                    countryData.data?.ABI?.[SharedKpis.PERFORMANCE_TREND.id]
                      ?.empty,
                },
                {
                  firstChartData:
                    countryData.data?.Megabrands?.[
                      SharedKpis.PERFORMANCE_TREND.id
                    ]?.yearPowerVsAc,
                  secondChartData:
                    countryData.data?.Megabrands?.[
                      SharedKpis.PERFORMANCE_TREND.id
                    ]?.trendOverTime,
                  firstChartTitle: 'TT ABI Megabrands Power',
                  secondChartTitle: 'Total ABI Megabrands Power Trend',
                  evolutionSlideLoading: countryData.loading,
                  evolutionSlideError: countryData.error,
                  evolutionSlideEmpty:
                    countryData.data?.Megabrands?.[
                      SharedKpis.PERFORMANCE_TREND.id
                    ]?.empty,
                  portfolioType: PORTFOLIOS_TYPES.MEGABRANDS,
                },
              ]}
              alerts={evolutionAlerts}
              dataTestId={`${dataTestId}-slide-evolution-country`}
              barColors={{
                lastYear: '#E2D4BB',
                currentYear: '#FDD349',
              }}
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        data-page-name={pageSections.brandPowerBreakdown}
      >
        <TemplateSlide
          title="ABI Brand Breakdown - Performance"
          period={period}
          footnotes=""
          page={getPageByName(pageSections.brandPowerBreakdown)?.index}
          countryId={countryId}
          headerDivider={false}
          dataTestId={`${dataTestId}-brand-power-abi-performance`}
        >
          <StyledContent>
            <CountrySlide
              titlePower="ABI Power"
              titleBrandBreakdown="ABI Brand Breakdown"
              brandBreakdownKpiData={
                countryData.data?.Brands?.[SharedKpis.BRAND_BREAKDOWN.id]
              }
              portfolioPerformanceKpiData={
                countryData.data?.ABI?.[
                  SharedKpis.PORTFOLIO_PERFORMANCE_BOOK.id
                ]
              }
              segmentPerformanceKpiData={
                countryData.data?.ABI?.[SharedKpis.SEGMENT_PERFORMANCE.id]
              }
              loading={countryData.loading}
              error={countryData.error}
              alerts={abiBrandInsights}
              headerComponentParams={{
                chartBackground: '#FDD349',
              }}
              dataTestId={`${dataTestId}-slide-country-abi`}
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        data-page-name={pageSections.brandPowerBreakdownComp}
      >
        <TemplateSlide
          title="Competitor Brand Breakdown - Performance"
          period={period}
          footnotes=""
          page={getPageByName(pageSections.brandPowerBreakdownComp)?.index}
          countryId={countryId}
          headerDivider={false}
          dataTestId={`${dataTestId}-brand-power-competitor-performance`}
        >
          <StyledContent>
            <CountrySlide
              titlePower="Competitor Power"
              titleBrandBreakdown="Competitor Brand Breakdown"
              brandBreakdownKpiData={
                breakdownSegmentsData.data?.Brands?.[
                  SharedKpis.BRAND_BREAKDOWN.id
                ]
              }
              portfolioPerformanceKpiData={
                countryData.data?.ABI?.[
                  SharedKpis.PORTFOLIO_PERFORMANCE_BOOK.id
                ]
              }
              segmentPerformanceKpiData={
                countryData.data?.ABI?.[SharedKpis.SEGMENT_PERFORMANCE.id]
              }
              loading={countryData.loading}
              error={countryData.error}
              competitorView
              alerts={competitorBrandInsights}
              headerComponentParams={{
                chartBackground: '#CBCAC7',
              }}
              dataTestId={`${dataTestId}-slide-country-competitor`}
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>
    </>
  );
};

export const VolumePprBrandPowerExportSections = memo(
  VolumePprBrandPowerExportSectionsComponent,
);
VolumePprBrandPowerExportSections.displayName =
  'VolumePprBrandPowerExportSections';

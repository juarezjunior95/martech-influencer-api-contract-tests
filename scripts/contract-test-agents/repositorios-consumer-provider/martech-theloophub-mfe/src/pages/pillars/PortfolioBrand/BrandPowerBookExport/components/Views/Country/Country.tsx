import { useEffect, useMemo } from 'react';

import { TemplateSlide } from 'components';
import { TableDataType } from 'components/Table/types';
import { useLastDataRefresh } from 'contexts';
import { FilterDataAccessor } from 'domain/Filter';
import { usePageFilterApplied, usePageFilterData, usePageIndexes } from 'hooks';
import {
  CountrySlide,
  EvolutionSlide,
} from 'pages/components/PortfolioBrand/Slides';
import { PORTFOLIOS_TYPES } from 'pages/constants';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';
import { formatDateToQuarterYear } from 'utils/format';

import { BRAND_POWER_BOOK_EXPORT_PAGE_NAME } from '../../../BrandPowerBookExport';
import { StyledContent } from '../../../BrandPowerBookExport.styles';
import {
  AI_SUMMARY_COUNTRY_IDENTIFIER,
  pageSections,
} from '../../../constants';
import { usePowerBookCountryData } from '../../../hooks/usePowerBookCountryData/usePowerBookCountryData';
import { Empty } from '../../../types';

interface CountryViewProps {
  containerRef: React.RefObject<HTMLElement>;
  loadingCallback: (loading: { country: boolean; global: boolean }) => void;
}

export const CountryView = ({
  containerRef,
  loadingCallback,
}: CountryViewProps) => {
  const { dataFilters } = usePageFilterData(BRAND_POWER_BOOK_EXPORT_PAGE_NAME);
  const { applied } = usePageFilterApplied(BRAND_POWER_BOOK_EXPORT_PAGE_NAME);
  const country = FilterDataAccessor.getInstance().getCountry(
    dataFilters,
    applied,
  );
  const { getPageByName, updateIndexes } = usePageIndexes(containerRef);
  const { lastDataRefreshKpisDate } = useLastDataRefresh();
  const quarterYear = useMemo(() => {
    if (!lastDataRefreshKpisDate.power) return '';
    return formatDateToQuarterYear(lastDataRefreshKpisDate.power);
  }, [lastDataRefreshKpisDate]);

  const { data, isLoadingCountryData } = usePowerBookCountryData();

  const applyVariationCaptionTitle = useMemo(
    () => (variationCaptions) => {
      return variationCaptions?.map((caption) => {
        return {
          ...caption,
          title: 'MB Relevance',
        };
      });
    },
    [
      data?.ttABIMegabrands.data?.trendOverTime?.variationCaptions,
      data?.ttABIMegabrands.data?.yearPowerVsAc?.variationCaptions,
    ],
  );

  useEffect(() => {
    if (isLoadingCountryData) {
      loadingCallback({
        country: true,
        global: false,
      });
    } else {
      loadingCallback({
        country: false,
        global: true,
      });
    }
  }, [isLoadingCountryData, loadingCallback]);

  useEffect(() => {
    updateIndexes();
  }, [updateIndexes]);

  return (
    <>
      <StyledExportPageSection data-page-name={pageSections.countryTrends}>
        <TemplateSlide
          title={`${String(country?.label)} Total ABI Power Evolution`}
          period={quarterYear}
          footnotes={
            applied.country === 'DOM' ? (
              <>
                <b>About results:</b> Results before 2022 exclude the Dominican
                Republic in the survey.
              </>
            ) : undefined
          }
          page={getPageByName(pageSections.countryTrends)?.index}
          countryId={String(country?.value)}
          headerDivider={false}
          dataTestId={pageSections.countryTrends}
        >
          <StyledContent>
            <EvolutionSlide
              evolutionSlideInfos={[
                {
                  firstChartData: data?.ttABI.data?.yearPowerVsAc,
                  secondChartData: data?.ttABI.data?.trendOverTime,
                  firstChartTitle: 'TT ABI Power',
                  secondChartTitle: 'Total ABI Power Trend',
                  evolutionSlideLoading: isLoadingCountryData,
                  evolutionSlideError: data?.ttABI.error,
                  evolutionSlideEmpty:
                    data?.ttABI.data?.yearPowerVsAc?.empty ||
                    data?.ttABI.data?.trendOverTime?.empty,
                  aiSummary:
                    AI_SUMMARY_COUNTRY_IDENTIFIER['power-evolution-all'],
                },
                {
                  firstChartData: {
                    ...data?.ttABIMegabrands.data?.yearPowerVsAc,
                    variationCaptions: applyVariationCaptionTitle(
                      data?.ttABIMegabrands.data?.yearPowerVsAc
                        ?.variationCaptions,
                    ),
                  },
                  secondChartData: {
                    ...data?.ttABIMegabrands.data?.trendOverTime,
                    variationCaptions: applyVariationCaptionTitle(
                      data?.ttABIMegabrands.data?.trendOverTime
                        ?.variationCaptions,
                    ),
                  },
                  firstChartTitle: 'TT ABI Megabrands Power',
                  secondChartTitle: 'Total ABI Megabrands Power Trend',
                  evolutionSlideLoading: isLoadingCountryData,
                  evolutionSlideError: data?.ttABIMegabrands.error,
                  evolutionSlideEmpty:
                    data?.ttABIMegabrands.data?.yearPowerVsAc?.empty ||
                    data?.ttABIMegabrands.data?.trendOverTime?.empty,
                  portfolioType: PORTFOLIOS_TYPES.MEGABRANDS,
                  aiSummary:
                    AI_SUMMARY_COUNTRY_IDENTIFIER['power-evolution-megabrands'],
                },
              ]}
              alerts={[]}
              dataTestId="slide-evolution-country"
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection data-page-name={pageSections.countryPerformance}>
        <TemplateSlide
          backgroundColor="#F5F5F4"
          title={`${country?.label} ABI: ${quarterYear} Performance`}
          period={quarterYear}
          footnotes=""
          page={getPageByName(pageSections.countryPerformance)?.index}
          countryId={String(country?.value)}
          headerDivider={false}
          dataTestId={pageSections.countryPerformance}
        >
          <StyledContent>
            <CountrySlide
              titlePower="ABI Power"
              titleBrandBreakdown="ABI Brand Breakdown"
              brandBreakdownKpiData={{
                table: data?.ABIBrandBreakdown?.data
                  ?.brandBreakdown as TableDataType & Empty,

                tableComp: null,
              }}
              portfolioPerformanceKpiData={{
                table: data?.power?.data
                  ?.summaryPowerByPortfolioPerformance as TableDataType & Empty,
              }}
              segmentPerformanceKpiData={{
                table: data?.power?.data
                  ?.summaryPowerBySegmentPerformance as TableDataType & Empty,
              }}
              loading={data.ABIBrandBreakdown.loading}
              error={data.ABIBrandBreakdown.error}
              alerts={[]}
              dataTestId="slide-country-abi"
              aiSummary={AI_SUMMARY_COUNTRY_IDENTIFIER['performance-abi']}
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        data-page-name={pageSections.countryCompetitorPerformance}
      >
        <TemplateSlide
          backgroundColor="#F5F5F4"
          title={`${country?.label} Competition: ${quarterYear} Performance`}
          period={quarterYear}
          footnotes=""
          page={getPageByName(pageSections.countryCompetitorPerformance)?.index}
          countryId={String(country?.value)}
          headerDivider={false}
          dataTestId={pageSections.countryCompetitorPerformance}
        >
          <StyledContent>
            <CountrySlide
              titlePower="Competitor Power"
              titleBrandBreakdown="Competitor Brand Breakdown"
              brandBreakdownKpiData={{
                table: data?.CompetitorBrandBreakdown?.data
                  ?.brandBreakdown as TableDataType & Empty,
                tableComp: null,
              }}
              portfolioPerformanceKpiData={{
                table: data?.power?.data
                  ?.summaryPowerByPortfolioPerformance as TableDataType & Empty,
              }}
              segmentPerformanceKpiData={{
                table: data?.power?.data
                  ?.summaryPowerBySegmentPerformance as TableDataType & Empty,
              }}
              competitorView={true}
              shouldFilterBreakdownRows={false}
              loading={data.CompetitorBrandBreakdown.loading}
              error={data.CompetitorBrandBreakdown.error}
              alerts={[]}
              dataTestId="slide-country-competitor"
              aiSummary={
                AI_SUMMARY_COUNTRY_IDENTIFIER['performance-competitor']
              }
            />
          </StyledContent>
        </TemplateSlide>
      </StyledExportPageSection>
    </>
  );
};

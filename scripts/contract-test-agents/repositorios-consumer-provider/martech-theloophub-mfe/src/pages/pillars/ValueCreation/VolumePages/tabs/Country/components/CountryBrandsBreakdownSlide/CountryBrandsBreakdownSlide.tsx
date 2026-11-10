import { memo } from 'react';

import { TemplateSlide } from 'components';
import { TopBottomBarChartSlideContent } from 'pages/components/ValueCreation/Slides/TopBottomBarChartSlideContent';
import { TopBottomWaterfallSlideContent } from 'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import { useVolumePagesKpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { CountryBrandsBreakdownSlideProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/components/CountryBrandsBreakdownSlide/types';
import { pageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Country/constants/sections';
import {
  barChartWithLegend,
  waterfallChartWithLegend,
} from 'pages/pillars/ValueCreation/VolumePages/utils';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

export const CountryBrandsBreakdownSlide = memo(
  ({
    getPageByName,
    countryLabel,
    countryCode,
    dataTestId,
    period,
    data,
    kpiName,
  }: CountryBrandsBreakdownSlideProps) => {
    const { kpi } = useVolumePagesKpi();
    const legend = KPI_CONFIGS[kpi].legend.portfolio;
    const isMarketShare = kpi === 'market_share';

    if (
      (!data.loading && (!data.data || data.error !== null)) ||
      data.data?.['brands-volume-YTD']?.empty === true ||
      data.data?.['brands-volume-MTD']?.empty === true
    ) {
      return null;
    }

    return (
      <StyledExportPageSection
        data-page-name={pageSections.countryBarChartReport}
        data-testid={
          dataTestId
            ? `tabpanel-country-export-page-section-${dataTestId}`
            : undefined
        }
      >
        <TemplateSlide
          title={`${countryLabel} ${kpiName} Brands Breakdown`}
          measure={KPI_CONFIGS[kpi].measure}
          period={period}
          footnotes={
            isMarketShare
              ? 'Brands are ordered by Portfolio Classification, then ranked by total market share.'
              : 'Brands are ordered by Portfolio Classification, then ranked by vol. size. Product Type filtered by Beer + ADJ.'
          }
          page={getPageByName(pageSections.countryBarChartReport)?.index}
          countryId={countryCode}
          headerDivider={false}
          dataTestId={pageSections.countryBarChartReport}
        >
          {isMarketShare ? (
            <TopBottomBarChartSlideContent
              loading={data.loading}
              error={data.error}
              data={{
                topKpiData: barChartWithLegend(
                  data.data,
                  'brands-volume-YTD',
                  legend,
                ),
                bottomKpiData: barChartWithLegend(
                  data.data,
                  'brands-volume-MTD',
                  legend,
                ),
              }}
              dataTestId={
                dataTestId
                  ? `country-bar-chart-slide-content-${dataTestId}`
                  : undefined
              }
              chartHeight="190px"
            />
          ) : (
            <TopBottomWaterfallSlideContent
              loading={data.loading}
              error={data.error}
              data={{
                topKpiData: waterfallChartWithLegend(
                  data.data,
                  'brands-volume-YTD',
                  legend,
                ),
                bottomKpiData: waterfallChartWithLegend(
                  data.data,
                  'brands-volume-MTD',
                  legend,
                ),
              }}
              dataTestId={
                dataTestId
                  ? `country-bar-chart-slide-content-${dataTestId}`
                  : undefined
              }
              chartHeight="190px"
            />
          )}
        </TemplateSlide>
      </StyledExportPageSection>
    );
  },
);

CountryBrandsBreakdownSlide.displayName = 'CountryBrandsBreakdownSlide';

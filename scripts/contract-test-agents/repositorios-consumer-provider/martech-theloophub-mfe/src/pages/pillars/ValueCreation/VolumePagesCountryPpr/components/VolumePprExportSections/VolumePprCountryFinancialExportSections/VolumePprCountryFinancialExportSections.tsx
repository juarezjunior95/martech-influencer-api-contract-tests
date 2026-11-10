import React, { memo } from 'react';

import { TemplateSlide } from 'components';
import { TopBottomWaterfallSlideContent } from 'pages/components/ValueCreation';
import { SlidePerformanceTool } from 'pages/components/ValueCreation/Slides/SlidePerformanceTool';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

import type {
  LegendItem,
  WaterfallChartKpiData,
} from '../../../../VolumePages/types';
import { pageSections } from '../../../constants';
import type {
  UseVolumePprMarketShareSlidesDataResult,
  UseVolumePprNetRevenueSlidesDataResult,
} from '../../../hooks';

const NR_WATERFALL_LEGEND: LegendItem[] = [
  {
    label: 'Δ NR',
    icon: 'TrendingUp' as const,
    shape: 'square' as const,
    color: '#3CA91E',
  },
  {
    label: 'Δ NR',
    icon: 'TrendingDown' as const,
    shape: 'square' as const,
    color: '#E95858',
  },
];

const MARKET_SHARE_WATERFALL_LEGEND: LegendItem[] = [
  {
    label: 'Mrkt. Share',
    icon: 'TrendingUp' as const,
    shape: 'square' as const,
    color: '#3CA91E',
  },
  {
    label: 'Δ Mrkt. Share',
    icon: 'TrendingDown' as const,
    shape: 'square' as const,
    color: '#E95858',
  },
];

type WaterfallChartSource = {
  images?: WaterfallChartKpiData['brandsAvatar'];
  comparisonLine?: WaterfallChartKpiData['comparisonLine'];
  labels?: WaterfallChartKpiData['labels'];
  values?: WaterfallChartKpiData['values'];
  formattedData?: WaterfallChartKpiData['formattedData'];
};

const EMPTY_BRANDS_AVATAR: WaterfallChartKpiData['brandsAvatar'] = {
  data: [],
};
const EMPTY_COMPARISON_LINE: WaterfallChartKpiData['comparisonLine'] = {
  data: [],
};

const buildWaterfallChartKpiData = ({
  chart,
  empty,
  legend,
  period,
}: {
  chart?: WaterfallChartSource;
  empty?: boolean;
  legend: LegendItem[];
  period: string;
}): WaterfallChartKpiData => ({
  empty,
  period,
  brandsAvatar: chart?.images ?? EMPTY_BRANDS_AVATAR,
  comparisonLine: chart?.comparisonLine ?? EMPTY_COMPARISON_LINE,
  labels: chart?.labels ?? [],
  values: chart?.values ?? [],
  formattedData: chart?.formattedData ?? [],
  legend,
});

export interface VolumePprCountryFinancialExportSectionsProps {
  period: string;
  countryId: string;
  countryLabel: string;
  dataTestId: string;
  netRevenue: UseVolumePprNetRevenueSlidesDataResult;
  marketShare: UseVolumePprMarketShareSlidesDataResult;
}

const VolumePprCountryFinancialExportSectionsComponent = ({
  period,
  countryId,
  countryLabel,
  dataTestId,
  netRevenue,
  marketShare,
}: VolumePprCountryFinancialExportSectionsProps) => {
  const {
    bigNumbersNetRevenueBffData,
    overtimeNetRevenueBffData,
    waterfallNetRevenueYTDBffData,
    waterfallNetRevenueMTDBffData,
    bigNumbersNetRevenueData,
    overtimeNetRevenueData,
    waterfallYTDData,
    waterfallMTDData,
  } = netRevenue;

  const {
    bigNumbersMarketShareBffData,
    overtimeMarketShareBffData,
    waterfallMarketShareYTDBffData,
    waterfallMarketShareMTDBffData,
    bigNumbersMarketShareData,
    overtimeMarketShareData,
    waterfallMarketShareYTDData,
    waterfallMarketShareMTDData,
  } = marketShare;

  return (
    <>
      <StyledExportPageSection data-page-name={pageSections.netRevenue}>
        <TemplateSlide
          title={`${countryLabel} Net Revenue`}
          measure="[$Mio]"
          period="YTD"
          footnotes=""
          countryId={countryId}
          headerDivider={false}
          dataTestId={`${dataTestId}-country-net-revenue-slide`}
        >
          <SlidePerformanceTool
            bigNumberData={bigNumbersNetRevenueData['overtime-performance']}
            bigNumberRequest={bigNumbersNetRevenueBffData}
            lineBarChartsData={overtimeNetRevenueData['overtime-trends']}
            lineBarChartsRequest={overtimeNetRevenueBffData}
          />
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        data-page-name={pageSections.netRevenueWaterfall}
      >
        <TemplateSlide
          title={`${countryLabel} Net Revenue Brands`}
          measure="[$Mio]"
          period={period}
          footnotes=""
          countryId={countryId}
          headerDivider={false}
          dataTestId={`${dataTestId}-performance-tool-waterfall-slide`}
        >
          <TopBottomWaterfallSlideContent
            chartHeight="155px"
            loading={
              waterfallNetRevenueYTDBffData?.loading ||
              waterfallNetRevenueMTDBffData?.loading ||
              false
            }
            error={
              waterfallNetRevenueYTDBffData?.error ||
              waterfallNetRevenueMTDBffData?.error ||
              undefined
            }
            data={{
              topKpiData: buildWaterfallChartKpiData({
                chart: waterfallYTDData['contribution']?.large,
                empty: waterfallYTDData['contribution']?.empty,
                legend: NR_WATERFALL_LEGEND,
                period: 'YTD',
              }),
              bottomKpiData: buildWaterfallChartKpiData({
                chart: waterfallMTDData['contribution']?.large,
                empty: waterfallMTDData['contribution']?.empty,
                legend: NR_WATERFALL_LEGEND,
                period: 'MTD',
              }),
            }}
            dataTestId={`${dataTestId}-country-performance-tool-waterfall-slide`}
          />
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        data-page-name={pageSections.marketShareWaterfall}
      >
        <TemplateSlide
          title={`${countryLabel} Market Share`}
          measure="[%]"
          period="YTD"
          footnotes=""
          countryId={countryId}
          headerDivider={false}
          dataTestId={`${dataTestId}-country-market-share-slide`}
        >
          <SlidePerformanceTool
            bigNumberData={bigNumbersMarketShareData['overtime-performance']}
            bigNumberRequest={bigNumbersMarketShareBffData}
            lineBarChartsData={overtimeMarketShareData['overtime-trends']}
            lineBarChartsRequest={overtimeMarketShareBffData}
          />
        </TemplateSlide>
      </StyledExportPageSection>

      <StyledExportPageSection
        data-page-name={pageSections.marketShareBrandsBreakdown}
      >
        <TemplateSlide
          title={`${countryLabel} Market Share Brands Breakdown`}
          measure="[%]"
          period={period}
          footnotes=""
          countryId={countryId}
          headerDivider={false}
          dataTestId={`${dataTestId}-market-share-waterfall-slide`}
        >
          <TopBottomWaterfallSlideContent
            chartHeight="155px"
            loading={
              waterfallMarketShareYTDBffData?.loading ||
              waterfallMarketShareMTDBffData?.loading ||
              false
            }
            error={
              waterfallMarketShareYTDBffData?.error ||
              waterfallMarketShareMTDBffData?.error ||
              undefined
            }
            data={{
              topKpiData: buildWaterfallChartKpiData({
                chart: waterfallMarketShareYTDData['contribution']?.large,
                empty: waterfallMarketShareYTDData['contribution']?.empty,
                legend: MARKET_SHARE_WATERFALL_LEGEND,
                period: 'YTD',
              }),
              bottomKpiData: buildWaterfallChartKpiData({
                chart: waterfallMarketShareMTDData['contribution']?.large,
                empty: waterfallMarketShareMTDData['contribution']?.empty,
                legend: MARKET_SHARE_WATERFALL_LEGEND,
                period: 'MTD',
              }),
            }}
            dataTestId={`${dataTestId}-country-market-share-waterfall-slide`}
          />
        </TemplateSlide>
      </StyledExportPageSection>
    </>
  );
};

export const VolumePprCountryFinancialExportSections = memo(
  VolumePprCountryFinancialExportSectionsComponent,
);
VolumePprCountryFinancialExportSections.displayName =
  'VolumePprCountryFinancialExportSections';

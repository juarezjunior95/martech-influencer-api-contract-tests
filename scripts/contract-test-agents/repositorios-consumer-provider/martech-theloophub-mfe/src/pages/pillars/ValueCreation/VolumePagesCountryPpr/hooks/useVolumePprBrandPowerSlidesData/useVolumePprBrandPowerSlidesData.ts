import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

export interface UseVolumePprBrandPowerSlidesDataResult {
  countryData: ReturnType<typeof useBffData>;
  breakdownSegmentsData: ReturnType<typeof useBffData>;
  sectionLoading: boolean;
}

const hasMetricData = (cell: any): boolean => {
  const values = cell?.chartData?.data;
  return Array.isArray(values) && values.length > 0;
};

const filterAbiBreakdownRows = (
  table?: TableDataType,
): TableDataType | undefined => {
  if (!table?.rows || !Array.isArray(table.rows)) return table;

  return {
    ...table,
    rows: table.rows.map((group: any[]) =>
      group.filter(
        (row) =>
          hasMetricData(row?.meaning_ac) &&
          hasMetricData(row?.difference_ac) &&
          hasMetricData(row?.salience_ac),
      ),
    ),
  };
};

export const useVolumePprBrandPowerSlidesData =
  (): UseVolumePprBrandPowerSlidesDataResult => {
    const overviewAbiData = useBffData({
      id: SharedKpis.BFF.OVERVIEW,
      kpiGroup: 'power',
      subFilters: {
        page_filter: 'All',
      },
    });

    const overviewMegabrandsData = useBffData({
      id: SharedKpis.BFF.OVERVIEW,
      kpiGroup: 'power',
      subFilters: {
        page_filter: 'Megabrands',
      },
    });

    const summaryForPowerData = useBffData({
      id: SharedKpis.BFF.SUMMARY_FOR_POWER,
      kpiGroup: 'power',
      subFilters: {
        page_filter: 'All',
      },
    });

    const breakdownPortfolioRequest = useBffData({
      id: SharedKpis.BFF.SUMMARY_FOR_POWER_BREAKDOWN,
      kpiGroup: 'power',
      subFilters: {
        page_filter: 'All',
        breakdown_filter: 'TT ABI Portfolio',
      },
    });

    const countryData = useMemo<ReturnType<typeof useBffData>>(() => {
      const summaryPowerBreakdown =
        breakdownPortfolioRequest.data?.summaryPowerBreakdown;
      return {
        ...overviewAbiData,
        data: {
          ABI: {
            [SharedKpis.PERFORMANCE_TREND.id]: {
              yearPowerVsAc: overviewAbiData.data?.yearPowerVsAc,
              trendOverTime: overviewAbiData.data?.trendOverTime,
              empty:
                overviewAbiData.data?.yearPowerVsAc?.empty ||
                overviewAbiData.data?.trendOverTime?.empty,
            },
            [SharedKpis.SEGMENT_PERFORMANCE.id]: {
              table: summaryForPowerData.data?.summaryPowerBySegmentPerformance,
            },
            [SharedKpis.PORTFOLIO_PERFORMANCE_BOOK.id]: {
              table:
                summaryForPowerData.data?.summaryPowerByPortfolioPerformance,
            },
          },
          Megabrands: {
            [SharedKpis.PERFORMANCE_TREND.id]: {
              yearPowerVsAc: overviewMegabrandsData.data?.yearPowerVsAc,
              trendOverTime: overviewMegabrandsData.data?.trendOverTime,
              empty:
                overviewMegabrandsData.data?.yearPowerVsAc?.empty ||
                overviewMegabrandsData.data?.trendOverTime?.empty ||
                false,
            },
          },
          Brands: {
            [SharedKpis.BRAND_BREAKDOWN.id]: {
              table:
                summaryPowerBreakdown &&
                Array.isArray(summaryPowerBreakdown.header) &&
                Array.isArray(summaryPowerBreakdown.rows)
                  ? filterAbiBreakdownRows(
                      summaryPowerBreakdown as TableDataType,
                    )
                  : summaryPowerBreakdown,
              tableComp:
                breakdownPortfolioRequest.data?.summaryPowerBreakdownComp,
            },
          },
        },
        loading:
          overviewAbiData.loading ||
          overviewMegabrandsData.loading ||
          summaryForPowerData.loading ||
          breakdownPortfolioRequest.loading,
        error:
          overviewAbiData.error ||
          overviewMegabrandsData.error ||
          summaryForPowerData.error ||
          breakdownPortfolioRequest.error,
        refetch: async () => {
          await Promise.all([
            overviewAbiData.refetch(),
            overviewMegabrandsData.refetch(),
            summaryForPowerData.refetch(),
            breakdownPortfolioRequest.refetch(),
          ]);
        },
      };
    }, [
      breakdownPortfolioRequest,
      overviewAbiData,
      overviewMegabrandsData,
      summaryForPowerData,
    ]);

    const breakdownSegmentsRequest = useBffData({
      id: SharedKpis.BFF.SUMMARY_FOR_POWER_BREAKDOWN,
      kpiGroup: 'power',
      subFilters: {
        page_filter: 'All',
        breakdown_filter: 'TT ABI Segment',
      },
    });

    const breakdownSegmentsData = useMemo<ReturnType<typeof useBffData>>(
      () => ({
        ...breakdownSegmentsRequest,
        data: {
          Brands: {
            [SharedKpis.BRAND_BREAKDOWN.id]: {
              table: breakdownSegmentsRequest.data?.summaryPowerBreakdown,
              tableComp:
                breakdownSegmentsRequest.data?.summaryPowerBreakdownComp,
            },
          },
        },
      }),
      [breakdownSegmentsRequest],
    );

    const sectionLoading = useMemo(
      () => countryData.loading || breakdownSegmentsData.loading,
      [countryData.loading, breakdownSegmentsData.loading],
    );

    return {
      countryData,
      breakdownSegmentsData,
      sectionLoading,
    };
  };

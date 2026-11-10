import { useMemo, useRef } from 'react';

import { Alert, DataStateHandler } from 'components';
import { RowActionTable } from 'pages/components';
import { AISummaryAlert } from 'pages/components/AISummary';
import { resolveHeightAfterAlerts } from 'pages/components/PortfolioBrand/helpers';
import {
  StyledBrandPowerBookExportContainer,
  StyledParagraph,
} from 'pages/components/PortfolioBrand/PortfolioBrand.styles';
import {
  brandBreakdownExportConfig,
  performanceConfig,
} from 'pages/components/RowActionTable/config';
import {
  filterAbiRows,
  filterCompetitorRows,
} from 'pages/components/RowActionTable/utils/mergeRowsInPairs';
import { BRAND_POWER_BOOK_EXPORT_PAGE_NAME } from 'pages/pillars/PortfolioBrand/BrandPowerBookExport/BrandPowerBookExport';
import { HeaderContainer } from 'pages/pillars/PortfolioBrand/BrandPowerBookExport/components/HeaderContainer';
import {
  BreakdownTableKpiData,
  TableKpiData,
} from 'pages/pillars/PortfolioBrand/BrandPowerBookExport/types';

import {
  SKELETON_BRAND_BREAKDOWN_HEIGHT_PX,
  SKELETON_TOTAL_TABLE_HEIGHT_PX,
  TABLE_ABI_BODY_AVAILABLE_HEIGHT_PX,
  TABLE_BREAKDOWN_BODY_AVAILABLE_HEIGHT_PX,
} from './constants';
import { StyledCountrySlideContainer } from './CountrySlide.styles';

interface CountrySlideProps {
  titlePower: string;
  titleBrandBreakdown: string;
  brandBreakdownKpiData: BreakdownTableKpiData;
  segmentPerformanceKpiData: TableKpiData;
  portfolioPerformanceKpiData: TableKpiData;
  alerts: string[];
  loading: boolean;
  error: Error | null;
  competitorView?: boolean;
  headerComponentParams?: Record<string, any>;
  shouldFilterBreakdownRows?: boolean;
  dataTestId?: string;
  aiSummary?: {
    id: string;
    subFilters?: Record<string, string>;
  };
}

const emptyTable = { header: [], rows: [] };

export const CountrySlide = ({
  titlePower,
  titleBrandBreakdown,
  brandBreakdownKpiData,
  segmentPerformanceKpiData,
  portfolioPerformanceKpiData,
  alerts,
  loading,
  error,
  competitorView = false,
  shouldFilterBreakdownRows = true,
  dataTestId,
  headerComponentParams,
  aiSummary,
}: CountrySlideProps) => {
  const filterFunction = useMemo(
    () => (competitorView ? filterAbiRows : filterCompetitorRows),
    [competitorView],
  );

  const breakdownTable = useMemo(() => {
    if (competitorView && shouldFilterBreakdownRows) {
      const filtered = filterAbiRows(
        brandBreakdownKpiData?.tableComp || emptyTable,
      );
      return {
        ...filtered,
        rows: [filtered.rows?.[0]?.slice(0, 23) || []],
      };
    }
    return brandBreakdownKpiData?.table || emptyTable;
  }, [brandBreakdownKpiData, competitorView, shouldFilterBreakdownRows]);

  const totalTable = useMemo(() => {
    if (loading) {
      return { header: [], rows: [] };
    }

    const segmentTable = filterFunction(
      segmentPerformanceKpiData?.table || emptyTable,
    );
    const portfolioTable = filterFunction(
      portfolioPerformanceKpiData?.table || emptyTable,
    );

    return {
      header: portfolioTable?.header || [],
      rows: [
        [
          ...(segmentTable?.rows ?? []).flat().map((row, index) => {
            return {
              ...row,
              id: {
                ...row?.id,
                value:
                  competitorView && row?.id?.value === 'TT ABI'
                    ? 'TT Comp'
                    : row?.id?.value,
                borderBottom:
                  index === (segmentTable?.rows ?? []).flat().length - 1,
              },
            };
          }),
          ...(competitorView
            ? []
            : (portfolioTable?.rows ?? [])
                .flat()
                .filter((row) => row?.id?.value !== 'TT ABI')),
        ],
      ],
    };
  }, [
    segmentPerformanceKpiData,
    portfolioPerformanceKpiData,
    filterFunction,
    loading,
    competitorView,
  ]);

  const hasAlerts = Boolean(alerts?.length);
  const alertRef = useRef<HTMLDivElement>(null);

  const brandBreakdownRowHeight = useMemo(() => {
    return (
      TABLE_BREAKDOWN_BODY_AVAILABLE_HEIGHT_PX /
      (breakdownTable?.rows?.[0]?.length || 1)
    );
  }, [breakdownTable, hasAlerts]);

  const totalTableRowHeight = useMemo(() => {
    const padding = hasAlerts ? 16 : 0;
    return (
      (resolveHeightAfterAlerts(
        TABLE_ABI_BODY_AVAILABLE_HEIGHT_PX,
        hasAlerts,
        hasAlerts ? alertRef.current : null,
      ) -
        padding) /
      (totalTable?.rows?.[0]?.length || 1)
    );
  }, [totalTable, hasAlerts]);

  const aiSummaryComponent = useMemo(() => {
    if (!aiSummary?.id) return null;

    return (
      <AISummaryAlert
        pageName={BRAND_POWER_BOOK_EXPORT_PAGE_NAME}
        summaryPageIdentifier={aiSummary.id}
        dataTestId={`ai-summary-${dataTestId}`}
        kpiGroup="power"
        subFilters={aiSummary.subFilters}
        hasExpandedAction={false}
      />
    );
  }, [aiSummary]);

  return (
    <StyledCountrySlideContainer
      hasAlert={hasAlerts}
      hasAiSummary={Boolean(aiSummaryComponent)}
      data-testid={dataTestId}
    >
      {aiSummaryComponent && (
        <div style={{ gridArea: 'ai-summary' }}>{aiSummaryComponent}</div>
      )}
      {hasAlerts && (
        <div ref={alertRef} style={{ gridArea: 'alert' }}>
          <Alert
            type="info"
            message={
              <>
                {alerts.map((alert, index) => (
                  <StyledParagraph key={alert + index}>{alert}</StyledParagraph>
                ))}
              </>
            }
          />
        </div>
      )}

      <div style={{ gridArea: 'brands' }}>
        <StyledBrandPowerBookExportContainer>
          <DataStateHandler
            error={error}
            loading={loading}
            empty={brandBreakdownKpiData?.table?.empty}
            skeletonProps={{
              height: `${SKELETON_BRAND_BREAKDOWN_HEIGHT_PX}px`,
              width: '100%',
              length: 1,
            }}
          >
            <HeaderContainer title={titleBrandBreakdown}>
              <RowActionTable
                rowHeight={brandBreakdownRowHeight}
                columnDefsConfig={(someRowWasSelected) =>
                  brandBreakdownExportConfig(
                    Boolean(someRowWasSelected),
                    headerComponentParams,
                  )
                }
                rowSelection={false}
                data={breakdownTable}
              />
            </HeaderContainer>
          </DataStateHandler>
        </StyledBrandPowerBookExportContainer>
      </div>

      <div style={{ gridArea: 'total' }}>
        <StyledBrandPowerBookExportContainer>
          <DataStateHandler
            error={error}
            loading={loading}
            empty={
              portfolioPerformanceKpiData?.table?.empty ||
              segmentPerformanceKpiData?.table?.empty
            }
            skeletonProps={{
              height: `${SKELETON_TOTAL_TABLE_HEIGHT_PX}px`,
              width: '100%',
              length: 1,
            }}
          >
            <HeaderContainer title={titlePower}>
              <RowActionTable
                rowHeight={totalTableRowHeight}
                columnDefsConfig={(someRowWasSelected) =>
                  performanceConfig(
                    Boolean(someRowWasSelected),
                    headerComponentParams,
                  )
                }
                rowSelection={false}
                data={totalTable}
              />
            </HeaderContainer>
          </DataStateHandler>
        </StyledBrandPowerBookExportContainer>
      </div>
    </StyledCountrySlideContainer>
  );
};

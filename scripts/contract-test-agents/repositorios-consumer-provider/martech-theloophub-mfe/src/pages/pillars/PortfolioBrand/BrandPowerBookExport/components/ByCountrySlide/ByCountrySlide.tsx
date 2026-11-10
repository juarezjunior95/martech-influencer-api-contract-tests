import { useMemo, useRef } from 'react';

import { Alert, DataStateHandler } from 'components';
import { RowActionTable } from 'pages/components';
import { AISummary } from 'pages/components/AISummary';
import { zoneMaturityConfig } from 'pages/components/RowActionTable/config';
import {
  filterAbiRows,
  filterCompetitorRows,
} from 'pages/components/RowActionTable/utils/mergeRowsInPairs';

import { BRAND_POWER_BOOK_EXPORT_PAGE_NAME } from '../../BrandPowerBookExport';
import {
  StyledBrandPowerBookExportContainer,
  StyledParagraph,
} from '../../BrandPowerBookExport.styles';
import { AI_SUMMARY_GLOBAL_IDENTIFIER } from '../../constants';
import { resolveHeightAfterAlerts } from '../../helpers';
import {
  PowerBigNumbersKpiData,
  TableDetailsKpiData,
  TableKpiData,
} from '../../types';
import { BrandPowerBigNumbers } from '../BrandPowerBigNumbers';
import { HeaderContainer } from '../HeaderContainer';
import {
  StyledByCountrySlideContainer,
  StyledTablesContainer,
} from './ByCountrySlide.styles';
import {
  ALERTS_CONTAINER_MARGIN_BOTTOM_PX,
  BIG_NUMBERS_AREA_HEIGHT_PX,
  BU_CHART_HEIGHT_PX,
  DETAILS_TABLES_TOTAL_HEIGHT_PX,
  MATURITY_BLOCK_HEIGHT_PX,
  MATURITY_TABLE_BODY_HEIGHT_PX,
  SKELETON_DETAILS_TABLE_HEIGHT_PX,
  SKELETON_ZONES_AREA_HEIGHT_PX,
  ZONE_MATURITY_AC_COLUMN_WIDTH_PX,
  ZONE_MATURITY_CHART_HEIGHT_PX,
  ZONES_SECTION_BASE_HEIGHT_PX,
  ZONES_STACK_GAP_PX,
} from './constants';
import { leftTableProcessing, rightTableProcessing } from './utils';

interface ByCountrySlideProps {
  bigNumbersKpiData: PowerBigNumbersKpiData;
  zoneKpiData: TableKpiData;
  maturityKpiData?: TableKpiData;
  nazKpiData: TableDetailsKpiData;
  sazKpiData: TableDetailsKpiData;
  mazKpiData: TableDetailsKpiData;
  apacKpiData: TableDetailsKpiData;
  afrKpiData: TableDetailsKpiData;
  eurKpiData: TableDetailsKpiData;
  alerts: string[];
  loading: boolean;
  error: Error | null;
  isCompetitor?: boolean;
  dataTestId?: string;
  section?: string;
}

const calculateGlobalScale = (
  leftTable: any,
  rightTable: any,
  field = 'ac',
): number => {
  let maxValue = 0;
  const extractMaxFromTable = (table: any) => {
    if (!table?.rows || !Array.isArray(table.rows) || table.rows.length === 0) {
      return;
    }
    const allRows = table.rows[0];

    if (!Array.isArray(allRows)) {
      return;
    }

    allRows.forEach((row: any) => {
      const config = row[field];
      if (config?.chartData?.data && Array.isArray(config.chartData.data)) {
        const cellMax = Math.max(...(config.chartData.data as number[]));
        maxValue = Math.max(maxValue, cellMax);
      }
    });
  };

  extractMaxFromTable(leftTable);
  extractMaxFromTable(rightTable);

  return maxValue;
};

export const ByCountrySlide = ({
  bigNumbersKpiData,
  zoneKpiData,
  maturityKpiData,
  nazKpiData,
  sazKpiData,
  mazKpiData,
  apacKpiData,
  afrKpiData,
  eurKpiData,
  alerts,
  loading,
  error,
  isCompetitor = false,
  dataTestId,
  section,
}: ByCountrySlideProps) => {
  const filterFunction = useMemo(
    () => (isCompetitor ? filterAbiRows : filterCompetitorRows),
    [isCompetitor],
  );

  const alertRef = useRef<HTMLDivElement>(null);
  const hasAlerts = (alerts?.length ?? 0) > 0;

  const availableDetailsTableHeight = useMemo(
    () =>
      resolveHeightAfterAlerts(
        DETAILS_TABLES_TOTAL_HEIGHT_PX,
        hasAlerts,
        alertRef.current,
      ),
    [hasAlerts, alerts],
  );

  const availableZoneTableHeight = useMemo(() => {
    const baseZoneHeight =
      ZONES_SECTION_BASE_HEIGHT_PX -
      (maturityKpiData ? MATURITY_BLOCK_HEIGHT_PX : 0);

    return resolveHeightAfterAlerts(
      baseZoneHeight,
      hasAlerts,
      alertRef.current,
    );
  }, [hasAlerts, maturityKpiData, alerts]);

  const availableMaturityTableHeight = useMemo(
    () => MATURITY_TABLE_BODY_HEIGHT_PX,
    [],
  );

  const leftTable = useMemo(
    () =>
      leftTableProcessing({
        loading,
        nazKpiData,
        sazKpiData,
        mazKpiData,
      }),
    [nazKpiData, sazKpiData, mazKpiData, loading],
  );

  const leftTableRowHeight = useMemo(() => {
    return availableDetailsTableHeight / (leftTable?.rows[0]?.length || 1);
  }, [availableDetailsTableHeight, leftTable]);

  const rightTable = useMemo(() => {
    return rightTableProcessing({
      loading,
      apacKpiData,
      afrKpiData,
      eurKpiData,
    });
  }, [apacKpiData, afrKpiData, eurKpiData, loading]);

  const rightTableRowHeight = useMemo(() => {
    return availableDetailsTableHeight / (rightTable?.rows[0]?.length || 1);
  }, [availableDetailsTableHeight, rightTable]);

  const globalScale = calculateGlobalScale(leftTable, rightTable, 'ac');

  const detailsEmpty =
    nazKpiData?.performanceDetails?.empty ||
    sazKpiData?.performanceDetails?.empty ||
    mazKpiData?.performanceDetails?.empty ||
    apacKpiData?.performanceDetails?.empty ||
    afrKpiData?.performanceDetails?.empty ||
    eurKpiData?.performanceDetails?.empty;

  const zoneData = useMemo(() => {
    return filterFunction(zoneKpiData?.table || { header: [], rows: [] });
  }, [filterFunction, zoneKpiData]);

  const maturityData = useMemo(() => {
    return filterFunction(maturityKpiData?.table || { header: [], rows: [] });
  }, [filterFunction, maturityKpiData]);

  const zoneTableRowHeight = useMemo(() => {
    return availableZoneTableHeight / (zoneData?.rows[0]?.length || 1);
  }, [availableZoneTableHeight, zoneData]);

  const maturityTableRowHeight = useMemo(() => {
    return availableMaturityTableHeight / (maturityData?.rows[0]?.length || 1);
  }, [availableMaturityTableHeight, maturityData]);

  const aiSummary = useMemo(() => {
    if (!section || !AI_SUMMARY_GLOBAL_IDENTIFIER[section]) return null;
    return (
      <AISummary
        pageName={BRAND_POWER_BOOK_EXPORT_PAGE_NAME}
        summaryPageIdentifier={AI_SUMMARY_GLOBAL_IDENTIFIER[section].id}
        dataTestId={`ai-summary-${section}`}
        kpiGroup="power"
        subFilters={AI_SUMMARY_GLOBAL_IDENTIFIER[section].subFilters}
        hasExpandedAction={false}
      />
    );
  }, [section]);

  return (
    <div data-testid={dataTestId}>
      {alerts && alerts.length > 0 && (
        <div
          ref={alertRef}
          style={{ marginBottom: `${ALERTS_CONTAINER_MARGIN_BOTTOM_PX}px` }}
        >
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
      {aiSummary && <div style={{ marginBottom: '24px' }}>{aiSummary}</div>}

      <StyledByCountrySlideContainer>
        <div
          style={{
            gridArea: 'bigNumber',
            height: `${BIG_NUMBERS_AREA_HEIGHT_PX}px`,
          }}
        >
          <BrandPowerBigNumbers
            loading={bigNumbersKpiData?.loading}
            error={error}
            powerVsLy={bigNumbersKpiData?.data?.['big-numbers-ly']}
            powerVsLq={bigNumbersKpiData?.data?.['big-numbers-lq']}
          />
        </div>

        <StyledTablesContainer>
          <StyledBrandPowerBookExportContainer>
            <DataStateHandler
              error={error}
              loading={loading}
              empty={detailsEmpty}
              skeletonProps={{
                height: `${SKELETON_DETAILS_TABLE_HEIGHT_PX}px`,
                width: '100%',
                length: 1,
              }}
            >
              <HeaderContainer title="ABI - BUs">
                <RowActionTable
                  rowHeight={leftTableRowHeight}
                  columnDefsConfig={() =>
                    zoneMaturityConfig({
                      someRowWasSelected: false,
                      chartHeight: BU_CHART_HEIGHT_PX,
                      globalScale,
                      acWidth: ZONE_MATURITY_AC_COLUMN_WIDTH_PX,
                    })
                  }
                  rowSelection={false}
                  data={leftTable}
                />
              </HeaderContainer>
            </DataStateHandler>
          </StyledBrandPowerBookExportContainer>

          <StyledBrandPowerBookExportContainer>
            <DataStateHandler
              error={error}
              loading={loading}
              empty={detailsEmpty}
              skeletonProps={{
                height: `${SKELETON_DETAILS_TABLE_HEIGHT_PX}px`,
                width: '100%',
                length: 1,
              }}
            >
              <HeaderContainer title="ABI - BUs">
                <RowActionTable
                  rowHeight={rightTableRowHeight}
                  columnDefsConfig={() =>
                    zoneMaturityConfig({
                      someRowWasSelected: false,
                      chartHeight: BU_CHART_HEIGHT_PX,
                      globalScale,
                      acWidth: ZONE_MATURITY_AC_COLUMN_WIDTH_PX,
                    })
                  }
                  rowSelection={false}
                  data={rightTable}
                />
              </HeaderContainer>
            </DataStateHandler>
          </StyledBrandPowerBookExportContainer>
        </StyledTablesContainer>

        <div style={{ gridArea: 'zones' }}>
          <DataStateHandler
            error={error}
            loading={loading}
            empty={zoneKpiData?.table?.empty}
            skeletonProps={{
              height: `${SKELETON_ZONES_AREA_HEIGHT_PX}px`,
              width: '100%',
              length: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${ZONES_STACK_GAP_PX}px`,
              }}
            >
              <StyledBrandPowerBookExportContainer>
                <HeaderContainer title="Zones">
                  <RowActionTable
                    rowHeight={zoneTableRowHeight}
                    columnDefsConfig={() =>
                      zoneMaturityConfig({
                        someRowWasSelected: false,
                        chartHeight: ZONE_MATURITY_CHART_HEIGHT_PX,
                        acWidth: ZONE_MATURITY_AC_COLUMN_WIDTH_PX,
                      })
                    }
                    rowSelection={false}
                    data={zoneData}
                  />
                </HeaderContainer>
              </StyledBrandPowerBookExportContainer>
              {maturityKpiData && (
                <StyledBrandPowerBookExportContainer>
                  <HeaderContainer title="Maturity">
                    <RowActionTable
                      rowHeight={maturityTableRowHeight}
                      columnDefsConfig={() =>
                        zoneMaturityConfig({
                          someRowWasSelected: false,
                          chartHeight: ZONE_MATURITY_CHART_HEIGHT_PX,
                          acWidth: ZONE_MATURITY_AC_COLUMN_WIDTH_PX,
                        })
                      }
                      rowSelection={false}
                      data={maturityData}
                    />
                  </HeaderContainer>
                </StyledBrandPowerBookExportContainer>
              )}
            </div>
          </DataStateHandler>
        </div>
      </StyledByCountrySlideContainer>
    </div>
  );
};

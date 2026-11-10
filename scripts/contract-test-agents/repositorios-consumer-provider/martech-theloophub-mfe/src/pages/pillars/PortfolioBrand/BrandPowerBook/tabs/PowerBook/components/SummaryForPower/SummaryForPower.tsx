import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { BasicContainer, ExpandButtonWithImg } from 'components';
import { useGoogleAnalytics, usePageFilterApplied } from 'hooks';
import { ContentHeader } from 'pages/components';
import {
  brandBreakdownConfig,
  brandBreakdownConfigEmptyState,
  performanceConfig,
} from 'pages/components/RowActionTable/config';
import { filterCompetitorRows } from 'pages/components/RowActionTable/utils/mergeRowsInPairs';
import { BRAND_POWER_BOOK_PAGE_NAME } from 'pages/pillars/PortfolioBrand/BrandPowerBook/BrandPowerBook';
import { StyledCardContainer, StyledTooltip } from 'shared/Styles';

import { brandBreakdownEmptyTable } from '../../constants';
import { BrandBreakdownTable } from '../BrandBreakdownTable';
import { ShowCompetitorToggle } from '../ShowCompetitorToggle/ShowCompetitorToggle';
import { TableCard } from '../TableCard';
import { useBrandBreakdownData, useSummaryForPowerPerformance } from './hooks';
import {
  StyledSummaryForPowerContainer,
  StyledSummaryForPowerPerformance,
} from './SummaryForPower.styles';

interface SummaryForPowerProps {
  dataTestId?: string;
}

export const SummaryForPower = ({ dataTestId }: SummaryForPowerProps) => {
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(BRAND_POWER_BOOK_PAGE_NAME);
  const trackGA = useGoogleAnalytics();
  const [showCompetitor, setShowCompetitor] = useState(false);
  const [showCompetitorDisabled, setShowCompetitorDisabled] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState('');
  const clearSegmentSelectionRef = useRef<() => void>();
  const clearPortfolioSelectionRef = useRef<() => void>();
  const rowSelectionSegmentRef = useRef<(id: string) => void>();
  const rowSelectionPortfolioRef = useRef<(id: string) => void>();
  const [isExpanded, setIsExpanded] = useState(false);

  const subScopeFilter = String(applied?.sub_scopes || 'All');

  const {
    segment: segmentPerformanceRequest,
    portfolio: portfolioPerformanceRequest,
  } = useSummaryForPowerPerformance({
    subScopeFilter,
  });

  const brandBreakdownRequest = useBrandBreakdownData({
    subScopeFilter,
    selectedPerformance,
  });

  const handleGAEvent = (label: string) => {
    if (!label) return;
    try {
      trackGA({
        event_category: 'Summary For Power Competitor Filter',
        event_action: 'Click',
        event_label: label,
      });
    } catch (error) {
      console.error('Failed to track Google Analytics event:', error);
    }
  };

  const handleSegmentSelection = useCallback((rowId: string) => {
    const finalRowId = rowId === 'TT ABI' ? 'TT ABI Segment' : rowId;
    setSelectedPerformance(finalRowId);
    setShowCompetitorDisabled(false);
    clearPortfolioSelectionRef.current?.();
  }, []);

  const handlePortfolioSelection = useCallback((rowId: string) => {
    const finalRowId = rowId === 'TT ABI' ? 'TT ABI Portfolio' : rowId;
    setSelectedPerformance(finalRowId);
    setShowCompetitorDisabled(true);
    setShowCompetitor(false);
    clearSegmentSelectionRef.current?.();
  }, []);

  const segmentData = useMemo(() => {
    if (segmentPerformanceRequest.loading) return { header: [], rows: [] };
    if (showCompetitor) {
      return segmentPerformanceRequest.data?.summaryPowerBySegmentPerformance;
    }
    return filterCompetitorRows(
      segmentPerformanceRequest.data?.summaryPowerBySegmentPerformance,
    );
  }, [showCompetitor, segmentPerformanceRequest]);

  const portfolioPerformanceData = useMemo(() => {
    if (portfolioPerformanceRequest.loading) return { header: [], rows: [] };
    return filterCompetitorRows(
      portfolioPerformanceRequest.data?.summaryPowerByPortfolioPerformance,
    );
  }, [portfolioPerformanceRequest]);

  const brandBreakdownData = useMemo(() => {
    if (brandBreakdownRequest.loading) return { header: [], rows: [] };
    if (showCompetitor)
      return brandBreakdownRequest.data?.summaryPowerBreakdownComp;
    return brandBreakdownRequest.data?.summaryPowerBreakdown;
  }, [brandBreakdownRequest, showCompetitor]);

  useEffect(() => {
    if (applied?.scopes === 'portfolio') {
      setShowCompetitor(false);
      setShowCompetitorDisabled(true);
    } else {
      setShowCompetitorDisabled(false);
    }
    setSelectedPerformance('');
  }, [applied?.scopes]);

  useEffect(() => {
    if (selectedPerformance) {
      rowSelectionSegmentRef.current?.(
        selectedPerformance.replace(' Segment', ''),
      );
    }
  }, [
    showCompetitor,
    selectedPerformance,
    segmentData,
    handleSegmentSelection,
  ]);

  useEffect(() => {
    if (
      segmentPerformanceRequest.loading ||
      portfolioPerformanceRequest.loading
    )
      return;

    setTimeout(() => {
      if (applied?.scopes === 'portfolio') {
        rowSelectionPortfolioRef.current?.(applied?.sub_scopes as string);
      }
      if (applied?.scopes === 'segment') {
        rowSelectionSegmentRef.current?.(applied?.sub_scopes as string);
      }
    }, 100);
  }, [
    applied?.scopes,
    applied?.sub_scopes,
    segmentPerformanceRequest.loading,
    portfolioPerformanceRequest.loading,
  ]);

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.title',
        }),
        titleSize: 'H3',
      }}
      layout={{ bodyPadding: false }}
      dataTestId={dataTestId}
    >
      <StyledSummaryForPowerContainer>
        <StyledSummaryForPowerPerformance>
          <TableCard
            title={formatMessage({
              id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.segmentPerformance.title',
            })}
            subtitle={formatMessage({
              id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.segmentPerformance.subtitle',
            })}
            rightContent={
              <ShowCompetitorToggle
                showCompetitor={showCompetitor}
                setShowCompetitor={setShowCompetitor}
                isDisabled={showCompetitorDisabled}
                handleGAEvent={handleGAEvent}
              />
            }
            loading={segmentPerformanceRequest.loading}
            error={segmentPerformanceRequest.error}
            data={segmentData}
            columnDefsConfig={performanceConfig}
            rowSelection
            onChangeRows={handleSegmentSelection}
            byCompetitor={showCompetitor}
            setClearSelectionHandler={(fn) =>
              (clearSegmentSelectionRef.current = fn)
            }
            setRowSelectionHandler={(fn) =>
              (rowSelectionSegmentRef.current = fn)
            }
            fixedHeight="313px"
            dataTestId={dataTestId ? `${dataTestId}-segment` : undefined}
          />

          <TableCard
            title={formatMessage({
              id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.portfolioPerformance.title',
            })}
            subtitle={formatMessage({
              id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.portfolioPerformance.subtitle',
            })}
            loading={portfolioPerformanceRequest.loading}
            error={portfolioPerformanceRequest.error}
            data={portfolioPerformanceData}
            columnDefsConfig={performanceConfig}
            rowSelection
            onChangeRows={handlePortfolioSelection}
            setClearSelectionHandler={(fn) =>
              (clearPortfolioSelectionRef.current = fn)
            }
            setRowSelectionHandler={(fn) =>
              (rowSelectionPortfolioRef.current = fn)
            }
            fixedHeight="313px"
            dataTestId={dataTestId ? `${dataTestId}-portfolio` : undefined}
          />
        </StyledSummaryForPowerPerformance>

        <StyledCardContainer>
          <ContentHeader
            title={formatMessage({
              id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.brandBreakdown.title',
            })}
            tooltip={
              <StyledTooltip>
                {formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.brandBreakdown.tooltip',
                })}
              </StyledTooltip>
            }
            rightContent={
              <ExpandButtonWithImg
                value={isExpanded}
                onValueChange={setIsExpanded}
                size="small"
                disabled={!selectedPerformance}
              />
            }
          />

          <BrandBreakdownTable
            loading={brandBreakdownRequest.loading}
            selectedPerformance={selectedPerformance}
            isExpanded={isExpanded}
            data={brandBreakdownData}
            emptyTable={brandBreakdownEmptyTable}
            config={
              selectedPerformance
                ? brandBreakdownConfig
                : brandBreakdownConfigEmptyState
            }
            formatMessage={formatMessage}
            dataTestId={
              dataTestId ? `${dataTestId}-brand-breakdown` : undefined
            }
          />
        </StyledCardContainer>
      </StyledSummaryForPowerContainer>
    </BasicContainer>
  );
};

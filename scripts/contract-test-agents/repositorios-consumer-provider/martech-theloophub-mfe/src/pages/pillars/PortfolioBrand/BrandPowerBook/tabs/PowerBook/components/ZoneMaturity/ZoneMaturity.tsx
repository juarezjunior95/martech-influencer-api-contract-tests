import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';
import { BasicContainer, DataStateHandler } from 'components';
import { useGoogleAnalytics, usePageFilterApplied } from 'hooks';
import { ContentHeader, PowerLegend, RowActionTable } from 'pages/components';
import { zoneMaturityConfig } from 'pages/components/RowActionTable/config';
import { filterCompetitorRows } from 'pages/components/RowActionTable/utils/mergeRowsInPairs';
import { BRAND_POWER_BOOK_PAGE_NAME } from 'pages/pillars/PortfolioBrand/BrandPowerBook/BrandPowerBook';
import { zoneMaturityEmptyTable } from 'pages/pillars/PortfolioBrand/BrandPowerBook/tabs/PowerBook/constants';
import {
  StyledCardContainer,
  StyledLeftContainer,
  StyledRightContainer,
} from 'shared/Styles';

import { StyledPaddingContainer } from '../../PowerBook.styles';
import { ShowCompetitorToggle } from '../ShowCompetitorToggle/ShowCompetitorToggle';
import { useZoneMaturityData, useZoneMaturityDetails } from './hooks';
import {
  DEFAULT_BU_LABEL,
  LEFT_SKELETON_PROPS,
  RIGHT_SKELETON_PROPS,
  TABLE_FIXED_HEIGHT,
} from './ZoneMaturity.constants';
import {
  StyledZoneMaturityControlsContainer,
  StyledZoneMaturityFlexContainer,
  StyledZoneMaturityLegendContainer,
} from './ZoneMaturity.styles';
import { RowSelectionHandler, ViewType } from './ZoneMaturity.types';

interface ZoneMaturityProps {
  dataTestId?: string;
}

export const ZoneMaturity = ({ dataTestId }: ZoneMaturityProps) => {
  const trackGA = useGoogleAnalytics();
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(BRAND_POWER_BOOK_PAGE_NAME);

  const [selectedRow, setSelectedRow] = useState('');
  const [showCompetitor, setShowCompetitor] = useState(false);
  const [isShowCompetitorDisabled, setIsShowCompetitorDisabled] =
    useState(false);
  const [view, setView] = useState<ViewType>('zone');
  const setRowSelectionHandler = useRef<RowSelectionHandler | null>(null);

  const subScopeFilter = String(applied?.sub_scopes || 'All');

  const { zone: zoneRequest, maturity: maturityRequest } = useZoneMaturityData({
    subScopeFilter,
  });

  const detailsRequest = useZoneMaturityDetails({
    subScopeFilter,
    selectedRow,
  });

  const handleGAEvent = (category: string, action: string, label: string) => {
    if (!label) return;

    try {
      trackGA({
        event_category: category,
        event_action: action,
        event_label: label,
      });
    } catch (error) {
      console.error('Failed to track Google Analytics event:', error);
    }
  };
  const handleCompetitorGAEvent = (label: string) => {
    handleGAEvent('Performance Breakdown Competitor Filter', 'Click', label);
  };

  const byCompetitor = useMemo(() => {
    if (applied?.sub_scopes === 'Heineken') return true;
    return showCompetitor;
  }, [showCompetitor, applied?.sub_scopes]);

  const mainData = useMemo(() => {
    const kpi = view === 'zone' ? zoneRequest : maturityRequest;

    if (kpi.loading || !kpi.data?.table) return { header: [], rows: [] };

    if (byCompetitor) {
      return kpi.data?.table;
    }
    return filterCompetitorRows(kpi.data?.table);
  }, [view, byCompetitor, zoneRequest, maturityRequest]);

  const selectedDetails = useMemo(() => {
    if (!selectedRow || detailsRequest.loading) return { header: [], rows: [] };

    if (byCompetitor) {
      return detailsRequest.data?.performanceDetails;
    }
    return filterCompetitorRows(detailsRequest.data?.performanceDetails);
  }, [byCompetitor, selectedRow, detailsRequest]);

  const isPerformanceLoading = zoneRequest.loading || maturityRequest.loading;

  const handleShowCompetitor = useCallback(() => {
    setShowCompetitor((state) => !state);

    queueMicrotask(() => {
      if (setRowSelectionHandler.current) {
        setRowSelectionHandler.current(selectedRow);
      }
    });
  }, [setRowSelectionHandler, selectedRow]);

  useEffect(() => {
    if (
      applied?.scopes === 'global_brands' ||
      applied?.scopes === 'portfolio'
    ) {
      setShowCompetitor(false);
      setIsShowCompetitorDisabled(true);
    } else {
      setIsShowCompetitorDisabled(false);
    }

    setSelectedRow('');
  }, [applied?.scopes]);

  const renderRightHeader = () => {
    const title = `${selectedRow || DEFAULT_BU_LABEL} Details`;
    const subtitle =
      formatMessage({
        id:
          'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.details.' +
          view,
      }) +
      ' ' +
      (selectedRow || DEFAULT_BU_LABEL);
    return <ContentHeader title={title} subtitle={subtitle} />;
  };

  const renderRightTable = () => {
    if (selectedRow) {
      return (
        <DataStateHandler
          loading={detailsRequest.loading}
          error={detailsRequest.error}
          empty={
            !detailsRequest.data?.performanceDetails ||
            selectedDetails.rows.length === 0
          }
          skeletonProps={RIGHT_SKELETON_PROPS}
        >
          <RowActionTable
            data={selectedDetails}
            byCompetitor={showCompetitor}
            rowSelection={false}
            fixedHeight={TABLE_FIXED_HEIGHT}
            columnDefsConfig={() =>
              zoneMaturityConfig({
                someRowWasSelected: false,
                chartHeight: 24,
              })
            }
          />
        </DataStateHandler>
      );
    }

    return (
      <RowActionTable
        data={zoneMaturityEmptyTable}
        rowSelection={false}
        fixedHeight={TABLE_FIXED_HEIGHT}
        columnDefsConfig={() =>
          zoneMaturityConfig({
            someRowWasSelected: false,
            chartHeight: 24,
          })
        }
        noRowsMessage={{
          title: formatMessage({
            id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.details.noRowsMessage.title',
          }),
          description: formatMessage({
            id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.details.noRowsMessage.description',
          }),
        }}
      />
    );
  };

  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.title',
        }),
        titleSize: 'H3',
      }}
      layout={{
        bodyPadding: false,
      }}
      dataTestId={dataTestId}
    >
      <StyledPaddingContainer>
        <StyledZoneMaturityControlsContainer>
          <ShowCompetitorToggle
            handleGAEvent={handleCompetitorGAEvent}
            showCompetitor={showCompetitor}
            setShowCompetitor={handleShowCompetitor}
            isDisabled={isShowCompetitorDisabled}
          />
          <SegmentedControl
            options={[
              {
                label: formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.zoneMaturity.zone',
                }),
                value: 'zone',
              },
              {
                label: formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.zoneMaturity.maturity',
                }),
                value: 'maturity',
              },
            ]}
            onValueChange={(value) => {
              setView(value as ViewType);
              setSelectedRow('');
              handleGAEvent(
                'Performance Breakdown View Type Filter',
                'Click',
                value,
              );
            }}
            value={view}
          />
        </StyledZoneMaturityControlsContainer>

        <StyledCardContainer>
          <StyledZoneMaturityFlexContainer>
            <StyledLeftContainer>
              <ContentHeader
                title={formatMessage({
                  id: `PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.performance.${view}`,
                })}
                subtitle={`${formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.performance.subtitle',
                })} ${formatMessage({
                  id:
                    'PortfolioBrand.BrandPowerBook.PowerBook.zoneMaturity.' +
                    view,
                })}`}
              />
            </StyledLeftContainer>
            <StyledRightContainer>{renderRightHeader()}</StyledRightContainer>
          </StyledZoneMaturityFlexContainer>

          <StyledZoneMaturityFlexContainer>
            <StyledLeftContainer>
              <DataStateHandler
                loading={isPerformanceLoading}
                error={zoneRequest.error || maturityRequest.error}
                empty={mainData.rows.length === 0}
                skeletonProps={LEFT_SKELETON_PROPS}
              >
                <RowActionTable
                  key="zone-maturity-table"
                  data={mainData}
                  onChangeRows={setSelectedRow}
                  byCompetitor={showCompetitor}
                  fixedHeight={TABLE_FIXED_HEIGHT}
                  columnDefsConfig={() =>
                    zoneMaturityConfig({
                      someRowWasSelected: false,
                      chartHeight: 24,
                    })
                  }
                  setRowSelectionHandler={(fn) =>
                    (setRowSelectionHandler.current = fn)
                  }
                />
              </DataStateHandler>
            </StyledLeftContainer>
            <StyledRightContainer>{renderRightTable()}</StyledRightContainer>
          </StyledZoneMaturityFlexContainer>

          <StyledZoneMaturityLegendContainer>
            <PowerLegend
              loading={zoneRequest.loading}
              data={zoneRequest.data?.legend || []}
            />
          </StyledZoneMaturityLegendContainer>
        </StyledCardContainer>
      </StyledPaddingContainer>
    </BasicContainer>
  );
};

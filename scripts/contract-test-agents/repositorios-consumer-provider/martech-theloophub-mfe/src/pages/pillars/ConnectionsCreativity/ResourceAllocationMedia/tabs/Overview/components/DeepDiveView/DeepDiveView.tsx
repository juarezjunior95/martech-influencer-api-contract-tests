import { useState } from 'react';

import { Expandable, Legend } from 'components';
import { AgGridData } from 'components/Table/types';
import { useGoogleAnalytics } from 'hooks';
import { LEGEND_CONFIG } from 'pages/constants';

import { VIEW_TYPES } from '../../constants';
import {
  ResourceAllocationChart,
  ResourceAllocationData,
  ResourceAllocationOverview,
} from '../../types';
import DeepDiveHeader from '../DeepDiveHeader/DeepDiveHeader';
import { RankingView } from '../RankingView/RankingView';
import { TableView } from '../TableView/TableView';
import {
  StyledDeepDiveBreakdownViewContainer,
  StyledDeepDiveRankingViewContainer,
} from './DeepDiveView.styles';

interface DeepDiveViewProps {
  dataSource: {
    charts: {
      data: ResourceAllocationOverview;
      loading: boolean;
      available: boolean;
    };
    table: {
      data: AgGridData;
      loading: boolean;
      available: boolean;
    };
    ranking: {
      data: ResourceAllocationChart;
      loading: boolean;
      available: boolean;
    };
  };
  activeDeepDiveSubfilter: string;
  isBreakdownViewer: boolean;
  dataTestId?: string;
}

const extractChartData = (
  data: ResourceAllocationChart | undefined,
): ResourceAllocationData | undefined => {
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  const dataWithDatasets = data as ResourceAllocationData;
  if (dataWithDatasets.datasets) {
    return dataWithDatasets;
  }
  return Object.values(data)[0] as ResourceAllocationData;
};

export const DeepDiveView = ({
  dataSource,
  activeDeepDiveSubfilter,
  isBreakdownViewer,
  dataTestId,
}: DeepDiveViewProps) => {
  const trackGA = useGoogleAnalytics();
  const [selectedView, setSelectedView] = useState(
    isBreakdownViewer ? VIEW_TYPES.BREAKDOWN : VIEW_TYPES.RANKING,
  );

  const handleViewChange = (view: string) => {
    try {
      trackGA({
        event_category: 'Deep Dive View Select',
        event_action: 'Select',
        event_label: view,
      });
    } catch (error) {
      console.error('Failed to track Google Analytics event:', error);
    }
    setSelectedView(view);
  };

  const tableData =
    dataSource?.table?.data != null && activeDeepDiveSubfilter != null
      ? dataSource.table.data[activeDeepDiveSubfilter]
      : undefined;
  const rankingData =
    dataSource?.ranking?.data != null && activeDeepDiveSubfilter != null
      ? dataSource.ranking.data[activeDeepDiveSubfilter]
      : undefined;

  const extractedChartData = extractChartData(rankingData);

  return (
    <Expandable.Item
      data-testid={dataTestId ? `${dataTestId}-deep-dive-view` : undefined}
      id="overview-deep-dive"
      expand="none"
      expandedHeaderHeight="70px"
      borderBottom="hidden"
      headerCustomized={
        <DeepDiveHeader
          dataTestId={
            dataTestId ? `${dataTestId}-deep-dive-view-header` : undefined
          }
          selectedView={selectedView}
          onViewChange={handleViewChange}
          isBreakdownViewer={isBreakdownViewer}
        />
      }
      expandableChildren={
        <>
          {selectedView === VIEW_TYPES.BREAKDOWN && (
            <StyledDeepDiveBreakdownViewContainer
              data-testid={
                dataTestId
                  ? `${dataTestId}-deep-dive-view-breakdown`
                  : undefined
              }
            >
              <TableView
                tableData={tableData}
                loadingTableBreakdown={dataSource.table.loading}
                selectedView={VIEW_TYPES.BREAKDOWN}
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-deep-dive-view-breakdown-table`
                    : undefined
                }
              />
            </StyledDeepDiveBreakdownViewContainer>
          )}
          {selectedView === VIEW_TYPES.RANKING && (
            <div
              style={{
                marginBottom: extractedChartData?.datasets?.[0]?.baseChartColor
                  ? '8px'
                  : '24px',
              }}
            >
              <StyledDeepDiveRankingViewContainer
                data-testid={
                  dataTestId
                    ? `${dataTestId}-deep-dive-view-ranking`
                    : undefined
                }
              >
                <RankingView
                  data={rankingData}
                  loadingRanking={dataSource.ranking.loading}
                  selectedView={VIEW_TYPES.RANKING}
                  dataTestId={
                    dataTestId
                      ? `${dataTestId}-deep-dive-view-ranking-chart`
                      : undefined
                  }
                />
              </StyledDeepDiveRankingViewContainer>
              {extractedChartData?.datasets?.[0]?.baseChartColor && (
                <div
                  style={{ display: 'flex', marginLeft: '24px' }}
                  data-testid={
                    dataTestId
                      ? `${dataTestId}-deep-dive-view-ranking-legend-wrapper`
                      : undefined
                  }
                >
                  <Legend
                    legendPosition="left"
                    caption={LEGEND_CONFIG.map((item) => ({
                      ...item,
                      pointStyle: 'roundedRectangle',
                    }))}
                    dataTestId={
                      dataTestId
                        ? `${dataTestId}-deep-dive-view-ranking-legend`
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          )}
        </>
      }
    />
  );
};

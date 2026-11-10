import { useMemo } from 'react';

import { ComparisonLine, DataStateHandler, Line, Skeleton } from 'components';
import { LineChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';
import { StyledSectionHeaderContainer } from 'pages/pillars/ValueCreation/VolumePages/VolumePages.styles';

import {
  DEFAULT_LABEL_COLORS,
  GLOBAL_VOLUME_LINE_CHART_COLOR_CONFIG,
  GLOBAL_VOLUME_LINE_CHART_LABEL_CHIP_BG_CONFIG,
} from '../../../constants/lineChartConfig';

interface LineChartSectionProps {
  loading: boolean;
  error: Error | null;
  data: LineChartKpiData;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
  chartHeight?: string;
  sectionHeader?: React.ReactNode;
  comparisonConfig?: {
    marginTop?: string | number;
    borderConfig?: React.ComponentProps<typeof ComparisonLine>['borderConfig'];
    gridConfig?: React.ComponentProps<typeof ComparisonLine>['gridConfig'];
  };
  dataTestId?: string;
}

export const LineChartSection: React.FC<LineChartSectionProps> = ({
  loading,
  error,
  data,
  skeletonProps = {
    height: '396px',
    width: '100%',
    length: 1,
    borderRadius: 'medium',
  },
  chartHeight = '160px',
  sectionHeader,
  comparisonConfig,
  dataTestId,
}) => {
  const lineOptions = useMemo(
    () => ({
      layout: { padding: { top: 0 } },
      animation: { duration: 0 },
      scales: {
        y: {
          suggestedMin: data?.suggestedMin,
          suggestedMax: data?.suggestedMax,
        },
      },
    }),
    [data?.suggestedMin, data?.suggestedMax],
  );

  const lineDatasets = useMemo(() => {
    return (
      data?.datasets?.map((dataset) => ({
        ...dataset,
        borderColor:
          GLOBAL_VOLUME_LINE_CHART_COLOR_CONFIG[dataset.label] ||
          dataset.borderColor ||
          '#DEB333',
        pointBackgroundColor:
          GLOBAL_VOLUME_LINE_CHART_COLOR_CONFIG[dataset.label] ||
          dataset.pointBackgroundColor ||
          '#EDCD20',
        borderDash: dataset.label === 'Budget' ? [8, 8] : undefined,
      })) ?? []
    );
  }, [data?.datasets]);

  const lineLabelChipColors = useMemo(() => {
    if (!data?.datasets) return undefined;
    const hasCustom = data.datasets.some(
      (ds) => GLOBAL_VOLUME_LINE_CHART_LABEL_CHIP_BG_CONFIG[ds.label],
    );
    if (!hasCustom) return undefined;
    return data.datasets.map(
      (dataset) => GLOBAL_VOLUME_LINE_CHART_LABEL_CHIP_BG_CONFIG[dataset.label],
    );
  }, [data?.datasets]);

  return (
    <DataStateHandler
      dataTestId={dataTestId ? `${dataTestId}-line-chart-section` : undefined}
      loading={loading}
      error={error}
      empty={data?.empty}
      skeletonProps={skeletonProps}
    >
      {sectionHeader && (
        <StyledSectionHeaderContainer
          data-testid={
            dataTestId ? `line-chart-section-header-${dataTestId}` : undefined
          }
        >
          {sectionHeader}
        </StyledSectionHeaderContainer>
      )}
      <div style={{ height: chartHeight }}>
        <Line
          dataTestId={
            dataTestId ? `${dataTestId}-line-chart-section` : undefined
          }
          datasets={lineDatasets || []}
          formattedData={data?.formattedData}
          labels={data?.labels}
          highlightLabels={data?.highlightLabels}
          axisType="none"
          showGrid={false}
          labelColors={DEFAULT_LABEL_COLORS}
          labelChipColors={lineLabelChipColors}
          options={lineOptions}
          labelChip
        />
      </div>
      <div style={{ marginTop: comparisonConfig?.marginTop || 0 }}>
        <ComparisonLine
          dataTestId={
            dataTestId ? `${dataTestId}-line-chart-section` : undefined
          }
          data={data?.comparisonLine?.data || []}
          gridColumnsLength={data?.labels?.length}
          borderConfig={
            comparisonConfig?.borderConfig || { marginLeft: 8, marginRight: 8 }
          }
          gridConfig={
            comparisonConfig?.gridConfig || { paddingLeft: 8, paddingRight: 8 }
          }
          size="large"
        />
      </div>
    </DataStateHandler>
  );
};

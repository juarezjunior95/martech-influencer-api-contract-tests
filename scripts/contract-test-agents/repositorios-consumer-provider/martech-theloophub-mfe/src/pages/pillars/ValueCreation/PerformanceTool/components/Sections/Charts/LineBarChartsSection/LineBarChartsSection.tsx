import {
  BasicContainer,
  ChartLegend,
  DataStateHandler,
  Skeleton,
} from 'components';
import { LineBarChartsGrid } from 'pages/pillars/ValueCreation/PerformanceTool/components/LineBarChartsGrid/LineBarChartsGrid';
import { useLineBarChartDatasets } from 'pages/pillars/ValueCreation/PerformanceTool/hooks/useLineBarChartDatasets/useLineBarChartDatasets';
import { LineBarChartsSectionData } from 'pages/pillars/ValueCreation/PerformanceTool/types';

import {
  StyledBodyContainer,
  StyledChartContainer,
  StyledChartsWrapper,
  StyledLegendContainer,
  StyledLineBarChartsGrid,
} from './LineBarChartsSection.styles';

interface LineBarChartsSectionProps {
  title: string;
  measure?: string;
  tooltip?: string;
  data?: LineBarChartsSectionData;
  loading: boolean;
  error?: Error | null;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
  showLineDataLabels?: boolean;
}

export const LineBarChartsSection: React.FC<LineBarChartsSectionProps> = ({
  title,
  measure,
  tooltip,
  loading,
  error,
  data,
  skeletonProps = {
    height: '328px',
    width: '100%',
    length: 1,
    borderRadius: 'none',
  },
  showLineDataLabels = true,
}) => {
  const {
    legendItems,
    lineDatasets,
    barDatasets,
    highlightedIndexes,
    barOptions,
  } = useLineBarChartDatasets(data);

  return (
    <BasicContainer
      header={{
        title,
        measure,
        tooltip,
        tooltipBackgroundTransparent: true,
        titleSize: 'H4',
      }}
      layout={{
        border: 'small',
        shadow: 'small',
        headerPadding: 'medium',
        bodyPadding: false,
        bottomSeparator: 'border',
      }}
    >
      <DataStateHandler
        loading={loading}
        error={error}
        empty={!data || !!data?.empty}
        skeletonProps={skeletonProps}
      >
        <StyledBodyContainer>
          <StyledLegendContainer>
            <ChartLegend items={legendItems} />
          </StyledLegendContainer>
          <StyledChartsWrapper>
            <LineBarChartsGrid
              data={data}
              lineDatasets={lineDatasets}
              barDatasets={barDatasets}
              highlightedIndexes={highlightedIndexes}
              barOptions={barOptions}
              showLineDataLabels={showLineDataLabels}
              ChartsGrid={StyledLineBarChartsGrid}
              LineChartContainer={StyledChartContainer}
              BarChartContainer={StyledChartContainer}
            />
          </StyledChartsWrapper>
        </StyledBodyContainer>
      </DataStateHandler>
    </BasicContainer>
  );
};

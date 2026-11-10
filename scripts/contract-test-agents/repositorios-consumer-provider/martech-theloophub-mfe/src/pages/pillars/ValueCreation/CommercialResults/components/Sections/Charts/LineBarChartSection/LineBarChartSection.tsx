import {
  BasicContainer,
  ChartLegend,
  DataStateHandler,
  SkeletonProps,
} from 'components';
import { UseLineBarChartData } from 'pages/pillars/ValueCreation/CommercialResults/types';
import { LineBarChartsGrid } from 'pages/pillars/ValueCreation/PerformanceTool/components/LineBarChartsGrid/LineBarChartsGrid';
import { useLineBarChartDatasets } from 'pages/pillars/ValueCreation/PerformanceTool/hooks/useLineBarChartDatasets/useLineBarChartDatasets';

import {
  StyledBodyContainer,
  StyledChartContainer,
  StyledChartsWrapper,
  StyledChartWrapper,
  StyledLegendContainer,
  StyledLineBarChartsGrid,
  StyledSubtitle,
} from './LineBarChartSection.styles';

interface LineBarChartsSectionProps {
  measure?: string;
  lineBarChartData: UseLineBarChartData;
  skeletonProps: SkeletonProps;
}

export const LineBarChartsSection: React.FC<LineBarChartsSectionProps> = ({
  measure,
  lineBarChartData,
  skeletonProps,
}) => {
  const { data, loading, error, showLineDataLabels, title, subtitle } =
    lineBarChartData;

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
        tooltipBackgroundTransparent: true,
        titleSize: 'H4',
        bottomTag: (
          <StyledSubtitle>
            {subtitle.prefix} <strong>{subtitle.value}</strong>
          </StyledSubtitle>
        ),
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
              ChartWrapper={StyledChartWrapper}
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

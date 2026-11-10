import { ChartDataset, ChartOptions } from 'chart.js';
import { Bar, ComparisonLine, Line } from 'components';
import { PERFORMANCE_LINE_TOOLTIP_LABELS } from 'pages/pillars/ValueCreation/PerformanceTool/constants/performanceLineTooltipLabels';
import { LineBarChartsSectionData } from 'pages/pillars/ValueCreation/PerformanceTool/types';
import { theme } from 'theme';

interface LineBarChartsGridProps {
  data?: LineBarChartsSectionData;
  lineDatasets: ChartDataset<'line'>[];
  barDatasets: ChartDataset<'bar'>[];
  highlightedIndexes: number[];
  barOptions: ChartOptions<'bar'>;
  showLineDataLabels?: boolean;
  ChartWrapper?: React.FC<{ children: React.ReactNode }>;
  LineChartContainer: React.FC<{ children: React.ReactNode }>;
  BarChartContainer: React.FC<{ children: React.ReactNode }>;
  ChartsGrid: React.FC<{ children: React.ReactNode }>;
}

export const LineBarChartsGrid: React.FC<LineBarChartsGridProps> = ({
  data,
  lineDatasets,
  barDatasets,
  highlightedIndexes,
  barOptions,
  showLineDataLabels = true,
  ChartWrapper,
  LineChartContainer,
  BarChartContainer,
  ChartsGrid,
}) => {
  const lineChart = (
    <Line
      datasets={lineDatasets}
      labels={data?.lineChart?.labels}
      formattedData={
        showLineDataLabels ? data?.lineChart?.formattedData : undefined
      }
      labelColors={[theme.colors.txt.secondary, theme.colors.txt.default]}
      highlightedIndexes={highlightedIndexes}
      options={{
        layout: { padding: { top: 20 } },
        scales: {
          y: {
            suggestedMin: data?.lineChart?.suggestedMin,
            suggestedMax: data?.lineChart?.suggestedMax,
            beginAtZero: false,
            ticks: { maxTicksLimit: 50 },
            afterFit: (axis) => {
              axis.width = 45;
            },
          },
        },
      }}
      showDivider
      tooltip={{ tooltipLabels: PERFORMANCE_LINE_TOOLTIP_LABELS }}
    />
  );

  const barChart = (
    <Bar
      datasets={barDatasets}
      labels={data?.barChart?.labels}
      formattedData={data?.barChart?.formattedData}
      stripedIndexes={data?.barChart?.stripedIndexes || []}
      size="large"
      showGrid={false}
      showDivider={false}
      axisType="none"
      options={barOptions}
    />
  );

  return (
    <ChartsGrid>
      <LineChartContainer>
        {ChartWrapper ? <ChartWrapper>{lineChart}</ChartWrapper> : lineChart}
        {data?.lineChart?.comparisonLine && (
          <ComparisonLine
            data={data.lineChart.comparisonLine.data}
            gridColumnsLength={data.lineChart.labels?.length || 0}
            gridConfig={{ paddingLeft: 5, paddingRight: 0 }}
            borderConfig={{ marginLeft: 40, marginRight: 8 }}
          />
        )}
      </LineChartContainer>
      <BarChartContainer>
        {ChartWrapper ? <ChartWrapper>{barChart}</ChartWrapper> : barChart}
        {data?.barChart?.comparisonLine && (
          <ComparisonLine
            data={data.barChart.comparisonLine.data}
            gridColumnsLength={data.barChart.labels?.length || 0}
            gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
            borderConfig={{ marginLeft: 16, marginRight: 16 }}
          />
        )}
      </BarChartContainer>
    </ChartsGrid>
  );
};

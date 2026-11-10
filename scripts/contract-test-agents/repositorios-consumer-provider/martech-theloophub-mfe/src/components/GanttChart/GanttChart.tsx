import { GanttChartBody, GanttChartHeader } from './components';
import { StyledGanttChart } from './GanttChart.styles';
import { GanttHeader, GanttRow } from './types/Gantt';

export interface GanttChartProps {
  header: GanttHeader;
  rows: GanttRow[];
  dataTestId?: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  header,
  rows,
  dataTestId,
}) => {
  return (
    <StyledGanttChart
      className="gantt-chart"
      data-testid={dataTestId ? `gantt-chart-${dataTestId}` : undefined}
    >
      <GanttChartHeader {...header} dataTestId={dataTestId} />
      <GanttChartBody rows={rows} dataTestId={dataTestId} />
    </StyledGanttChart>
  );
};

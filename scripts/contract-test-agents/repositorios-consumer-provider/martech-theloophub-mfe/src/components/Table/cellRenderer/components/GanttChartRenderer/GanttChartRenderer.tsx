import { GanttChartBody } from 'components/GanttChart/components';
import { GanttRow } from 'components/GanttChart/types/Gantt';

export interface GanttChatRendererProps {
  ganttData: GanttRow[];
  dataTestId?: string;
}

export const GanttChartRenderer = ({
  ganttData,
  dataTestId,
}: GanttChatRendererProps): JSX.Element => {
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      data-testid={dataTestId ? `gantt-chart-${dataTestId}` : undefined}
    >
      <GanttChartBody rows={ganttData} dataTestId={dataTestId} />
    </div>
  );
};

import { GanttRow } from 'components/GanttChart/types/Gantt';

import { GanttChartRow } from '../GanttChartRow/GanttChartRow';
import { StyledGanttChartBody } from './GanttChartBody.styles';

interface GanttChartBodyProps {
  rows: GanttRow[];
  dataTestId?: string;
}

export const GanttChartBody: React.FC<GanttChartBodyProps> = ({
  rows,
  dataTestId,
}) => {
  return (
    <StyledGanttChartBody
      className="gantt-body"
      data-testid={dataTestId ? `gantt-chart-body-${dataTestId}` : undefined}
    >
      {rows.map((row, index) => (
        <GanttChartRow
          key={row.id}
          row={row}
          lastRow={index === rows.length - 1}
          dataTestId={dataTestId}
        />
      ))}
    </StyledGanttChartBody>
  );
};

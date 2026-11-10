import { GanttRow } from 'components/GanttChart/types/Gantt';

import { GanttChartWithSimpleBars } from '../GanttChartSimpleBars/GanttChartSimpleBars';
import { GanttChartWithMilestones } from '../GanttChartWithMilestones/GanttChartWithMilestones';
import {
  StyledGanttChartRow,
  StyledGanttChartRowCell,
} from './GanttChartRow.styles';

interface GanttChartRowProps {
  row: GanttRow;
  lastRow: boolean;
  dataTestId?: string;
}

export const GanttChartRow: React.FC<GanttChartRowProps> = ({
  row,
  lastRow: _lastRow,
  dataTestId,
}) => {
  return (
    <StyledGanttChartRow
      style={{ maxHeight: row.style?.height }}
      data-testid={dataTestId ? `gantt-chart-row-${dataTestId}` : undefined}
    >
      {row.cells.map((cell, index) => (
        <StyledGanttChartRowCell style={row.style} key={cell.id}>
          {row.mode === 'milestones' ? (
            <GanttChartWithMilestones
              tooltip={row.tooltip}
              key={cell.id}
              cell={cell}
              cellIndex={index}
              style={row.style}
              dataTestId={dataTestId}
            />
          ) : (
            <GanttChartWithSimpleBars
              key={cell.id}
              cell={cell}
              style={row.style}
              cellIndex={index}
              dataTestId={dataTestId}
            />
          )}
        </StyledGanttChartRowCell>
      ))}
    </StyledGanttChartRow>
  );
};

import { GanttCell } from 'components/GanttChart/types/Gantt';
import { isWeekDelimiter } from 'components/GanttChart/utils/utils';

import { StyledSimpleBars } from './GanttChartSimpleBars.styles';

interface GanttChartWithSimpleBarsProps {
  cell: GanttCell;
  style?: React.CSSProperties;
  cellIndex: number;
  dataTestId?: string;
}

export const GanttChartWithSimpleBars: React.FC<
  GanttChartWithSimpleBarsProps
> = ({ cell, style, cellIndex, dataTestId }) => {
  return (
    <StyledSimpleBars
      key={cell.id}
      weekDelimiter={isWeekDelimiter(cellIndex)}
      style={{
        backgroundColor: cell.color,
        ...style,
      }}
      data-testid={dataTestId ? `gantt-simple-bar-${dataTestId}` : undefined}
    />
  );
};

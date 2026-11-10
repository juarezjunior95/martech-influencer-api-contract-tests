import { GanttCellTooltip } from 'components/GanttChart/types/Gantt';

import {
  StyledGanttChartTooltip,
  StyledGanttChartTooltipItem,
} from './GanttChartTooltip.styles';

interface GanttTooltipProps {
  tooltip: GanttCellTooltip[];
  dataTestId?: string;
}

export const GanttTooltip: React.FC<GanttTooltipProps> = ({
  tooltip,
  dataTestId,
}) => {
  return (
    <StyledGanttChartTooltip
      data-testid={dataTestId ? `gantt-tooltip-${dataTestId}` : undefined}
    >
      {tooltip.map((item, index) => (
        <StyledGanttChartTooltipItem key={item.label} firstIndex={index === 0}>
          {item.label}: {item.value}
        </StyledGanttChartTooltipItem>
      ))}
    </StyledGanttChartTooltip>
  );
};

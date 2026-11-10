import { CustomTooltip } from 'components/CustomTooltip';
import { GanttCell, GanttCellTooltip } from 'components/GanttChart/types/Gantt';
import { isWeekDelimiter } from 'components/GanttChart/utils/utils';

import { GanttTooltip } from '../GanttChartTooltip/GanttChartTooltip';
import {
  StyledGanttChartWithMilestones,
  StyledGanttChartWithMilestonesCell,
  StyledMilestone,
} from './GanttChartWithMilestones.styles';

interface GanttChartWithMilestonesProps {
  cell: GanttCell;
  tooltip?: GanttCellTooltip[];
  cellIndex: number;
  style?: React.CSSProperties;
  dataTestId?: string;
}

export const GanttChartWithMilestones: React.FC<
  GanttChartWithMilestonesProps
> = ({ cell, tooltip, cellIndex, style, dataTestId }) => {
  return (
    <StyledGanttChartWithMilestones
      weekDelimiter={isWeekDelimiter(cellIndex)}
      className="tooltip-container"
      style={style}
      data-testid={dataTestId ? `gantt-milestone-${dataTestId}` : undefined}
    >
      <>
        {tooltip ? (
          <CustomTooltip
            fillTrigger
            backgroundStyle="transparent"
            content={
              tooltip && (
                <GanttTooltip
                  tooltip={tooltip}
                  dataTestId={
                    dataTestId
                      ? `gantt-milestone-${dataTestId}-tooltip`
                      : undefined
                  }
                />
              )
            }
          >
            <StyledGanttChartWithMilestonesCell
              activeWeek={!!cell.color}
              timing={cell.timing}
              className="row"
              style={{
                backgroundColor: cell.color,
              }}
            >
              {cell.milestone && (
                <StyledMilestone
                  className="circle"
                  style={{
                    backgroundColor: cell?.milestone?.color,
                  }}
                />
              )}
            </StyledGanttChartWithMilestonesCell>
          </CustomTooltip>
        ) : (
          <StyledGanttChartWithMilestonesCell
            activeWeek={!!cell.color}
            timing={cell.timing}
            className="row"
            style={{
              backgroundColor: cell.color,
            }}
          >
            {cell.milestone && (
              <StyledMilestone
                className="circle"
                style={{
                  backgroundColor: cell?.milestone?.color,
                }}
              />
            )}
          </StyledGanttChartWithMilestonesCell>
        )}
      </>
    </StyledGanttChartWithMilestones>
  );
};

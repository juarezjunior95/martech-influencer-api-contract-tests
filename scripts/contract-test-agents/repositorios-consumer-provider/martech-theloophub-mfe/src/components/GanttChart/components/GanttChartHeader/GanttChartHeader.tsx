import { Tooltip } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';

import {
  StyledGanttChartCellContainer,
  StyledGanttChartHeaderTitle,
  StyledGanttHeader,
  StyledGanttHeaderCell,
  StyledGanttHeaderTooltip,
} from './GanttChartHeader.styles';

interface GanttChartHeaderProps {
  weekRanges: string[];
  title: string;
  headerHeight?: number;
  tooltip?: string;
  dataTestId?: string;
}

export const GanttChartHeader: React.FC<GanttChartHeaderProps> = ({
  weekRanges,
  title,
  headerHeight,
  tooltip,
  dataTestId,
}) => {
  return (
    <StyledGanttHeader
      style={{ minHeight: headerHeight }}
      data-testid={dataTestId ? `gantt-chart-header-${dataTestId}` : undefined}
    >
      <StyledGanttChartHeaderTitle>
        <span>{title}</span>
        {tooltip && (
          <Tooltip
            position="top"
            content={
              <StyledGanttHeaderTooltip>{tooltip}</StyledGanttHeaderTooltip>
            }
          >
            <div style={{ display: 'flex' }}>
              <Info />
            </div>
          </Tooltip>
        )}
      </StyledGanttChartHeaderTitle>
      <StyledGanttChartCellContainer>
        {weekRanges.map((range, index) => (
          <StyledGanttHeaderCell
            lastCell={index === weekRanges.length - 1}
            key={range}
          >
            {range}
          </StyledGanttHeaderCell>
        ))}
      </StyledGanttChartCellContainer>
    </StyledGanttHeader>
  );
};

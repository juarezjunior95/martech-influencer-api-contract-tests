import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledGanttChartRow = styled('div', {
  display: 'flex',
  flex: 1,
  borderBottom: `1px solid ${tokens.color.foundation.border.tertiary}`,
});

export const StyledGanttChartRowCell = styled('div', {
  flex: 1,
});

import { styled } from '@hexa-ui/theme';

const StyledSlideContentBaseGrid = styled('div', {
  width: '100%',
  height: 'auto',
  display: 'grid',
  gap: '16px',
  rowGap: '16px',
  columnGap: '16px',
});

const StyledLineChartBase = styled('div', {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #1414141f',
});

export const StyledSliderGrid = styled(StyledSlideContentBaseGrid, {
  marginTop: '16px',
  gridTemplateColumns: 'repeat(25, 1fr)',
  gridTemplateRows: '152px 400px 225px',
  gap: '12px',
  gridTemplateAreas: `
    "bigNumber"
    "lineChart"
    "tables"
  `,
});

export const StyledBigNumberContainer = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  gridArea: 'bigNumber',
  gridColumn: 'span 25',
});

export const StyledLineChartContainer = styled(StyledLineChartBase, {
  gridArea: 'lineChart',
  gridColumn: 'span 25',
  padding: '8px',
});

export const StyledTables = styled('div', {
  gridArea: 'tables',
  gridColumn: 'span 25',
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
});

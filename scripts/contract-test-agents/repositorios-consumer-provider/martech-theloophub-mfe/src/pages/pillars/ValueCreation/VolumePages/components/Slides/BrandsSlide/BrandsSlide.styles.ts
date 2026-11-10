import { styled } from '@hexa-ui/theme';
import {
  BaseGrid,
  StyledBaseContainer,
} from 'pages/pillars/ValueCreation/VolumePages/VolumePages.styles';

export const StyledBrandsSlideGrid = styled(BaseGrid, {
  marginTop: '16px',
  gridTemplateColumns: 'repeat(25, 1fr)',
  gap: '12px',
  gridTemplateAreas: `
    "bigNumbers"
    "lineChart"
    "barChartAndMarkets"
  `,
});

export const StyledBigNumbersContainer = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  gridArea: 'bigNumbers',
  gridColumn: 'span 25',
});

export const StyledLineChartContainer = styled(StyledBaseContainer, {
  gridArea: 'lineChart',
  gridColumn: 'span 25',
  padding: '8px',
});

export const StyledBarChartAndMarketsContainer = styled('div', {
  gridArea: 'barChartAndMarkets',
  gridColumn: 'span 25',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  minHeight: 0,
});

export const StyledBarChartWrapper = styled(StyledBaseContainer, {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '8px',
});

export const StyledMarketsTableWrapper = styled('div', {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

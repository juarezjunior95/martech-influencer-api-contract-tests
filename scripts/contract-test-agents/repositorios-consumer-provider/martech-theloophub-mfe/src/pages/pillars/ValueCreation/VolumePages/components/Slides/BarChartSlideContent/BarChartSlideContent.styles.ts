import { styled } from '@hexa-ui/theme';
import {
  BaseGrid,
  StyledBaseContainer,
} from 'pages/pillars/ValueCreation/VolumePages/VolumePages.styles';

export const StyledBarChartSliderGrid = styled(BaseGrid, {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  alignItems: 'center',
  marginTop: '16px',
});

export const StyledBarChartWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '800px',
  flexDirection: 'column',
  gap: '16px',
});

export const StyledBarChartContainer = styled(StyledBaseContainer, {
  height: '396px',
});

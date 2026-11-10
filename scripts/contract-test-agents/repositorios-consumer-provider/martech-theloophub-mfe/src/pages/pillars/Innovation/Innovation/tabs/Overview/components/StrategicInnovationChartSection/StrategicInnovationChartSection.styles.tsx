import { styled } from '@hexa-ui/theme';

export const StyledStrategicInnovationChartSection = styled('div', {
  flex: 1,
  flexWrap: 'wrap',
  minWidth: 0,
  '> *': {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
});

export const StyledStrategicInnovationChartContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '375px',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  justifyContent: 'center',
});

export const StyledStrategicInnovationBarContainer = styled('div', {
  display: 'flex',
  flex: 1,
  height: '271.5px',
  marginBottom: '$2',
});

export const StyledStrategicInnovationBigNumberContainer = styled('div', {
  flex: 1,
  '.big-number-item': {
    flex: 1,
    height: '114px',
    borderBottom: '1px solid #1414141f',
  },
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '100%',
});

export const StyledStrategicInnovationComparisonLineContainer = styled('div', {
  paddingTop: '$3',
  marginBottom: '$6',
});

import { styled } from '@hexa-ui/theme';

export const StyledStrategicInnovationItemContent = styled('div', {
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
  boxSizing: 'border-box',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  '> *': {
    flex: 1,
    minWidth: 0,
  },
});

export const StyledNoResultsStateContainer = styled('div', {
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledNoDataYet = styled('div', {
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

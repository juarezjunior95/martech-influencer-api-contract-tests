import { styled } from '@hexa-ui/theme';

export const StyledHowWeDoItCardRoot = styled('div', {
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',

  '& [data-testid="sub-pillar-card"]': {
    flex: 1,
    minHeight: 0,
    width: '100%',
    maxWidth: 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  '& [data-testid="sub-pillar-card-content"]': {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
});

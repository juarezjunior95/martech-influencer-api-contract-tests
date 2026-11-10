import { styled } from '@hexa-ui/theme';

export const StyledNoDataContainer = styled('div', {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',

  variants: {
    orientation: {
      vertical: {
        flexDirection: 'row',
      },
      horizontal: {
        flexDirection: 'column',
      },
      none: {
        flexDirection: 'column',
      },
      center: {},
    },
    inline: {
      true: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
      },
    },
  },
});

export const StyledNoDataText = styled('p', {
  margin: 0,
  fontSize: '14px',
  color: '#141414',
  fontFamily: '$paragraph',
});

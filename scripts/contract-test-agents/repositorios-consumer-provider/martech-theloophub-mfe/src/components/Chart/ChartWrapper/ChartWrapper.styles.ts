import { styled } from '@hexa-ui/theme';

export const StyledChartWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.16)',
  backgroundColor: '#ffffff',
  transition: 'background-color 150ms ease, transform 150ms ease',
  variants: {
    clickable: {
      true: {
        '&:hover': {
          transform: 'scale(1.02)',
          backgroundColor: '#FEFCF6',
          cursor: 'pointer',
        },
      },
    },
  },
});

import { styled } from '@hexa-ui/theme';

export const StyledBigNumberItem = styled('div', {
  '& > div:first-child': {
    height: '100%',
  },
  flex: 'calc(50% - 16px)',
});

export const StyledBigNumberContainer = styled('div', {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',

  variants: {
    loading: {
      true: {
        '& > div': {
          flexWrap: 'wrap',
        },
      },
    },
  },
});

export const StyledChartHeaderContainer = styled('div', {
  minWidth: '90px',
});

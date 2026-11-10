import { styled } from '@hexa-ui/theme';

export const BaseGrid = styled('div', {
  width: '100%',
  height: 'auto',
  display: 'grid',
  gap: '16px',
  rowGap: '16px',
  columnGap: '16px',
});

export const StyledBaseContainer = styled('div', {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #1414141f',
});

export const StyledSectionHeaderContainer = styled('div', {
  width: '100%',
  padding: '4px',
  display: 'flex',
  variants: {
    noPadding: {
      true: {
        padding: '0',
      },
    },
  },
});

export const StyledTag = styled('div', {
  borderRadius: '512px',
  padding: '2px 8px',
  fontFamily: '$paragraph',
  fontSize: '10px',
  color: '#5C5C5C',
  border: '1px solid #14141429',
  width: 'max-content',
});

export const StyledTagLabel = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#67665F',
  fontSize: '14px',
});

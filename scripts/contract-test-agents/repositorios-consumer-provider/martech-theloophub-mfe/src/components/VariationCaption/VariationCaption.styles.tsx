import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledVariationGrid = styled('div', {
  display: 'grid',
  marginBottom: '8px',
});

export const StyledVariationHeaderRow = styled('div', {
  gridColumn: '1 / -1',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: '500',
});

export const StyledVariationHeaderContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  flexShrink: 0,

  p: {
    fontSize: '12px',
    color: 'rgba(20, 20, 20, 0.56)',

    '&:first-child': {
      fontWeight: 'bold',
    },
  },
});

export const StyledVariationHeaderDivider = styled('div', {
  flex: 1,
});

export const StyledVariationCell = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1px',
    height: '16px',
    background: '#E0E0E0',
  },

  p: {
    fontSize: '12px',
    textAlign: 'center',
  },

  variants: {
    hasDivider: {
      true: {
        '&::before': {
          display: 'block',
        },
      },
      false: {
        '&::before': {
          display: 'none',
        },
      },
    },
    isFirstCell: {
      true: {
        '&::before': {
          display: 'none',
        },
      },
    },
  },
});

export const StyledVariationValueContainer = styled('div', {
  display: 'grid',
  width: '75%',
});

export const StyledVariationValue = styled('span', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  textAlign: 'center',
});

export const StyledParagraph = styled(Paragraph, {
  position: 'relative',
  width: '100%',

  '&::before': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1px',
    height: '16px',
    background: '#E0E0E0',
  },

  variants: {
    divider: {
      true: {
        '&::before': {
          display: 'block',
        },
      },
      false: {
        '&::before': {
          display: 'none',
        },
      },
    },
  },
});

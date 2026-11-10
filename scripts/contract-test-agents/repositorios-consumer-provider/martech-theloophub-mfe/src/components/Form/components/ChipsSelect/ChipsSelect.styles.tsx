import { styled } from '@hexa-ui/theme';

export const ChipsContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  flexWrap: 'wrap',
  gap: '8px',
  gridColumn: '1 / -1',
});

export const Chip = styled('button', {
  padding: '8px 12px',
  border: '1px solid #D9D9D9',
  borderRadius: '1rem',
  backgroundColor: '$surface_primary',
  fontSize: '$1',
  fontWeight: '$medium',
  fontFamily: '$paragraph',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: '#FFF1C2',
    borderColor: '#FFF1C2',
  },

  variants: {
    selected: {
      true: {
        backgroundColor: '#FFF1C2',
        borderColor: '#FFF1C2',
        fontWeight: '$semibold',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'auto',
        pointerEvents: 'none',

        '&:hover': {
          backgroundColor: '#ffffff',
          borderColor: '#D9D9D9',
        },
      },
    },
  },
});

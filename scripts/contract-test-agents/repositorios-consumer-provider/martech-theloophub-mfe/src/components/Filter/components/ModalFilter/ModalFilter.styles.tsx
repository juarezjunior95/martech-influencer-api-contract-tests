import { styled } from '@hexa-ui/theme';

export const ModalOverlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: '199',
  background: 'none',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.16)',
  opacity: 1,
  transition: 'opacity 0.3s ease-out',

  variants: {
    isOpen: {
      false: {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
  },
});

export const ModalFilter = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  zIndex: '200',
  bottom: '0',
  right: '0',
  width: '768px',
  height: 'calc(100vh - 55px)',
  overflow: 'auto',
  background: '#fff',
  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.16)',
  transform: 'translateX(0)',
  opacity: 1,
  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',

  variants: {
    isOpen: {
      false: {
        transform: 'translateX(100%)',
        opacity: 0,
        pointerEvents: 'none',
      },
    },
  },
});

export const StyledFilterContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '14px',
  width: '100%',
  '&:has(> *:nth-child(4))': {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
});

export const HeadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px',
  borderBottom: '1px solid rgba(20, 20, 20, 0.12)',
});

export const HeadingTitle = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
});

export const FiltersCounter = styled('div', {
  backgroundColor: '#006EDB',
  borderRadius: '512px',
  color: '#FFFFFF',
  padding: '0px 8px',
  fontFamily: '$paragraph',
  fontSize: '14px',
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
});

export const ControlButtonContainer = styled('div', {
  display: 'flex',
  gap: '8px',
});

export const ControlButton = styled('button', {
  background: 'transparent',
  border: 'none',
  color: '#5C5C5C',
  fontWeight: '600',
  fontFamily: '$paragraph',
  cursor: 'pointer',
});

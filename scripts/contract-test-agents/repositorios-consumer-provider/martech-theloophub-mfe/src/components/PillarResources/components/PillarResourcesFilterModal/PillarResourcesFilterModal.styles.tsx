import { Button, Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const ModalOverlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: '199',
  background: 'rgba(0, 0, 0, 0.16)',
  opacity: 0,
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

export const StyledModalFilter = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  zIndex: '200',
  bottom: '0',
  right: '0',
  width: '400px',
  height: 'calc(100vh - 56px)',
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

export const HeaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px',
  borderBottom: '1px solid rgba(20, 20, 20, 0.12)',
});

export const HeaderTitle = styled(Heading, {
  margin: 0,
});

export const ModalBody = styled('div', {
  padding: '24px',
  flex: 1,
});

export const OrderByField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const OrderByLabel = styled('label', {
  fontFamily: '$paragraph',
  fontSize: '14px',
  fontWeight: 500,
  color: '$neutral100',
});

export const ModalFooter = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  padding: '24px',
  borderTop: '1px solid rgba(20, 20, 20, 0.12)',
});

export const FooterButton = styled(Button, {
  minWidth: '100px',
});

import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import templateSlideOverlayImg from 'assets/img/TemplateSlide/templateSlideOverlay.png';

export const StyledTemplateContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  variants: {
    borderLeft: {
      true: {
        paddingLeft: '8px',
      },
    },
    borderRight: {
      true: {
        paddingRight: '8px',
      },
    },
    borderTop: {
      true: {
        paddingTop: '8px',
      },
    },
    borderBottom: {
      true: {
        paddingBottom: '8px',
      },
    },
  },
  background:
    'linear-gradient(217deg, var(--Gradient-Light, rgba(245, 224, 3, 0.80)) 0%, var(--Gradient-Dark, rgba(211, 162, 56, 0.80)) 75%)',
});

export const StyledTemplateContent = styled('div', {
  flex: '1 1 auto',
  width: '100%',
  padding: '16px',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#F2F2F2',
  backgroundImage: `url(${templateSlideOverlayImg})`,
  display: 'flex',
  flexDirection: 'column',
  '&:hover [data-template-slide-png-copy-action="true"]': {
    opacity: 1,
    transform: 'translate(-50%, 0)',
    pointerEvents: 'auto',
  },
  '&:focus-within [data-template-slide-png-copy-action="true"]': {
    opacity: 1,
    transform: 'translate(-50%, 0)',
    pointerEvents: 'auto',
  },
});

export const StyledFlexContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '8px',

  flex: '1 1 auto',
});

export const StyledPngCopyActions = styled('div', {
  position: 'absolute',
  top: '16px',
  left: '50%',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  opacity: 0,
  pointerEvents: 'none',
  transform: 'translate(-50%, -12px)',
  transition: 'opacity 160ms ease, transform 160ms ease',

  '&[data-visible="true"]': {
    opacity: 1,
    transform: 'translate(-50%, 0)',
    pointerEvents: 'auto',
  },
});

export const StyledPngCopyFeedback = styled('span', {
  padding: '6px 12px',
  borderRadius: '8px',
  backgroundColor: '#141414',
  color: '#ffffff',
  fontFamily: '"Work Sans", sans-serif',
  fontSize: '12px',
  lineHeight: '18px',
  whiteSpace: 'nowrap',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
});

export const StyledPngCopyButton = styled(Button, {
  width: '32px',
  minWidth: '32px',
  height: '32px',
  minHeight: '32px',
  padding: 0,
  borderRadius: '50%',
});
